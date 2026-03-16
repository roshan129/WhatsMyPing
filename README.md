# What's My Ping?

What's My Ping is a small full-stack latency tool with SEO-friendly ping pages built on top of one shared backend.

Current pages:
- `/`
- `/ping-test`
- `/ping-google`
- `/ping-cloudflare`
- `/ping-discord`
- `/ping-youtube`
- `/ping-aws`

## Stack

- Frontend: React 19 + Vite
- Backend: Node.js + Express 5
- Tooling: ESLint, nodemon

## How It Works

The frontend renders service-specific ping pages, but all of them call the same backend API.

The backend:
- reads a shared target map from `backend/targets.js`
- measures latency with shared logic in `backend/pingService.js`
- supports both a default blended ping test and single-target tests
- falls back from ICMP to HTTP timing if needed

## Project Structure

```text
WhatsMyPing/
├── backend/
│   ├── index.js
│   ├── pingService.js
│   ├── targets.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── routes.jsx
│   │   └── seoContent.js
│   └── package.json
└── README.md
```

## Supported Ping Targets

- `google`
- `cloudflare`
- `discord`
- `youtube`
- `aws`

Default `/ping-test` behavior:
- pings `google`
- pings `cloudflare`
- returns an average latency

## API

### `GET /health`

Returns:

```json
{ "status": "ok" }
```

### `GET /api/targets`

Returns the configured target list:

```json
{
  "targets": {
    "google": { "label": "Google DNS", "host": "8.8.8.8" }
  }
}
```

### `GET /api/ping`

Default mode runs the blended ping test against Google and Cloudflare.

Example response:

```json
{
  "message": "pong",
  "samples": 4,
  "targets": {
    "google": 24,
    "cloudflare": 21
  },
  "average": 23,
  "latencyMs": 23,
  "mode": "external-icmp"
}
```

### `GET /api/ping?target=google`

Single-target mode runs a focused test.

Example response:

```json
{
  "message": "pong",
  "target": "google",
  "label": "Google DNS",
  "host": "8.8.8.8",
  "latencyMs": 22,
  "mode": "external-icmp",
  "samples": 4
}
```

### `GET /api/ping-icmp?target=cloudflare`

Runs a direct one-sample ICMP test for a supported target when ICMP is available.

### `GET /sitemap.xml`

Returns an XML sitemap containing the current public pages.

## Frontend Behavior

- `/ping-test` runs the default blended test
- service pages like `/ping-google` or `/ping-discord` run a target-specific test
- all pages support:
  - single ping checks
  - continuous testing
  - history chart
  - min / max / average stats
  - page-specific title and meta description
  - 200-300 words of static SEO content

## Local Setup

Prerequisites:
- Node.js 18+
- npm

Install dependencies:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Defaults:
- backend: `http://localhost:4001`
- frontend: `http://localhost:5173`

## Environment Variables

### Backend

- `PORT`: backend port, default `4001`
- `ENABLE_CORS`: set to `true` to enable CORS
- `SERVE_FRONTEND`: set to `true` to serve the built frontend from Express
- `FRONTEND_DIST_PATH`: custom path to the frontend build output

### Frontend

- `VITE_API_BASE_URL`: optional API base URL

If `VITE_API_BASE_URL` is not set, the Vite dev server proxies `/api` and `/health` to `http://localhost:4001`.

## Build

Build the frontend:

```bash
cd frontend
npm run build
```

The frontend build now prerenders the public SEO pages into static HTML files such as:
- `dist/index.html`
- `dist/ping-test/index.html`
- `dist/ping-google/index.html`
- `dist/ping-discord/index.html`

Serve the built frontend from the backend:

```bash
cd backend
SERVE_FRONTEND=true npm start
```

## SEO Notes

- Each tool page has its own title, meta description, heading, and static content.
- The sitemap is available at `/sitemap.xml`.
- The frontend build prerenders the route HTML so crawlers can see page content without waiting for client-side rendering.
- For production indexing, register your real deployed domain in Google Search Console and submit the sitemap from that live domain.
