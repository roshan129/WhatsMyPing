# Sprint: UUID Generator Tool

## Sprint Goal

Add a UUID v4 generator tool to Roswag using the same architecture patterns already used by the existing ping, IP, DNS, JSON, Base64, and URL tools.

This sprint should introduce:

- `/uuid-generator`
- `/generate-uuid`
- `/uuid-v4-generator`
- `/random-uuid-generator`
- `/uuid-generator-online`

Version 1 should focus on fast UUID v4 generation, simple bulk generation, strong SEO coverage, and clean integration with the current backend/frontend structure.

## Product Goal

Give users a fast browser-based UUID utility where they can:

- generate one or many UUID v4 values instantly
- choose how many UUIDs to create in one request
- copy individual UUIDs or copy the full batch
- regenerate without changing the selected count
- clear the current list quickly
- land on search-intent-specific SEO pages for UUID-related queries

The first release should stay lightweight, practical, and aligned with the current Roswag tool style.

## Architecture Notes

This project does not use ESM backend modules or a route-object router. The UUID tool should fit the actual codebase shape:

- backend route logic lives in `backend/app.js`
- shared UUID logic should live in `backend/uuidService.js`
- backend uses CommonJS exports, not `import` syntax
- frontend route resolution is metadata-driven through `frontend/src/seoContent.js`
- page selection is centralized in `frontend/src/App.jsx` using `toolType`
- prerender routes are declared in `frontend/src/entry-server.jsx`
- sitemap URLs are declared in the backend `/sitemap.xml` route
- frontend page UI should follow the same reusable pattern already used by `Base64Page`, `JsonPage`, and `UrlPage`

Recommended implementation shape:

- add `backend/uuidService.js`
- add `GET /api/uuid`
- add `frontend/src/pages/UuidPage.jsx`
- extend `toolType` support to include `uuid`
- add five UUID page entries in `frontend/src/seoContent.js`
- update existing tool pages to link into the UUID tool where it makes sense

## Scope Guardrails

Include in version 1:

- UUID v4 generation only
- batch generation with a maximum of 20 UUIDs
- per-item copy
- copy-all
- regenerate
- clear action
- five distinct SEO pages

Do not include in version 1:

- UUID v1, v6, or v7
- custom prefixes or suffixes
- file export
- persisted history
- vanity IDs
- collision analytics
- client-side-only generation mode toggle

## Stories

### Story 1: Backend UUID Utility Service

Goal:
Create a shared UUID service that is reusable and independently testable.

Tasks:

1. Add `backend/uuidService.js`
2. Implement `generateUUID()`
3. Implement `generateMultipleUUIDs(count = 1)`
4. Keep the service small, deterministic in shape, and easy to test

Acceptance criteria:

- service returns valid UUID v4 strings
- service supports generating multiple UUIDs
- response shape is stable for API use

### Story 2: Backend API Endpoint

Goal:
Expose UUID generation through the Express backend.

Tasks:

1. Wire `uuidService` into `backend/app.js`
2. Add `GET /api/uuid`
3. Read `count` from `req.query`
4. Default to `1` when `count` is missing or invalid
5. Cap batch size at `20`
6. Return a stable server error message if generation fails unexpectedly

Suggested response shape:

```json
{
  "uuids": [
    "550e8400-e29b-41d4-a716-446655440000"
  ]
}
```

Acceptance criteria:

- endpoint returns one UUID by default
- endpoint supports `?count=5`
- endpoint caps large values at `20`

### Story 3: Backend Tests

Goal:
Cover UUID service and route behavior before relying on the frontend.

Tasks:

1. Add `backend/test/uuidService.test.js`
2. Add service tests for single and multiple generation
3. Add API tests for default count
4. Add API tests for custom count
5. Add API tests for count capping

Acceptance criteria:

- backend tests cover valid UUID structure
- route behavior is stable and deterministic in shape

### Story 4: Frontend UUID Tool Page

Goal:
Create a UUID generator page that matches the current Roswag tool style.

Tasks:

1. Add `frontend/src/pages/UuidPage.jsx`
2. Render:
   - count selector
   - generate button
   - regenerate button
   - clear button
   - copy-all button
   - UUID result list
   - per-UUID copy controls
   - loading state
   - error state
3. Call `GET /api/uuid?count=<n>`
4. Keep the layout usable on desktop and mobile

Acceptance criteria:

- generation works in the UI
- multi-UUID mode works
- copy actions work
- regenerate and clear actions work

### Story 5: Route and App Integration

Goal:
Integrate the UUID tool without changing the project’s routing model.

Tasks:

1. Add `toolType: 'uuid'` support
2. Add UUID route entries in `frontend/src/seoContent.js`
3. Update `frontend/src/App.jsx` so UUID routes render `UuidPage`
4. Keep unknown-route fallback unchanged

Acceptance criteria:

- all UUID routes resolve correctly
- existing tools continue to work

### Story 6: SEO Content for UUID Pages

Goal:
Create five non-thin UUID pages with distinct intent.

Tasks:

1. Add unique entries for:
   - `/uuid-generator`
   - `/generate-uuid`
   - `/uuid-v4-generator`
   - `/random-uuid-generator`
   - `/uuid-generator-online`
2. Give each page:
   - unique title
   - unique description
   - unique `h1`
   - page-specific intro copy
   - explanatory sections
   - practical quick-facts content
3. Keep one UUID page visible in the main nav if it fits the current nav strategy

Acceptance criteria:

- metadata is distinct across the five routes
- prerendered HTML contains useful static content

### Story 7: Prerender and Sitemap Integration

Goal:
Keep SEO infrastructure aligned with the new routes.

Tasks:

1. Add UUID routes to `frontend/src/entry-server.jsx`
2. Add UUID routes to the backend sitemap list
3. Update tests that cover prerender metadata and sitemap output

Acceptance criteria:

- build emits prerendered HTML for all UUID routes
- sitemap includes all UUID routes

### Story 8: Internal Linking

Goal:
Integrate the UUID tool into the current tool graph so users can discover it.

Tasks:

1. Add UUID links from Base64 pages
2. Add UUID links from URL pages
3. Add UUID links from JSON pages
4. Add UUID links from Ping pages

Acceptance criteria:

- UUID tool is discoverable from the existing tools
- links fit the current related-tools style

### Story 9: Frontend Tests

Goal:
Cover the new UUID page behavior and route integration.

Tasks:

1. Add `frontend/src/pages/UuidPage.test.jsx`
2. Test default generation
3. Test selecting multiple UUIDs
4. Test copy-one and copy-all actions
5. Update route and prerender tests for UUID pages

Acceptance criteria:

- frontend tests verify the main UUID interactions

### Story 10: Build and Delivery

Goal:
Ship the UUID tool on the current feature branch cleanly.

Tasks:

1. Run backend tests
2. Run frontend tests
3. Run `npm run build`
4. Review the resulting diff before staging and commit

Acceptance criteria:

- tool is implemented end to end
- build passes
- branch is ready for commit/push when requested
