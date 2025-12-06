# Xeno

> Multi-tenant Shopify ingestion backend and React + Vite frontend dashboard

This repository contains a small demo application that ingests Shopify store data (orders, customers, products, lifecycle events) into a MySQL-backed backend and exposes a dashboard UI to view metrics.

**Contents**
- `backend/` — Express + Sequelize API and background ingestion logic
- `frontend/` — React (Vite) dashboard UI

**Status**: development

**Security note**: Do not commit secrets. Rotate the Shopify keys present in `.env` if they were pushed to a public repo.

**Quick Links**
- Backend entry: `backend/src/server.js`
- Frontend entry: `frontend/src/main.jsx`

**Table of contents**
- **Setup**
- **Architecture**
- **API**
- **Database schema**
- **Running locally**
- **Deploying to Render**
- **Known limitations / assumptions**

---

**Setup**

- Requirements
  - Node.js (18+ recommended)
  - npm
  - MySQL (local or managed)

- Environment
  1. Copy `backend/.env` from the project root and fill values (example variables present in `backend/.env`):
     - `PORT` (defaults to `4000`)
     - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
     - `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_ACCESS_TOKEN`
     - `WEBHOOK_SECRET`, `JWT_SECRET`
  2. Frontend expects an API base URL env var `VITE_API_URL` (for Vite builds). Example: `https://your-backend.com/api`

- Install & run locally
  - Backend
    ```powershell
    cd backend
    npm install
    npm run dev   # uses nodemon (development)
    # or: npm start
    ```
  - Frontend
    ```powershell
    cd frontend
    npm install
    npm run dev   # open http://localhost:5173
    ```

---

**Architecture (ASCII diagram)**

Backend and frontend are separate projects. The backend exposes REST endpoints and ingests data from Shopify (via stored tokens). A scheduler (cronJobs) can run ingestion flows.

```
                +--------------------+           +-------------------+
                |   Shopify Store    |  <-----   |  Shopify Webhooks |
                +--------------------+           +-------------------+
                          |                                |
                          |    (Shopify API + webhooks)    |
                          v                                v
                       +---------------------------------------------+
                       |                 Backend (Express)          |
                       |  - routes: /api/auth, /api/metrics, etc.   |
                       |  - services: metricService, ingestion etc. |
                       |  - models: Sequelize (MySQL)               |
                       +---------------------------------------------+
                                          |
                                          | SQL (MySQL) via Sequelize
                                          v
                                 +------------------------+
                                 |      MySQL Database    |
                                 +------------------------+

Frontend (React / Vite)  <----->  Backend REST API (HTTPS)
```

---

**API Endpoints**

All backend endpoints are mounted under `/api` as defined in `backend/src/app.js`.

- GET `/api/health`
  - Description: basic health check
  - Response: `{ status: 'ok' }`

- Auth routes: `/api/auth` (see `backend/src/routes/authRoutes.js`)
  - POST `/api/auth/login` — login flow (returns auth token)
  - POST `/api/auth/logout` — logout

- Tenant management: `/api/tenants` (see `backend/src/routes/tenantRoutes.js`)

- Ingestion: `/api/ingestion` (see `backend/src/routes/ingestionRoutes.js`)
  - POST `/api/ingestion/run` — trigger manual ingestion

- Metrics: `/api/metrics` (see `backend/src/routes/metricRoutes.js`)
  - GET `/api/metrics` — dashboard aggregates (customers, orders, products, totalSales, lifecycle counts)
  - GET `/api/metrics/orders-by-date` — orders aggregated by date (query params `startDate`, `endDate`)
  - GET `/api/metrics/top-customers` — top customers (query param `limit`)
  - GET `/api/metrics/orders` — recent orders (id, name, total, updatedAt)
  - GET `/api/metrics/customers` — recent customers (id, name, total, updatedAt)

Notes: most metric routes are protected by `authMiddleware` and `tenantMiddleware`. See `backend/src/middlewares` for details.

---

**Database schema (models overview)**

The app uses Sequelize models defined in `backend/src/models` — the main models and key fields are:

- `Customer` (table `customers`)
  - `id` (BIGINT, primary key)
  - `tenantId` (UUID)
  - `firstName` (STRING)
  - `lastName` (STRING)
  - `email` (STRING)
  - `totalSpent` (DECIMAL(10,2))

- `Order` (table `orders`)
  - `id` (BIGINT, primary key)
  - `tenantId` (UUID)
  - `customerId` (BIGINT)
  - `totalPrice` (DECIMAL(10,2))
  - `currency` (STRING(3))
  - `processedAt` (DATE)

- `Product` (table `products`) — basic product attributes (see model file)

- `CustomEvent` (table `custom_events`) — stores lifecycle events like `cart_abandoned`, `checkout_started`

Sequelize `sync()` is called on server start (see `backend/src/server.js`) which will create tables if they do not exist. For production, prefer migrations instead of `sync()`.

---

**Running in production (Render quick checklist)**

1. Create a managed MySQL instance and note the connection details.
2. In Render, create a Web Service for the backend using the `backend` folder as the root.
   - Start command: `npm run start`
   - Add environment variables matching `backend/.env` (`DB_*`, `SHOPIFY_*`, `JWT_SECRET`, `WEBHOOK_SECRET`)
3. Create a Static Site service for the frontend using the `frontend` folder as the root.
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Add env var `VITE_API_URL` set to your backend URL + `/api`

---

**Known limitations & assumptions**

- Secrets in `backend/.env` (Shopify keys) are present in the repository root for convenience; you must rotate these and use Render environment variables for production. Never commit secrets.
- Database migrations are not included — the app uses `sequelize.sync()` in `server.js`. This is acceptable for development but not recommended for production (use Sequelize migrations instead).
- The app assumes a MySQL-compatible database (MySQL / PlanetScale / RDS). PlanetScale may require adapter or connection settings (see PlanetScale docs).
- Shopify integration uses a stored access token (`SHOPIFY_ACCESS_TOKEN`) — if this token expires or is revoked, ingestion will fail until replaced.
- Error handling and rate limiting are basic. For production use, add robust error reporting, retries for transient Shopify errors, and rate limiting.

---

If you want, I can also:
- Add a `render.yaml` manifest to declare both the backend and frontend services for Render.
- Add a `systemd`/`pm2` example for self-hosting on a VPS.
- Convert `sequelize.sync()` to proper migrations and add a migration script.

Contact / Next steps
- Tell me which deployment path you'd like (Render manifest, Vercel + Render, or VPS), and I will generate the required configuration files and step-by-step commands.
