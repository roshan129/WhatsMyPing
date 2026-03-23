# Sprint: JSON Formatter Tool

## Sprint Goal

Add a JSON formatter tool to What's My Ping so the site expands beyond network diagnostics into lightweight developer utilities while still reusing the same backend, frontend, SEO, prerender, and testing patterns already established in the project.

This sprint should introduce:

- `/json-formatter`
- `/json-pretty-print`
- `/json-validator`
- `/json-viewer`

Version 1 should focus on formatting, validation, readable output, and distinct SEO pages without introducing accounts, persistence, or a separate architecture.

## Product Goal

Give users a fast browser-based JSON tool where they can:

- paste raw JSON
- validate whether it is valid
- format and pretty-print it
- inspect it in a readable output panel
- copy the formatted result
- clear the editor quickly

The first release should be simple, dependable, and useful for common debugging or API-response cleanup workflows.

## Architecture Notes

The JSON tool should fit the same project shape already used by ping, IP, and DNS:

- backend route logic lives in `backend/app.js`
- shared JSON logic should live in a dedicated service module
- frontend routing remains config-driven via `frontend/src/seoContent.js` and `frontend/src/routes.jsx`
- tool rendering remains centralized in `frontend/src/App.jsx`
- prerender routes remain listed in `frontend/src/entry-server.jsx`
- sitemap remains dynamic through the backend `/sitemap.xml` route
- tests should be added alongside implementation in both backend and frontend

Recommended implementation shape:

- add `backend/jsonService.js`
- add `POST /api/json/format`
- add `frontend/src/pages/JsonPage.jsx`
- extend `toolType` support to include `json`
- add four JSON page entries in `frontend/src/seoContent.js`

## Scope Guardrails

Include in version 1:

- JSON formatting
- JSON validation
- clear error messages
- copy-to-clipboard action
- clear/reset action
- four distinct JSON SEO pages

Do not include in version 1:

- YAML conversion
- minify toggle
- schema validation
- file upload
- saved history
- share links
- syntax tree explorer

## Stories

### Story 1: Backend JSON Utility Service

Goal:
Create a shared JSON processing service that can be reused by the API and tested independently.

Tasks:

1. Add `backend/jsonService.js`
2. Implement `formatJson(input)`
3. Implement `validateJson(input)`
4. Normalize service responses into a stable shape
5. Preserve useful parser error messages for invalid JSON

Suggested service behavior:

- valid JSON string in
- pretty-printed JSON string out with 2-space indentation
- invalid JSON returns a clear validation result and parser message

Acceptance criteria:

- valid JSON returns formatted output
- invalid JSON returns a stable error result
- service logic is testable without the Express app

### Story 2: Backend API Endpoint

Goal:
Expose JSON formatting and validation through the backend API.

Tasks:

1. Add `POST /api/json/format` in `backend/app.js`
2. Read `{ input }` from `req.body`
3. Return `400` when input is empty or missing
4. Return formatted JSON for valid input
5. Return a clear error response for invalid JSON
6. Keep the route shape aligned with existing backend API style

Suggested response shape:

```json
{
  "formatted": "{\n  \"ok\": true\n}",
  "valid": true
}
```

Suggested invalid response:

```json
{
  "error": "Unexpected token } in JSON at position 14",
  "valid": false
}
```

Acceptance criteria:

- `POST /api/json/format` works locally
- empty input returns `400`
- invalid JSON returns a stable error response

### Story 3: Backend Tests

Goal:
Cover JSON service and API behavior before the frontend depends on it.

Tasks:

1. Add unit tests for `formatJson`
2. Add unit tests for `validateJson`
3. Add API test for valid formatting
4. Add API test for invalid JSON
5. Add API test for empty input

Acceptance criteria:

- backend tests verify valid, invalid, and empty-input cases
- service and route behavior are deterministic

### Story 4: Frontend JSON Tool Page

Goal:
Create a reusable JSON page component that matches the current site style and UX.

Tasks:

1. Add `frontend/src/pages/JsonPage.jsx`
2. Render:
   - textarea input
   - format button
   - clear button
   - copy button
   - output panel
   - loading state
   - validation/error state
3. POST JSON input to `/api/json/format`
4. Display formatted output cleanly
5. Keep long JSON lines and content usable on mobile

Acceptance criteria:

- user can paste JSON and format it
- invalid JSON shows a readable error
- copy and clear actions work
- layout remains usable on desktop and mobile

### Story 5: Route and App Integration

Goal:
Integrate JSON pages into the same config-driven route system as the other tools.

