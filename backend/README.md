# Xeno Backend

Express + Sequelize backend for onboarding Shopify tenants, ingesting store data, and exposing metrics.

## Structure

```
src/
  config/        # database, env, logger helpers
  models/        # Sequelize models and associations
  services/      # business logic + Shopify integration + custom events
  controllers/   # request handlers
  routes/        # Express routers
  middlewares/   # auth, tenant, error handling
  utils/         # helpers and cron jobs
  app.js         # Express app wiring
  server.js      # bootstrap + DB connection
```

## Getting Started

1. `npm install`
2. Copy `.env` (or create one) and fill credentials.
3. `npm run dev` to start with nodemon.

## Environment

| Variable | Description |
| --- | --- |
| `PORT` | API port |
| `DB_*` | MySQL credentials |
| `SHOPIFY_*` | Shopify API keys |
  | `WEBHOOK_SECRET` | HMAC validation secret |
| `JWT_SECRET` | Secret for signed auth tokens |

## Scripts

- `npm run dev`: start with nodemon
- `npm start`: production server
