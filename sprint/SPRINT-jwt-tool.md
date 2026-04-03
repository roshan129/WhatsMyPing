# Sprint: JWT Decoder / Inspector Tool

## Sprint Goal

Add a JWT decoder and inspector tool to Roswag using the same architecture patterns already used by the existing ping, IP, DNS, JSON, Base64, URL, and UUID tools.

This sprint should introduce:

- `/jwt-decoder`
- `/decode-jwt`
- `/jwt-parser`
- `/jwt-inspector`
- `/jwt-decoder-online`

Version 1 should focus on safe JWT decoding, readable claim inspection, strong SEO coverage, and clean integration with the current backend/frontend structure.

## Product Goal

Give users a fast browser-based JWT utility where they can:

- paste a JWT and decode it instantly
- inspect the header and payload in readable JSON
- view token metadata like algorithm, token type, issued-at, not-before, and expiry when present
- copy decoded sections easily
- clear the editor quickly
- land on search-intent-specific SEO pages for JWT-related queries

The first release should stay lightweight, practical, and aligned with the current Roswag tool style.

## Architecture Notes

This project does not use a route-object router or ESM backend modules. The JWT tool should fit the actual codebase shape:

- backend route logic lives in `backend/app.js`
- shared JWT logic should live in `backend/jwtService.js`
- backend uses CommonJS exports
- frontend route resolution is metadata-driven through `frontend/src/seoContent.js`
- page selection is centralized in `frontend/src/App.jsx` using `toolType`
- prerender routes are declared in `frontend/src/entry-server.jsx`
- sitemap URLs are declared in the backend `/sitemap.xml` route
- frontend page UI should follow the same reusable pattern already used by `JsonPage`, `Base64Page`, `UrlPage`, and `UuidPage`

Recommended implementation shape:

- add `backend/jwtService.js`
- add `POST /api/jwt/decode`
- add `frontend/src/pages/JwtPage.jsx`
- extend `toolType` support to include `jwt`
- add five JWT page entries in `frontend/src/seoContent.js`
- update existing tool pages to link into the JWT tool where it makes sense

## Scope Guardrails

Include in version 1:

- decode JWT header and payload only
- detect malformed JWT input and return stable errors
- support Base64URL decoding
- readable claim metadata for common time claims when present
- copy header JSON
- copy payload JSON
- clear action
- five distinct SEO pages

Do not include in version 1:

- signature verification
- secret or public key upload
- JWKS support
- token signing
- encryption or JWE support
- token storage/history
- auth provider presets

## Stories

### Story 1: Backend JWT Utility Service

Goal:
Create a shared JWT service that is reusable and independently testable.

Tasks:

1. Add `backend/jwtService.js`
2. Implement `decodeJwt(token)`
3. Split the token into header, payload, and signature parts
4. Decode Base64URL header and payload safely
5. Parse header and payload JSON
6. Normalize readable metadata for common claims:
   - `alg`
   - `typ`
   - `iat`
   - `nbf`
   - `exp`
7. Return stable errors for invalid structure or invalid JSON

