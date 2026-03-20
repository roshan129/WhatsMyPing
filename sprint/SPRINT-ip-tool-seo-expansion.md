# Sprint: IP Tool + SEO Expansion

## Sprint Goal

Add a "What is my IP" tool to the existing What's My Ping architecture and expand the site with five IP-focused SEO pages that reuse the same backend/frontend patterns already in the project.

Target routes:

- `/what-is-my-ip`
- `/ip-check`
- `/check-my-ip`
- `/my-ip-address`
- `/ip-lookup`

## Architecture Notes

This repo already uses a config-driven pattern:

- backend routes live in `backend/index.js`
- frontend route resolution lives in `frontend/src/routes.jsx`
- SEO content lives in `frontend/src/seoContent.js`
- prerendering lives in `frontend/src/entry-server.jsx`
- reusable page UI already exists in `frontend/src/pages/PingPage.jsx`

The IP tool should fit into that structure instead of introducing a parallel architecture.

Recommended approach:

- extend route/content config with `toolType: 'ping' | 'ip'`
- add a reusable `IpPage.jsx`
- keep prerender + sitemap updated alongside route config
- add tests as part of the sprint, not after

## Stories

### Story 1: Backend IP Endpoint

Goal:
Expose the user's public-facing IP cleanly from the backend.

Tasks:

1. Add `GET /api/ip`
2. Extract IP using existing proxy-aware Express behavior
3. Normalize IP values such as `::ffff:127.0.0.1`
4. Return:
   - `ip`
   - `version`
   - optional `userAgent`

Acceptance criteria:

- `GET /api/ip` returns a stable JSON shape
- works locally and behind a proxy
- IPv4-mapped addresses are normalized correctly

### Story 2: Frontend IP Page Component

Goal:
Create a reusable IP tool page that matches the current site style.

Tasks:

1. Create `frontend/src/pages/IpPage.jsx`
2. Fetch `/api/ip`
3. Render loading, success, and error states
4. Show the detected IP clearly
5. Optionally show IP version and user agent

Acceptance criteria:

- page shows IP data after load
- error state is user-friendly
- layout works on desktop and mobile

### Story 3: Route + App Integration

Goal:
Integrate IP routes without breaking the current routing model.

Tasks:

1. Add IP route entries to `frontend/src/seoContent.js`
2. Include `toolType: 'ip'` on those entries
3. Update `frontend/src/routes.jsx` if needed so those routes resolve normally
4. Update `frontend/src/App.jsx` to render:
   - `PingPage` for ping routes
   - `IpPage` for IP routes

Acceptance criteria:

- all five IP routes render
- unknown routes still follow existing fallback behavior
- no separate routing system is introduced

### Story 4: SEO Content

Goal:
Avoid thin pages and keep each route useful and distinct.

Tasks:

1. Add five IP-focused entries in `frontend/src/seoContent.js`
2. Give each page:
   - unique title
   - unique description
   - unique `h1`
   - unique intro copy
   - 2-3 content sections with slightly different angles
3. Keep content structure aligned with existing page config style

Page angle ideas:

- `/what-is-my-ip`: direct lookup / basic explanation
- `/ip-check`: quick verification / troubleshooting
- `/check-my-ip`: connectivity sanity check
- `/my-ip-address`: educational angle
- `/ip-lookup`: lookup framing without adding heavy enrichment yet

Acceptance criteria:

- each page has unique metadata
- each page has enough static content for prerendered HTML
- copy feels related but not duplicated

### Story 5: Prerender Integration

Goal:
Ensure the new IP pages are emitted as static HTML.

Tasks:

1. Add the five IP routes to `frontend/src/entry-server.jsx`
2. Ensure prerender output includes the correct title/description
3. Verify generated files exist after build

Acceptance criteria:

- build generates HTML files for all five routes
- prerendered HTML contains real visible content, not only the root div

### Story 6: Sitemap Update

Goal:
Expose the new IP pages to search engines.

Tasks:

1. Update the sitemap route in `backend/index.js`
2. Add all five new IP pages
3. Keep format consistent with existing sitemap output

Acceptance criteria:

- `/sitemap.xml` includes all five IP routes

### Story 7: Internal Linking

Goal:
Strengthen crawlability and keep tools connected.

Tasks:

1. Add IP tool links from ping pages
2. Add ping tool links from IP pages
3. Keep linking reusable and lightweight

Acceptance criteria:

- ping pages include a path toward the IP tool
- IP pages include a path toward `/ping-test`
- each tool page links to 2-3 useful related pages

### Story 8: Tests

Goal:
Keep the sprint aligned with the new test baseline already added to the repo.

Tasks:

Backend:

1. add tests for `/api/ip`
2. cover response shape
3. cover IP normalization logic

Frontend:

1. add tests for IP route mapping
2. add tests for `IpPage` fetch/render behavior
3. cover success and failure states

Acceptance criteria:

- backend tests pass
- frontend tests pass
- new IP functionality is covered by automated tests

### Story 9: Deployment

Goal:
Ship after local verification.

Tasks:

1. run frontend build
2. run backend tests
3. run frontend tests
4. commit on a feature branch
5. push and deploy through the existing flow

Acceptance criteria:

- tests pass before merge
- build succeeds before merge

### Story 10: Indexing

Goal:
Make the new pages discoverable after deployment.

Tasks:

1. submit updated sitemap in Google Search Console
2. request indexing for:
   - `/what-is-my-ip`
   - `/ip-check`

Acceptance criteria:

- sitemap submitted
- priority pages requested for indexing

## Recommended Execution Order

1. Backend `/api/ip`
2. `IpPage.jsx`
3. SEO entries + route integration
4. prerender update
5. sitemap update
6. internal linking
7. tests
8. build + deploy

## Scope Guardrails

Keep phase 1 intentionally small:

- include public IP lookup
- include IP version if available
- do not add geolocation yet
- do not add third-party enrichment yet
- do not build a separate architecture for IP pages

## Definition of Done

- `/api/ip` exists and works
- all five IP pages render correctly
- all five IP pages are prerendered
- sitemap includes the new routes
