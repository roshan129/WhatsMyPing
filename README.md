 # What's My Ping? – Project Plan

This document describes, in detail, how to build the **"What's My Ping?"** web application: a simple site where a user can check their current network latency (ping) in a way that is meaningful for online gaming and general connectivity.

The project will consist of:
- A **backend service** that can measure latency and expose a secure API.
- A **web frontend** that lets users run tests, see their ping clearly, and understand what it means for gameplay.

The implementation is organized into **sprints** and **user stories**, with tasks and acceptance criteria for each.

---

## High-Level Architecture

- **Frontend**
  - Technology: React + Vite (TypeScript optional, can be added later).
  - Responsibilities:
    - Provide a clean, responsive UI.
    - Allow the user to start/stop ping tests.
    - Display current ping, average, min/max, and a small history graph.
    - Indicate simple qualitative status (e.g., "Excellent", "Good", "Playable", "Laggy").

- **Backend**
  - Technology: Node.js + Express (plain JavaScript, TypeScript can be added later).
  - Responsibilities:
    - Provide an HTTP API endpoint to measure latency.
    - Option 1 (simpler): Measure **HTTP round-trip time** between frontend and backend.
    - Option 2 (later enhancement): Use system `ping` or other OS-level tooling from the server to ping a configurable host (e.g., `8.8.8.8`, game servers, etc.).
    - Optionally provide WebSocket for streaming periodic ping results.

- **Communication Pattern**
  - Initial version: Frontend calls a REST endpoint like `GET /api/ping` repeatedly, measures server response times, and uses those as "ping" values.
  - Possible enhancement: Backend sends timestamp, frontend compares with client timestamp to adjust for clock differences if necessary.

---

## Sprint 0 – Project Setup & Planning

### Story 0.1 – Initialize Repository and Structure

**As a** developer  
**I want** a clean project structure  
**So that** frontend and backend can be developed independently and maintained easily.

**Tasks**
- Create the base repository/folder structure:
  - Root:
    - `frontend/`
    - `backend/`
    - `README.md` (this file)
  - Optional: `.gitignore` suitable for Node.js projects.
- Decide on package managers (e.g., `npm` or `yarn`); assume `npm` for now.

**Acceptance Criteria**
- Root folder contains clear separation between `frontend` and `backend`.
- Project is ready to initialize Node.js projects in both subfolders.

---

### Story 0.2 – Backend Node.js Scaffold

**As a** backend developer  
**I want** a minimal Node.js project  
**So that** I can quickly add APIs to measure latency.

**Tasks**
- In `backend/`, create a `package.json` with:
  - Name, version, and scripts:
    - `dev`: run the server in development mode (e.g., using `nodemon`).
    - `start`: run the server in production mode with Node.
  - Dependencies:
    - `express` – HTTP server.
    - `cors` – to allow calls from the frontend during development.
  - Dev dependencies:
    - `nodemon` – auto-restart server on code changes.
- Create entrypoint file (placeholder, no logic yet), e.g. `backend/index.js`:
  - Import `express`.
  - Create a basic app (`const app = express()`).
  - Add basic middleware (`cors`, JSON parsing).
  - Add a simple health check route `GET /health` returning `{ status: 'ok' }`.
  - Listen on a configurable port (e.g. `PORT` env with default 4000).

**Acceptance Criteria**
- Running `npm install` and `npm run dev` in `backend/` starts a server.
- `GET /health` returns a 200 response with basic JSON.

---

### Story 0.3 – Frontend React Scaffold

**As a** frontend developer  
**I want** a modern frontend scaffold  
**So that** I can build a pleasant UI quickly.

**Tasks**
- In `frontend/`, initialize a Vite + React project (can be done either via CLI or manual setup):
  - `package.json` with:
    - Dependencies: `react`, `react-dom`.
    - Dev dependencies: `vite`, relevant React plugins.
    - Scripts:
      - `dev`: start the Vite dev server.
      - `build`: create a production build.
      - `preview`: preview the production build.
- Basic file structure:
  - `index.html` – root HTML template with `div#root`.
  - `src/main.jsx` (or `.tsx`) – React entrypoint that mounts an `App` component.
  - `src/App.jsx` – simple placeholder UI that just says "What's My Ping?" for now.
  - `src/styles.css` or equivalent – placeholder for global styles.
- Configure Vite to:
  - Run on a dev port (e.g. 5173).
  - Optionally use a proxy to forward `/api` requests to backend `http://localhost:4000` during development.

