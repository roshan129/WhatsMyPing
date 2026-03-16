# What's My Ping?

What's My Ping is a small full-stack app for checking network latency in a way that feels useful for gaming and general connection quality.

The project has two parts:
- `frontend/`: a React + Vite UI for running ping tests and viewing live stats
- `backend/`: an Express API that measures latency against public DNS targets

## Current Features

- Run a one-time ping test
- Start and stop a continuous ping test
- See current latency in milliseconds
- View ping quality labels: `Excellent`, `Good`, `Playable`, `Poor`
- Track recent history with min, max, average, and a small chart
- Backend fallback from ICMP ping to HTTP-based timing when raw ping is unavailable

## Tech Stack

- Frontend: React 19, Vite
- Backend: Node.js, Express 5
- Extras: `express-rate-limit`, optional `cors`, `nodemon`

## Project Structure

```text
WhatsMyPing/
├── backend/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## How It Works

The frontend calls `GET /api/ping` on the backend.

The backend:
- pings Cloudflare DNS at `1.1.1.1`
- pings Google DNS at `8.8.8.8`
- averages the results
- returns the final latency as `latencyMs`

If ICMP ping is blocked in the runtime environment, the backend falls back to measuring HTTP request timing against public DNS-over-HTTPS endpoints.

## Prerequisites

- Node.js 18+
- npm

## Local Setup

Install dependencies in both apps:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:4001` by default.

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on Vite's local dev server, typically `http://localhost:5173`.

In local development, the frontend proxies `/api` and `/health` requests to `http://localhost:4001` unless `VITE_API_BASE_URL` is set.

## Environment Variables

### Backend

- `PORT`: backend port, default `4001`
- `ENABLE_CORS`: set to `true` to enable CORS middleware
- `SERVE_FRONTEND`: set to `true` to serve the built frontend from Express
- `FRONTEND_DIST_PATH`: custom path to the frontend build output

Note:
- `DEFAULT_PING_TARGET` exists in the backend code but is not currently used by the main `/api/ping` route.

### Frontend

- `VITE_API_BASE_URL`: optional base URL for API requests

Examples:
- leave it unset for local proxy-based development
- set it to something like `http://localhost:4001` if you want the frontend to call the backend directly

## API

### `GET /health`

Returns:

```json
{ "status": "ok" }
```

### `GET /api/ping?samples=4`

Query params:
- `samples`: number of samples to collect, clamped from `1` to `5`

Returns a payload like:

```json
{
  "message": "pong",
  "serverTime": 1710000000000,
  "mode": "external-icmp",
  "samples": 4,
  "finalPing": 32,
  "latencyMs": 32
}
```

The full response also includes per-target timing details for Cloudflare and Google.

### `GET /api/ping-icmp?target=cloudflare`

Supported targets:
- `cloudflare`
- `google-dns`

This endpoint runs a direct one-shot ICMP ping to the requested host and returns the parsed latency.

## Frontend Behavior

- `Check Ping Once` sends `/api/ping?samples=4`
- `Start Continuous Test` sends `/api/ping?samples=2` every second
- The UI keeps the last 60 samples in memory for stats and charting
- Recent results are shown in a table with local time formatting

## Notes and Limitations

- The UI currently does not expose target selection even though the code contains an unused target list.
- Ping values from this app may differ from game-reported ping because game servers, routes, and tick rates are different.
- ICMP ping depends on OS/runtime support and may be restricted in some hosting environments.

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

To serve the built frontend from the backend:

```bash
cd backend
SERVE_FRONTEND=true npm start
```

By default, the backend will look for the frontend build at `../frontend/dist`.
