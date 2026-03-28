# Sprint: Base64 Tool

## Sprint Goal

Add a Base64 encoder/decoder tool to Roswag using the same architecture patterns already used by the ping, IP, DNS, and JSON tools.

This sprint should introduce:

- `/base64-encode`
- `/base64-decode`
- `/text-to-base64`
- `/base64-to-text`

Version 1 should focus on dependable encode/decode behavior, clear errors, distinct SEO pages, and smooth integration with the current backend/frontend structure.

## Product Goal

Give users a fast browser-based Base64 utility where they can:

- paste plain text and encode it to Base64
- paste Base64 and decode it back to text
- switch between encode and decode modes quickly
- copy the output
- clear the editor
- land on tool-specific SEO pages for different search intents

The first release should stay simple, fast, and aligned with the current Roswag tool style.

## Architecture Notes

This project does not use a route-object config like the generic plan suggested. Base64 should fit the actual codebase shape:

- backend route logic lives in `backend/app.js`
- shared Base64 logic should live in `backend/base64Service.js`
- backend uses CommonJS exports
- frontend route resolution is metadata-driven through `frontend/src/seoContent.js`
- page selection is centralized in `frontend/src/App.jsx` using `toolType`
- prerender routes are declared in `frontend/src/entry-server.jsx`
- sitemap URLs are declared in the backend `/sitemap.xml` route
- frontend page UI should follow the existing JSON tool pattern

Recommended implementation shape:

- add `backend/base64Service.js`
- add `POST /api/base64/encode`
- add `POST /api/base64/decode`
- add `frontend/src/pages/Base64Page.jsx`
- extend `toolType` support to include `base64`
- add four Base64 page entries in `frontend/src/seoContent.js`

## Scope Guardrails

Include in version 1:

- Base64 encode
- Base64 decode
- clear error messages for invalid Base64 input
- copy and clear actions
- a mode switch between encode and decode
- four distinct SEO pages

Do not include in version 1:

- file upload
- drag and drop
- binary/hex conversion
- URL-safe Base64 variants
- saved history
- share links
- advanced charset selection

## Stories

### Story 1: Backend Base64 Utility Service

Goal:
Create a shared Base64 service that is reusable and independently testable.

Tasks:

1. Add `backend/base64Service.js`
2. Implement `encodeBase64(input)`
3. Implement `decodeBase64(input)`
4. Add stable invalid-input handling for decode
5. Keep the service small and deterministic

Acceptance criteria:

- valid text encodes to Base64
- valid Base64 decodes to text
- invalid Base64 throws a stable error

### Story 2: Backend API Endpoints

Goal:
Expose Base64 encode/decode through the Express backend.

Tasks:

1. Wire `base64Service` into `backend/app.js`
2. Add `POST /api/base64/encode`
3. Add `POST /api/base64/decode`
4. Read `{ input }` from `req.body`
5. Return `400` for missing input
6. Return a stable error for invalid Base64 decode requests

Suggested response shape:

```json
{
  "output": "SGVsbG8="
}
```

Acceptance criteria:

- encode endpoint works
- decode endpoint works
- invalid decode returns a clear `400`

### Story 3: Backend Tests

Goal:
Cover the Base64 service and route behavior before relying on the frontend.

Tasks:

1. Add `backend/test/base64Service.test.js`
2. Add service tests for encode, decode, and invalid decode
3. Add API tests for encode and decode
4. Add API test for missing input
5. Add API test for invalid decode

Acceptance criteria:

- backend tests cover valid and invalid cases
- route behavior is stable and deterministic

### Story 4: Frontend Base64 Tool Page

Goal:
Create a reusable Base64 page that matches the current Roswag tool style.

Tasks:

1. Add `frontend/src/pages/Base64Page.jsx`
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
   - `POST /api/base64/encode`
   - `POST /api/base64/decode`
4. Keep the layout usable on desktop and mobile

Acceptance criteria:

- encode works in the UI
- decode works in the UI
- invalid decode shows a readable error
- copy and clear actions work

### Story 5: Route and App Integration

Goal:
Integrate Base64 without changing the project’s routing model.

Tasks:

1. Add `toolType: 'base64'` support
2. Add Base64 route entries in `frontend/src/seoContent.js`
3. Update `frontend/src/App.jsx` so Base64 routes render `Base64Page`
4. Keep unknown-route fallback unchanged

Acceptance criteria:

- all Base64 routes resolve correctly
- existing tools continue to work

### Story 6: SEO Content for Base64 Pages

Goal:
Create four non-thin Base64 pages with distinct intent.

Tasks:

1. Add unique entries for:
   - `/base64-encode`
   - `/base64-decode`
   - `/text-to-base64`
   - `/base64-to-text`
2. Give each page:
   - unique title
   - unique description
   - unique `h1`
   - page-specific intro copy
   - 2-3 explanatory sections
   - quick facts/checklist content
3. Keep one Base64 page visible in the main nav if it fits the current nav strategy

Page angle ideas:

- `/base64-encode`: general encoder page
- `/base64-decode`: general decoder page
- `/text-to-base64`: text conversion angle
- `/base64-to-text`: decode/inspection angle

Acceptance criteria:

- metadata is distinct across the four routes
- prerendered HTML contains useful static content

### Story 7: Prerender and Sitemap Integration

Goal:
Keep SEO infrastructure aligned with the new routes.

Tasks:

1. Add Base64 routes to `frontend/src/entry-server.jsx`
2. Add Base64 routes to the backend sitemap list
3. Update tests that cover prerender metadata and sitemap output

Acceptance criteria:

- build emits prerendered HTML for all Base64 routes
- sitemap includes all Base64 routes

### Story 8: Internal Linking

Goal:
Integrate Base64 into the current tool graph so users can discover it.

Tasks:

1. Add Base64 links from ping pages
2. Add Base64 links from IP pages
3. Add Base64 links from DNS pages
4. Add Base64 links from JSON pages

Acceptance criteria:

- Base64 is discoverable from the existing tools
- links fit the current related-tools style

### Story 9: Frontend Tests

Goal:
Cover the new Base64 page behavior and route integration.

Tasks:

1. Add `frontend/src/pages/Base64Page.test.jsx`
2. Test encode mode
3. Test decode mode
4. Test error rendering
5. Update route and prerender tests for Base64 pages

Acceptance criteria:

- frontend tests verify the main Base64 interactions
- route/prerender coverage includes the new pages

## Final Output

- 1 reusable Base64 tool UI
- 4 Base64 SEO pages
- backend service and API endpoints
- sitemap and prerender integration
- related-link integration from existing tools
- backend and frontend test coverage

## Suggested Branch

If you want to split this from the current branch later, use:

```bash
git checkout -b feature/base64-tool
```

## One-Line Rule

Ship the Base64 tool in the same style as the existing utilities, keep the scope tight, and make the four SEO pages distinct enough to justify their own routes.