Suggested response shape:

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "123",
    "iat": 1710000000,
    "exp": 1710003600
  },
  "meta": {
    "algorithm": "HS256",
    "type": "JWT",
    "issuedAt": "2024-03-09T16:00:00.000Z",
    "expiresAt": "2024-03-09T17:00:00.000Z",
    "notBefore": null,
    "hasSignature": true
  }
}
```

Acceptance criteria:

- valid JWTs decode into structured header and payload JSON
- service supports Base64URL input correctly
- malformed JWTs throw stable validation errors

### Story 2: Backend API Endpoint

Goal:
Expose JWT decoding through the Express backend.

Tasks:

1. Wire `jwtService` into `backend/app.js`
2. Add `POST /api/jwt/decode`
3. Read `{ input }` from `req.body`
4. Return `400` for missing input
5. Return `400` for malformed or undecodable JWT input
6. Return a stable server error if decode fails unexpectedly

Suggested request shape:

```json
{
  "input": "eyJhbGciOi..."
}
```

Acceptance criteria:

- endpoint decodes valid JWTs
- endpoint rejects invalid JWTs with readable errors
- response shape is stable for frontend rendering

### Story 3: Backend Tests

Goal:
Cover JWT service and route behavior before relying on the frontend.

Tasks:

1. Add `backend/test/jwtService.test.js`
2. Add service tests for valid JWT decoding
3. Add service tests for invalid token structure
4. Add service tests for invalid Base64URL or invalid JSON payloads
5. Add API tests for success, missing input, and malformed input

Acceptance criteria:

- backend tests cover valid and invalid JWT cases
- error behavior is stable and deterministic

### Story 4: Frontend JWT Tool Page

Goal:
Create a JWT decoder page that matches the current Roswag tool style.

Tasks:

1. Add `frontend/src/pages/JwtPage.jsx`
2. Render:
   - textarea input
   - decode button
   - clear button
   - copy header button
   - copy payload button
   - header output panel
   - payload output panel
   - metadata summary cards
   - loading state
   - error state
3. Call `POST /api/jwt/decode`
4. Keep the layout usable on desktop and mobile

Acceptance criteria:

- JWTs decode correctly in the UI
- header and payload are readable
- copy actions work
- malformed JWT input shows a clear error

### Story 5: Route and App Integration

Goal:
Integrate the JWT tool without changing the project’s routing model.

Tasks:

1. Add `toolType: 'jwt'` support
2. Add JWT route entries in `frontend/src/seoContent.js`
3. Update `frontend/src/App.jsx` so JWT routes render `JwtPage`
4. Keep unknown-route fallback unchanged

Acceptance criteria:

- all JWT routes resolve correctly
- existing tools continue to work

### Story 6: SEO Content for JWT Pages

Goal:
Create five non-thin JWT pages with distinct intent.

Tasks:

1. Add unique entries for:
   - `/jwt-decoder`
   - `/decode-jwt`
   - `/jwt-parser`
   - `/jwt-inspector`
   - `/jwt-decoder-online`
2. Give each page:
   - unique title
   - unique description
   - unique `h1`
   - page-specific intro copy
   - explanatory sections
   - practical quick-facts content
3. Keep one JWT page visible in the main nav if it fits the current nav strategy

Acceptance criteria:

- metadata is distinct across the five routes
- prerendered HTML contains useful static content

### Story 7: Prerender and Sitemap Integration

Goal:
Keep SEO infrastructure aligned with the new routes.

Tasks:

1. Add JWT routes to `frontend/src/entry-server.jsx`
2. Add JWT routes to the backend sitemap list
3. Update tests that cover prerender metadata and sitemap output

Acceptance criteria:

- build emits prerendered HTML for all JWT routes
- sitemap includes all JWT routes

### Story 8: Internal Linking

Goal:
Integrate the JWT tool into the current tool graph so users can discover it.

Tasks:

1. Add JWT links from JSON pages
2. Add JWT links from Base64 pages
3. Add JWT links from UUID pages
4. Add JWT links from URL pages

Acceptance criteria:

- JWT tool is discoverable from the existing tools
- links fit the current related-tools style

### Story 9: Frontend Tests

Goal:
Cover the new JWT page behavior and route integration.

Tasks:

1. Add `frontend/src/pages/JwtPage.test.jsx`
2. Test valid decode flow
3. Test error rendering for malformed JWT input
4. Test copy header and copy payload actions
5. Update route and prerender tests for JWT pages

Acceptance criteria:

- frontend tests verify the main JWT interactions

### Story 10: Build and Delivery

Goal:
Ship the JWT tool on the current feature branch cleanly.

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

- Keep all JWT handling decode-only in version 1 so the tool stays safe and lightweight.
- Do not market version 1 as signature verification; make that explicit in page copy and UI labels.
- Reuse existing Roswag UI patterns and CSS hooks wherever possible instead of introducing a new layout system.
- Prefer stable, user-friendly backend validation messages over raw parsing exceptions.