**Acceptance Criteria**
- Running `npm install` and `npm run dev` in `frontend/` serves a React app.
- Landing page displays a heading like "What's My Ping?".

---

### Story 0.4 – Shared Developer Documentation

**As a** contributor  
**I want** clear setup instructions  
**So that** I can run both frontend and backend locally.

**Tasks**
- Extend this `README.md` with:
  - Prerequisites:
    - Node.js version (e.g. 18+).
    - npm.
  - Setup steps:
    - `cd backend && npm install`.
    - `cd frontend && npm install`.
  - How to run:
    - Start backend: `npm run dev` from `backend/`.
    - Start frontend: `npm run dev` from `frontend/`.
  - How to configure ports and environment variables if needed.

**Acceptance Criteria**
- A new developer can follow the `README.md` to:
  - Install dependencies.
  - Start the backend and frontend.
  - Access the running frontend in a browser.

---

## Sprint 1 – Basic Ping Measurement (HTTP Round Trip)

Goal: Provide a minimal, working version of "ping" based on HTTP request/response latency between frontend and backend.

### Story 1.1 – Backend Ping Endpoint

**As a** backend service  
**I want** a simple ping endpoint  
**So that** the frontend can request a quick response to measure latency.

**Tasks**
- In `backend/index.js`, add a route `GET /api/ping` that:
  - Returns current server timestamp, e.g. `{ serverTime: Date.now() }`.
  - Optionally includes a message like `{ message: 'pong' }`.
- Ensure CORS is enabled for the frontend origin in development.

**Acceptance Criteria**
- `GET /api/ping` returns a 200 response with JSON in less than ~10 ms locally (excluding network overhead).
- Endpoint is documented in `README.md` (or a small `backend/README.md`).

---

### Story 1.2 – Frontend "Single Ping" Button

**As a** user  
**I want** a button that checks my ping once  
**So that** I can get a quick idea of my latency.

**Tasks**
- In `src/App.jsx`:
  - Add state to store:
    - Last ping value in milliseconds.
    - Error state if request fails.
  - Add a button labeled "Check Ping" or similar.
  - On click:
    - Record a `startTime` (`performance.now()` on the client).
    - Call `/api/ping` via `fetch` or `axios`.
    - When the response returns, compute `latencyMs = performance.now() - startTime`.
    - Display latency clearly (e.g. "Your ping: 24 ms").
- Handle loading:
  - Disable the button while a ping is in progress.
  - Show a small spinner or "Testing..." message.

**Acceptance Criteria**
- Clicking "Check Ping" performs one request to `/api/ping`.
- Latency in milliseconds is displayed to the user after the response.
- UI handles errors gracefully (e.g. "Could not reach server").

---

### Story 1.3 – Simple Ping Quality Label

**As a** gamer  
**I want** a simple description of my ping quality  
**So that** I can quickly understand if my network is good enough for gaming.

**Tasks**
- Define thresholds for ping quality, e.g.:
  - Excellent: \(\leq 30\) ms.
  - Good: \(31 – 60\) ms.
  - Playable: \(61 – 100\) ms.
  - Poor: \(> 100\) ms.
- Add a small helper function in the frontend that takes `latencyMs` and returns a label + color.
- Display this label near the ping value, e.g.:
  - "Status: Excellent" (green).
  - "Status: Poor" (red).

**Acceptance Criteria**
- When latency is calculated, the correct label and color are displayed.
- Labels and colors adjust when ping is re-tested and changes.

---

## Sprint 2 – Continuous Ping & History

Goal: Allow users to run continuous ping tests and see trends.

### Story 2.1 – Continuous Ping Mode

**As a** user  
**I want** continuous ping measurements  
**So that** I can see how my latency behaves over time.

**Tasks**
- In the frontend:
  - Add a "Start Test" / "Stop Test" toggle.
  - When test is started:
    - Run a ping every N milliseconds (e.g. 1 second) using the same `/api/ping` endpoint.
    - Use `setInterval` or `requestAnimationFrame`-based loop (with care to avoid drift).
  - When stopped:
    - Clear the interval and stop making requests.
- Decide on maximum history size (e.g. keep last 60 measurements, 1 minute).

**Acceptance Criteria**
- User can start and stop continuous ping tests.
- While running, ping values update at roughly the configured interval.
- When stopped, no more requests are sent to `/api/ping`.

---

### Story 2.2 – Ping History Display (List)

**As a** user  
**I want** to see a history of ping values  
**So that** I can understand fluctuation and spikes.

