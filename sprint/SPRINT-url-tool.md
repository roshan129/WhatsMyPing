# Sprint: URL Encoder / Decoder Tool

## Sprint Goal

Add a URL encoder/decoder tool to Roswag using the same architecture patterns already used by the ping, IP, DNS, JSON, and Base64 tools.

This sprint should introduce:

- `/url-encode`
- `/url-decode`
- `/encode-url`
- `/decode-url`

Version 1 should focus on dependable encode/decode behavior, clear errors, distinct SEO pages, and smooth integration with the current backend/frontend structure.

## Product Goal

Give users a fast browser-based URL utility where they can:

- paste plain text and URL-encode it
- paste percent-encoded text and decode it back
- switch between encode and decode modes quickly
- copy the output
- clear the editor
- land on tool-specific SEO pages for different search intents

The first release should stay simple, fast, and aligned with the current Roswag tool style.

## Architecture Notes

This project does not use a route-object config like the generic plan suggested. The URL tool should fit the actual codebase shape:

- backend route logic lives in `backend/app.js`
- shared URL logic should live in `backend/urlService.js`
- backend uses CommonJS exports
- frontend route resolution is metadata-driven through `frontend/src/seoContent.js`
- page selection is centralized in `frontend/src/App.jsx` using `toolType`
- prerender routes are declared in `frontend/src/entry-server.jsx`
- sitemap URLs are declared in the backend `/sitemap.xml` route
- frontend page UI should follow the same reusable pattern already used by `Base64Page` and `JsonPage`

Recommended implementation shape:

- add `backend/urlService.js`
- add `POST /api/url/encode`
- add `POST /api/url/decode`
- add `frontend/src/pages/UrlPage.jsx`
- extend `toolType` support to include `url`
- add four URL page entries in `frontend/src/seoContent.js`

## Scope Guardrails

Include in version 1:

- URL encode
- URL decode
- clear error messages for invalid decode input
- copy and clear actions
- a mode switch between encode and decode
- four distinct SEO pages

Do not include in version 1:

- query-param parsing helpers
- URL validation or linting
- file upload
- batch conversion
- saved history
- share links
- advanced URL component breakdown

## Stories

### Story 1: Backend URL Utility Service

Goal:
Create a shared URL service that is reusable and independently testable.

Tasks:

1. Add `backend/urlService.js`
2. Implement `encodeUrl(input)`
3. Implement `decodeUrl(input)`
4. Add stable invalid-input handling for decode
5. Keep the service small and deterministic

Acceptance criteria:

- valid text encodes correctly
- valid encoded text decodes correctly
- invalid encoded input throws a stable error

### Story 2: Backend API Endpoints

Goal:
Expose URL encode/decode through the Express backend.

Tasks:

1. Wire `urlService` into `backend/app.js`
2. Add `POST /api/url/encode`
3. Add `POST /api/url/decode`
4. Read `{ input }` from `req.body`
5. Return `400` for missing input
6. Return a stable error for invalid URL decode requests

Suggested response shape:

```json
{
  "output": "hello%20world"
}
```

Acceptance criteria:

- encode endpoint works
- decode endpoint works
- invalid decode returns a clear `400`

### Story 3: Backend Tests

Goal:
Cover the URL service and route behavior before relying on the frontend.

Tasks:

1. Add `backend/test/urlService.test.js`
2. Add service tests for encode, decode, and invalid decode
3. Add API tests for encode and decode
4. Add API test for missing input
5. Add API test for invalid decode

Acceptance criteria:

- backend tests cover valid and invalid cases
- route behavior is stable and deterministic

### Story 4: Frontend URL Tool Page

Goal:
Create a reusable URL page that matches the current Roswag tool style.

Tasks:

1. Add `frontend/src/pages/UrlPage.jsx`
2. Render:
   - textarea input
   - mode switch
   - convert button
   - clear button
   - copy button
   - output panel
   - loading state
   - error state
3. Call:
   - `POST /api/url/encode`
   - `POST /api/url/decode`
4. Keep the layout usable on desktop and mobile

Acceptance criteria:

- encode works in the UI
- decode works in the UI
- invalid decode shows a readable error
- copy and clear actions work

### Story 5: Route and App Integration

Goal:
Integrate the URL tool without changing the project’s routing model.

Tasks:

1. Add `toolType: 'url'` support
2. Add URL route entries in `frontend/src/seoContent.js`
3. Update `frontend/src/App.jsx` so URL routes render `UrlPage`
4. Keep unknown-route fallback unchanged

Acceptance criteria:

- all URL routes resolve correctly
- existing tools continue to work

### Story 6: SEO Content for URL Pages

Goal:
Create four non-thin URL pages with distinct intent.

Tasks:

1. Add unique entries for:
   - `/url-encode`
   - `/url-decode`
   - `/encode-url`
   - `/decode-url`
2. Give each page:
   - unique title
   - unique description
   - unique `h1`
   - page-specific intro copy
   - 2-3 explanatory sections
   - quick facts/checklist content
3. Keep one URL page visible in the main nav if it fits the current nav strategy

Acceptance criteria:

- metadata is distinct across the four routes
- prerendered HTML contains useful static content

### Story 7: Prerender and Sitemap Integration

Goal:
Keep SEO infrastructure aligned with the new routes.

Tasks:

1. Add URL routes to `frontend/src/entry-server.jsx`
2. Add URL routes to the backend sitemap list
3. Update tests that cover prerender metadata and sitemap output

Acceptance criteria:

- build emits prerendered HTML for all URL routes
- sitemap includes all URL routes

### Story 8: Internal Linking

Goal:
Integrate the URL tool into the current tool graph so users can discover it.

Tasks:

1. Add URL links from ping pages
2. Add URL links from IP pages
3. Add URL links from DNS pages
4. Add URL links from JSON pages
5. Add URL links from Base64 pages

Acceptance criteria:

- URL tool is discoverable from the existing tools
- links fit the current related-tools style

### Story 9: Frontend Tests

Goal:
Cover the new URL page behavior and route integration.

Tasks:

1. Add `frontend/src/pages/UrlPage.test.jsx`
2. Test encode mode
3. Test decode mode
4. Test error rendering
5. Update route and prerender tests for URL pages

Acceptance criteria:

- frontend tests verify the main URL interactions
- route/prerender coverage includes the new pages

## Final Output

- 1 reusable URL tool UI
- 4 URL SEO pages
- backend service and API endpoints
- sitemap and prerender integration
- related-link integration from existing tools
- backend and frontend test coverage

## Suggested Branch

If you want to split this from the current branch later, use:

```bash
git checkout -b feature/url-tool
```

## One-Line Rule

Ship the URL encoder/decoder in the same style as the existing utilities, keep the scope tight, and make the four SEO pages distinct enough to justify their own routes.
