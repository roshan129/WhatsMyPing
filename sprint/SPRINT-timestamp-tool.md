# Sprint: Timestamp Converter Tool

## Sprint Goal

Add a Unix timestamp converter tool to Roswag using the same architecture patterns already used by the existing ping, IP, DNS, JSON, Base64, URL, UUID, and JWT tools.

This sprint should introduce:

- `/timestamp-converter`
- `/unix-timestamp-converter`
- `/epoch-converter`
- `/convert-timestamp`
- `/timestamp-to-date`

Version 1 should focus on fast timestamp conversion, readable date output, strong SEO coverage, and clean integration with the current backend/frontend structure.

## Product Goal

Give users a fast browser-based timestamp utility where they can:

- convert Unix timestamps into readable UTC and local date/time values
- convert date/time input back into Unix timestamps
- switch quickly between timestamp-to-date and date-to-timestamp workflows
- copy the results easily
- clear the tool quickly
- land on search-intent-specific SEO pages for timestamp-related queries

The first release should stay lightweight, practical, and aligned with the current Roswag tool style.

## Architecture Notes

This project does not use a route-object router or ESM backend modules. The timestamp tool should fit the actual codebase shape:

- backend route logic lives in `backend/app.js`
- shared timestamp logic should live in `backend/timestampService.js`
- backend uses CommonJS exports
- frontend route resolution is metadata-driven through `frontend/src/seoContent.js`
- page selection is centralized in `frontend/src/App.jsx` using `toolType`
- prerender routes are declared in `frontend/src/entry-server.jsx`
- sitemap URLs are declared in the backend `/sitemap.xml` route
- frontend page UI should follow the same reusable pattern already used by `Base64Page`, `UrlPage`, and `JwtPage`

Recommended implementation shape:

- add `backend/timestampService.js`
- add `POST /api/timestamp/parse`
- add `POST /api/timestamp/format`
- add `frontend/src/pages/TimestampPage.jsx`
- extend `toolType` support to include `timestamp`
- add five timestamp page entries in `frontend/src/seoContent.js`
- update existing tool pages to link into the timestamp tool where it makes sense

## Scope Guardrails

Include in version 1:

- Unix timestamp to readable date conversion
- date/time string to Unix timestamp conversion
- support for seconds and milliseconds input
- UTC and local formatted output
- clear error messages for invalid input
- copy actions
- mode switching between convert directions
- five distinct SEO pages

Do not include in version 1:

- timezone selector UI
- relative time phrases like “3 hours ago”
- recurring schedule helpers
- calendar file export
- natural language date parsing
- saved history
- multi-row batch conversion

## Stories

### Story 1: Backend Timestamp Utility Service

Goal:
Create a shared timestamp service that is reusable and independently testable.

Tasks:

1. Add `backend/timestampService.js`
2. Implement `formatTimestamp(input)`
3. Implement `parseDateInput(input)`
4. Detect whether numeric input is seconds or milliseconds
5. Return stable formatted values:
   - ISO string
   - UTC string
   - local string
   - Unix seconds
   - Unix milliseconds
6. Return stable errors for invalid timestamp or date input

Suggested response shape for timestamp-to-date:

```json
{
  "iso": "2026-04-03T10:30:00.000Z",
  "utc": "Fri, 03 Apr 2026 10:30:00 GMT",
  "local": "Fri Apr 03 2026 16:00:00 GMT+0530",
  "unixSeconds": 1775212200,
  "unixMilliseconds": 1775212200000
}
```

Acceptance criteria:

- valid Unix timestamps convert correctly
- service supports both seconds and milliseconds input
- invalid input throws stable errors

### Story 2: Backend API Endpoints

Goal:
Expose timestamp conversion through the Express backend.

Tasks:

1. Wire `timestampService` into `backend/app.js`
2. Add `POST /api/timestamp/format` for timestamp-to-date
3. Add `POST /api/timestamp/parse` for date-to-timestamp
4. Read `{ input }` from `req.body`
5. Return `400` for missing input
6. Return stable `400` errors for invalid timestamp or date values

Suggested request shape:

```json
{
  "input": "1712140200"
}
```

Acceptance criteria:

- timestamp-to-date endpoint works
- date-to-timestamp endpoint works
- invalid input returns readable validation errors