**Tasks**
- Maintain an array in state of recent ping measurements, e.g.:
  - Each entry: `{ timestamp, latencyMs }`.
- Display:
  - Latest ping.
  - Average ping.
  - Minimum and maximum ping for the current session.
- Simple list/table:
  - Show last N measurements (e.g. 10–20 rows) with time and latency.

**Acceptance Criteria**
- When continuous ping is enabled, the list updates with each new measurement.
- Summary stats (avg/min/max) are visible and correct.

---

### Story 2.3 – Basic Graph (Optional in Early Version)

**As a** visual user  
**I want** a basic graph of my ping over time  
**So that** I can visually spot spikes and jitter.

**Tasks**
- Choose a simple graphing approach:
  - Option A: Lightweight chart library (e.g. `recharts`, `chart.js`, or similar).
  - Option B: Manual SVG path rendering (for minimal dependencies).
- Display a line chart of `latencyMs` over time for the current session.
- Make sure performance is acceptable for the intended history size.

**Acceptance Criteria**
- A simple line graph is visible and updates as new ping data comes in.
- Graph reflects the same data as the text/list view.

---

## Sprint 3 – Backend Enhancements (Optional / Advanced)

Goal: Provide more realistic ping measurements (e.g. ICMP ping, game servers), and more robust backend behavior.

### Story 3.1 – Configurable Ping Target

**As a** power user  
**I want** to choose what server to ping  
**So that** I can test latency to specific game servers or regions.

**Tasks**
- Backend:
  - Extend `/api/ping` to accept a query parameter like `targetHost`.
  - Validate `targetHost` against an allowlist or pattern to avoid abuse (e.g. only known domains, or a predefined set of regions).
- Frontend:
  - Add a dropdown or input field:
    - Example options: "Google DNS (8.8.8.8)", "Cloudflare (1.1.1.1)", "Custom (advanced)".
  - Pass the selected target to the backend when calling `/api/ping`.

**Acceptance Criteria**
- User can select from at least 2–3 predefined targets.
- Ping results clearly indicate which target is being tested.
- Backend rejects unsafe or malformed `targetHost` values.

---

### Story 3.2 – Server-Side ICMP Ping (If Allowed)

**As a** accuracy-focused user  
**I want** server-side ICMP ping capability  
**So that** I get more realistic network latency numbers.

**Tasks**
- Investigate feasibility:
  - Check whether the deployment environment allows calling the OS `ping` command or using a Node library to send ICMP packets.
- Implement a backend service that:
  - On `/api/ping-icmp`, runs one or more ICMP pings to the target host.
  - Parses the output and returns latency metrics (average, min, max).
- Apply safety limits:
  - Timeout for ping commands.
  - Limit number of pings per request.

**Acceptance Criteria**
- `GET /api/ping-icmp` returns ICMP-based latency (where environment supports it).
- Errors are handled gracefully if ICMP is not available.
- Frontend can optionally switch between "HTTP ping" and "ICMP ping" modes.

---

### Story 3.3 – Rate Limiting and Basic Security

**As a** service owner  
**I want** basic rate limiting and security  
**So that** the ping service cannot be abused easily.

**Tasks**
- Implement basic rate limiting on ping endpoints (e.g. using `express-rate-limit`).
- Restrict CORS origins in production.
- Add simple logging for:
  - Ping requests.
  - Errors.
- Document these considerations in `README.md`.

**Acceptance Criteria**
- Excessive ping requests from a single client/IP are throttled.
- CORS is restricted appropriately for production.
- Logs provide basic observability into usage and errors.

---

## Sprint 4 – UX, Styling, and Polish

Goal: Make the application feel modern, friendly, and easy to use.

### Story 4.1 – Visual Design & Layout

**As a** user  
**I want** a clean, modern UI  
**So that** the app feels professional and easy to use.

**Tasks**
- Choose a styling approach:
  - CSS modules, Tailwind CSS, or a simple design system.
- Design the main layout:
  - Header with app name "What's My Ping?".
  - Main content area:
    - Current ping + status.
    - Start/Stop buttons.
    - Optional graph and history.
  - Footer with small explanation of what ping is.
- Ensure responsiveness:
  - Works well on desktop and mobile screens.

**Acceptance Criteria**
- UI looks clean and consistent.
- Key actions (checking ping, starting a test) are obvious and accessible.
- Layout works on common screen sizes.

---

### Story 4.2 – Explaining Ping to Users

**As a** less-technical user  
**I want** a simple explanation of ping and its ranges  
**So that** I understand what the numbers mean.

