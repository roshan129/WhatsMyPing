# What's My Ping?

What's My Ping is a small full-stack network utility site with SEO-friendly tool pages built on top of one shared backend.

Current pages:
- `/`
- `/ping-test`
- `/ping-google`
- `/ping-cloudflare`
- `/ping-discord`
- `/ping-youtube`
- `/ping-aws`
- `/what-is-my-ip`
- `/ip-check`
- `/check-my-ip`
- `/my-ip-address`
- `/ip-lookup`

## Stack

- Frontend: React 19 + Vite
- Backend: Node.js + Express 5
- Tooling: ESLint, Vitest, nodemon

## How It Works

The frontend renders tool-specific pages, but all of them call the same backend API layer.

The backend:
- reads a shared target map from `backend/targets.js`
- measures latency with shared logic in `backend/pingService.js`
- supports both a default blended ping test and single-target tests
- exposes a public IP lookup endpoint with shared logic in `backend/ipService.js`
- falls back from ICMP to HTTP timing if needed
- measures latency from the backend host, not directly from the browser

## Project Structure

```text
WhatsMyPing/
├── backend/
│   ├── app.js
│   ├── index.js
│   ├── ipService.js
│   ├── pingService.js
│   ├── test/
│   ├── targets.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── entry-server.jsx
│   │   ├── routes.jsx
│   │   ├── seoContent.js
│   │   └── test/
│   └── package.json
├── SPRINT.md
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
  "serverTime": 1710000000000,
  "samples": 4,
  "targets": {
    "google": 24,
    "cloudflare": 21
  },
  "details": {
    "google": {
      "label": "Google DNS",
      "host": "8.8.8.8",
      "latencyMs": 24,
      "times": [23.5, 24.2, 24.0, 24.1],
      "mode": "external-icmp"
    }
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
  "serverTime": 1710000000000,
  "target": "google",
  "label": "Google DNS",
  "host": "8.8.8.8",
  "latencyMs": 22,
  "mode": "external-icmp",
  "samples": 4,
  "times": [21.4, 22.1, 22.7, 21.8]
}
```

### `GET /api/ping-icmp?target=cloudflare`

Runs a direct one-sample ICMP test for a supported target when ICMP is available.

### `GET /api/ip`

Returns the current request IP as seen by the backend, along with the detected IP version and user agent.

Example response:

```json
{
  "ip": "203.0.113.10",
  "version": 4,
  "userAgent": "Mozilla/5.0 ..."
}
```

## Backend Notes

- Ping requests are rate-limited to 120 requests per minute per client IP.
- `/api/ping` may return `mode: "external-icmp"`, `mode: "external-http"`, or `mode: "mixed"` depending on whether ICMP succeeds for each target.
- Continuous testing in the frontend calls `/api/ping` once per second while running.
- `/api/ip` normalizes IPv4-mapped IPv6 values such as `::ffff:127.0.0.1`.

### `GET /sitemap.xml`

Returns an XML sitemap containing the current public pages.

## Frontend Behavior

- `/ping-test` runs the default blended test
- service pages like `/ping-google` or `/ping-discord` run a target-specific test
- IP pages like `/what-is-my-ip` and `/ip-check` run a public IP lookup
- all pages support:
  - page-specific title and meta description
  - prerendered HTML for SEO routes
  - internal linking between related tools
  - responsive layouts for mobile and desktop
  - 200-300 words of static SEO content

- ping pages additionally support:
  - single ping checks
  - continuous testing
  - history chart
  - min / max / average stats
  - page-specific title and meta description

- IP pages additionally support:
  - current public IP lookup
  - IP version display
  - user-agent display

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

Or install everything from the project root:

```bash
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

## Tests

Backend tests:

```bash
cd backend
npm test
```

Frontend tests:

```bash
cd frontend
npm test
```

## Environment Variables

### Backend

- `PORT`: backend port, default `4001`
- `ENABLE_CORS`: set to `true` to enable CORS
- `SERVE_FRONTEND`: set to `true` to serve the built frontend from Express
- `FRONTEND_DIST_PATH`: custom path to the frontend build output
- `PUBLIC_SITE_URL`: canonical public site URL used in the sitemap, for example `https://whatsmyping.com`
- `ENABLE_SIMPLE_ANALYTICS`: set to `true` to accept lightweight first-party analytics events at `/api/analytics`

### Frontend

- `VITE_API_BASE_URL`: optional API base URL
- `VITE_SITE_URL`: canonical public site URL used for prerendered canonical and Open Graph URLs
- `VITE_ENABLE_SIMPLE_ANALYTICS`: set to `true` to send simple first-party pageview and interaction events to `/api/analytics`
- `VITE_CLOUDFLARE_ANALYTICS_TOKEN`: optional Cloudflare Web Analytics token for loading the analytics beacon in the browser

If `VITE_API_BASE_URL` is not set, the Vite dev server proxies `/api` and `/health` to `http://localhost:4001`.
For production, prefer either:
- same-origin deploys, where the backend serves the built frontend and `VITE_API_BASE_URL` stays unset
- split deploys, where `VITE_API_BASE_URL` points at your backend origin and `ENABLE_CORS=true` is enabled on the backend

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
- `dist/what-is-my-ip/index.html`
- `dist/ip-check/index.html`
- `dist/check-my-ip/index.html`
- `dist/my-ip-address/index.html`
- `dist/ip-lookup/index.html`

Serve the built frontend from the backend:

```bash
cd backend
SERVE_FRONTEND=true npm start
```

Recommended production settings:

```bash
export PUBLIC_SITE_URL=https://your-domain.example
export VITE_SITE_URL=https://your-domain.example
export ENABLE_SIMPLE_ANALYTICS=true
export VITE_ENABLE_SIMPLE_ANALYTICS=true
```

## SEO Notes

- Each tool page has its own title, meta description, heading, and static content.
- Canonical URLs and Open Graph metadata are generated from `VITE_SITE_URL`.
- The sitemap is available at `/sitemap.xml`.
- The frontend build prerenders the route HTML so crawlers can see page content without waiting for client-side rendering.
- Ping pages and IP pages link to related tools internally.
- For production indexing, register your real deployed domain in Google Search Console and submit the sitemap from that live domain.

## Launch Checklist

- Set `PUBLIC_SITE_URL` and `VITE_SITE_URL` to your live domain before the production build.
- Decide whether to use Cloudflare Web Analytics, simple first-party analytics, or both.
- If frontend and backend are on different origins, set `VITE_API_BASE_URL` and enable backend CORS.
- Run `npm test` in both `backend` and `frontend`, then run a full `npm run build` in `frontend`.