Tasks:

1. Extend the route/content model to support `toolType: 'json'`
2. Add JSON route entries in `frontend/src/seoContent.js`
3. Update `frontend/src/routes.jsx` if needed
4. Update `frontend/src/App.jsx` so JSON routes render `JsonPage`
5. Keep ping, IP, and DNS routes unchanged

Acceptance criteria:

- all JSON routes resolve correctly
- existing tools continue to work
- unknown routes still fall back to the default route behavior

### Story 6: SEO Content for JSON Pages

Goal:
Create distinct, non-thin static content for each JSON page.

Tasks:

1. Add unique entries for:
   - `/json-formatter`
   - `/json-pretty-print`
   - `/json-validator`
   - `/json-viewer`
2. Give each page:
   - unique title
   - unique description
   - unique `h1`
   - page-specific intro copy
   - 2-3 explanatory sections
   - a quick facts or checklist block
3. Make each route target a slightly different intent

Page angle ideas:

- `/json-formatter`: general formatting and cleanup
- `/json-pretty-print`: beautify and readability angle
- `/json-validator`: validation and debugging angle
- `/json-viewer`: inspection and readability angle

Acceptance criteria:

- each page has distinct metadata and content
- prerendered HTML contains useful static copy
- pages avoid thin or duplicated SEO content

### Story 7: Prerender Integration

Goal:
Emit JSON pages as static HTML during the frontend build.

Tasks:

1. Add all JSON routes to `frontend/src/entry-server.jsx`
2. Ensure prerendered output contains the correct metadata
3. Add or update prerender route coverage tests

Acceptance criteria:

- build emits HTML for all JSON routes
- generated HTML contains visible page content

### Story 8: Sitemap Integration

Goal:
Expose the JSON pages through the dynamic sitemap.

Tasks:

1. Add JSON routes to the `/sitemap.xml` path list in `backend/app.js`
2. Keep sitemap output consistent with existing routes
3. Add or update sitemap tests

Acceptance criteria:

- JSON pages appear in `/sitemap.xml`
- sitemap coverage tests pass

### Story 9: Internal Linking

Goal:
Connect the JSON tool with the existing ping, IP, and DNS tools.

Tasks:

1. Add JSON links from ping pages
2. Add JSON links from IP pages
3. Add JSON links from DNS pages
4. Add related-tool links from JSON pages back to ping, IP, and DNS tools
5. Keep the linking useful and lightweight

Acceptance criteria:

- each JSON page links to 2-3 relevant tools
- existing tools surface a path into the JSON formatter

### Story 10: Frontend Tests

Goal:
Cover JSON page behavior and route mapping with automated tests.

Tasks:

1. Add route mapping tests for JSON pages
2. Add `JsonPage` success-state test
3. Add loading-state test
4. Add invalid JSON error-state test
5. Add empty-input handling test
6. Add copy/clear behavior tests if practical

Acceptance criteria:

- frontend tests cover the main JSON tool flows
- route mapping and rendering are verified

### Story 11: Build, QA, and Release Readiness

Goal:
Verify the JSON tool is ready to merge into `development`.

Tasks:

1. Run `cd backend && npm test`
2. Run `cd frontend && npm test`
3. Run `cd frontend && npm run build`
4. Manually test:
   - valid JSON
   - invalid JSON
   - empty input
   - nested JSON
   - copy and clear actions
   - mobile textarea/output layout
5. Review the sprint against acceptance criteria

Acceptance criteria:

- tests pass
- build passes
- manual JSON formatting flows work as expected

## Recommended Execution Order

1. `backend/jsonService.js`
2. `POST /api/json/format`
3. backend tests
4. `frontend/src/pages/JsonPage.jsx`
5. route/app integration
6. SEO content entries
7. prerender update
8. sitemap update
9. internal linking
10. frontend tests
11. build and manual QA

## Open Decisions

These should be locked before implementation begins:

1. Should version 1 format only, or also support minify later?
2. Should the JSON page auto-format on paste, or only on button click?
3. Should the output be read-only in a code-style panel or another textarea?
4. Should copy-to-clipboard feedback be inline or button-state based?

Recommended defaults:

- format only in v1
- format on button click, not automatically
- use a read-only output panel or textarea
- use simple inline button feedback for copy success

## Definition of Done

- `backend/jsonService.js` exists
- `POST /api/json/format` works
- all four JSON pages render through the config-driven frontend
- JSON pages are prerendered
- sitemap includes JSON routes
- internal linking includes the new tool
- backend tests pass
- frontend tests pass
- frontend build passes