**Tasks**
- Add a short explanation section:
  - What is ping/latency?
  - Rough guidelines for gaming (e.g., under 60 ms is good, etc.).
- Optionally include FAQs:
  - "Why does my ping differ from in-game ping?"
  - "What factors affect ping?"

**Acceptance Criteria**
- App includes a concise, friendly explanation of ping.
- Content is easy to read and not overly technical.

---

## Sprint 5 – Deployment & Maintenance

Goal: Make the app easy to deploy and maintain in real environments.

### Story 5.1 – Environment Configuration

**As a** DevOps engineer  
**I want** configuration via environment variables  
**So that** I can deploy the app in different environments easily.

**Tasks**
- Backend:
  - Read port and environment (dev/prod) from environment variables.
  - Allow configuration of default ping target (if implemented).
- Frontend:
  - Use environment variables (e.g. Vite `import.meta.env`) to configure API base URL.
- Add `.env.example` files to show required variables.

**Acceptance Criteria**
- App runs correctly when configured with environment variables instead of hardcoded values.
- There is a clear example of required configuration in `.env.example`.

---

### Story 5.2 – Production Build & Static Hosting

**As a** maintainer  
**I want** to build and host the app  
**So that** real users can access it.

**Tasks**
- Configure frontend build:
  - Ensure `npm run build` in `frontend/` outputs static assets to `dist/`.
- Decide on deployment strategy:
  - Option A: Host frontend on static hosting (e.g. Netlify, Vercel) and backend on a separate Node server.
  - Option B: Serve built frontend from the backend Express server (e.g. serve `frontend/dist`).
- Document deployment steps in `README.md`:
  - Example commands or a simple deployment checklist.

**Acceptance Criteria**
- A production build of the frontend can be generated with one command.
- Backend can either:
  - Serve the static frontend, or
  - Be used alongside a static hosting solution.
- Deployment steps are clearly documented.

---

## Environment Configuration (Implemented)

Backend (`backend/.env.example`)
- `PORT` (default `4001`)
- `DEFAULT_PING_TARGET` (`backend`, `google-dns`, `cloudflare`)
- `SERVE_FRONTEND` (`true` to serve the built frontend from Express)
- `FRONTEND_DIST_PATH` (path to `frontend/dist`)
- `ENABLE_CORS` (`true` when frontend is hosted separately)

Frontend (`frontend/.env.example`)
- `VITE_API_BASE_URL` (leave blank in dev to use Vite proxy)

Notes
- In development, leave `VITE_API_BASE_URL` empty and run the backend on `http://localhost:4001`.
- In production, set `VITE_API_BASE_URL` to your backend origin, e.g. `https://api.example.com`.
 - If you enable `SERVE_FRONTEND=true`, you can leave `VITE_API_BASE_URL` empty and use a single origin.

## Deployment Checklist (Simple)

1. Backend
   - Set environment variables from `backend/.env.example`.
   - Install deps: `npm install` in `backend/`.
   - Start server: `npm run start`.
2. Frontend (static hosting)
   - Set `VITE_API_BASE_URL` to the backend URL.
   - Install deps: `npm install` in `frontend/`.
   - Build: `npm run build` (outputs `frontend/dist`).
   - Deploy `frontend/dist` to your static host.
3. Frontend (served by backend)
   - Build frontend: `npm run build` in `frontend/`.
   - Set `SERVE_FRONTEND=true` in `backend/.env`.
   - Optionally set `FRONTEND_DIST_PATH` if you deploy the frontend build elsewhere.
   - Start backend with the same environment variables.

---

## Developer Setup – Step-by-Step Summary

Once the scaffolding is in place, a developer should be able to:

1. **Install prerequisites**
   - Install Node.js (18+ recommended).
   - Install npm (usually bundled with Node.js).

2. **Backend setup**
   - `cd backend`
   - `npm install`
   - `npm run dev`
   - Confirm `GET http://localhost:4000/health` works.

3. **Frontend setup**
   - In a new terminal: `cd frontend`
   - `npm install`
   - `npm run dev`
   - Open the URL printed by Vite (e.g. `http://localhost:5173/`) in the browser.

4. **Testing basic ping**
   - Confirm the UI loads.
   - Click the "Check Ping" button.
   - Observe ping value and quality label.

This `README.md` is the guiding document for implementing the "What's My Ping?" application step by step using sprints and stories. As features are implemented, we can update this file with more details, screenshots, and any architectural decisions made along the way.
