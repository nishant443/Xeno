# Xeno Frontend

React dashboard for the Shopify multi-tenant ingestion backend.

## Structure

```
src/
  components/   # layout, charts, cards, shared UI
  pages/        # routed views (login, dashboard, etc.)
  services/     # axios wrappers hitting backend
  hooks/        # reusable React hooks
  context/      # global auth provider
  utils/        # helpers and constants
  App.jsx       # router + layout shell
  main.jsx      # entry point (Vite)
```

## Getting Started

1. `npm install`
2. Copy `.env.example` → `.env` (if you add Vite env vars like `VITE_API_URL`)
3. `npm run dev`

Backend defaults to `http://localhost:4000`. Update `src/services/api.js` if needed.

## Available Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview build output

## Environment Variables

| Name | Description |
| --- | --- |
| `VITE_API_URL` | Base URL for backend (defaults to `http://localhost:4000/api`) |