### Story 3: Backend Tests

Goal:
Cover timestamp service and route behavior before relying on the frontend.

Tasks:

1. Add `backend/test/timestampService.test.js`
2. Add service tests for seconds input
3. Add service tests for milliseconds input
4. Add service tests for valid date parsing
5. Add service tests for invalid input
6. Add API tests for success and validation errors

Acceptance criteria:

- backend tests cover valid and invalid conversion paths
- route behavior is stable and deterministic

### Story 4: Frontend Timestamp Tool Page

Goal:
Create a timestamp converter page that matches the current Roswag tool style.

Tasks:

1. Add `frontend/src/pages/TimestampPage.jsx`
2. Render:
   - input field or textarea
   - mode switch
   - convert button
   - clear button
   - copy result button(s)
   - result cards for ISO, UTC, local, and Unix values
   - loading state
   - error state
3. Call:
   - `POST /api/timestamp/format`
   - `POST /api/timestamp/parse`
4. Keep the layout usable on desktop and mobile

Acceptance criteria:

- timestamp-to-date works in the UI
- date-to-timestamp works in the UI
- copy actions work
- invalid input shows a readable error

### Story 5: Route and App Integration

Goal:
Integrate the timestamp tool without changing the project’s routing model.

Tasks:

1. Add `toolType: 'timestamp'` support
2. Add timestamp route entries in `frontend/src/seoContent.js`
3. Update `frontend/src/App.jsx` so timestamp routes render `TimestampPage`
4. Keep unknown-route fallback unchanged

Acceptance criteria:

- all timestamp routes resolve correctly
- existing tools continue to work

### Story 6: SEO Content for Timestamp Pages

Goal:
Create five non-thin timestamp pages with distinct intent.

Tasks:

1. Add unique entries for:
   - `/timestamp-converter`
   - `/unix-timestamp-converter`
   - `/epoch-converter`
   - `/convert-timestamp`
   - `/timestamp-to-date`
2. Give each page:
   - unique title
   - unique description
   - unique `h1`
   - page-specific intro copy
   - explanatory sections
   - practical quick-facts content
3. Keep one timestamp page visible in the main nav if it fits the current nav strategy

Acceptance criteria:

- metadata is distinct across the five routes
- prerendered HTML contains useful static content

### Story 7: Prerender and Sitemap Integration

Goal:
Keep SEO infrastructure aligned with the new routes.

Tasks:

1. Add timestamp routes to `frontend/src/entry-server.jsx`
2. Add timestamp routes to the backend sitemap list
3. Update tests that cover prerender metadata and sitemap output

Acceptance criteria:

- build emits prerendered HTML for all timestamp routes
- sitemap includes all timestamp routes

### Story 8: Internal Linking

Goal:
Integrate the timestamp tool into the current tool graph so users can discover it.

Tasks:

1. Add timestamp links from JSON pages
2. Add timestamp links from UUID pages
3. Add timestamp links from JWT pages
4. Add timestamp links from URL pages

Acceptance criteria:

- timestamp tool is discoverable from the existing tools
- links fit the current related-tools style

### Story 9: Frontend Tests

Goal:
Cover the new timestamp page behavior and route integration.

Tasks:

1. Add `frontend/src/pages/TimestampPage.test.jsx`
2. Test timestamp-to-date flow
3. Test date-to-timestamp flow
4. Test error rendering for invalid input
5. Test copy behavior
6. Update route and prerender tests for timestamp pages

Acceptance criteria:

- frontend tests verify the main timestamp interactions

### Story 10: Build and Delivery

Goal:
Ship the timestamp converter cleanly on its feature branch.

Tasks:

1. Run backend tests
2. Run frontend tests
3. Run `npm run build`
4. Review the resulting diff before staging and commit

Acceptance criteria:

- tool is implemented end to end
- build passes
- branch is ready for commit/push when requested

## Implementation Notes

- Prefer stable, explicit conversion rules over ambiguous “smart” parsing.
- Show both UTC and local outputs because that is one of the most common user expectations in timestamp tools.
- Keep the backend authoritative for parsing/formatting logic so frontend output stays consistent.
- Reuse existing Roswag card, output, and metadata patterns where possible instead of introducing a separate UI system.
