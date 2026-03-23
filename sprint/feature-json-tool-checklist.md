# Feature Checklist: JSON Formatter Tool

## Goal

Translate the JSON formatter sprint into a practical implementation checklist that can be worked through on `feature/json-formatter`.

This checklist is execution-focused. The sprint file remains the source of truth for context, scope, and acceptance criteria.

Related sprint doc:

- `sprint/SPRINT-json-formatter-tool.md`

## Branch Setup

- [x] Create branch `feature/json-formatter` from `development`
- [x] Confirm working tree is clean before starting implementation
- [x] Review `sprint/SPRINT-json-formatter-tool.md` before coding

## Story 1: Backend JSON Utility Service

- [x] Create `backend/jsonService.js`
- [x] Implement `formatJson(input)`
- [x] Implement `validateJson(input)`
- [x] Normalize valid/invalid results into a stable shape
- [x] Preserve useful parser error messages

## Story 2: Backend API Endpoint

- [x] Add `POST /api/json/format` to `backend/app.js`
- [x] Read `{ input }` from `req.body`
- [x] Return `400` for empty or missing input
- [x] Return formatted JSON for valid input
- [x] Return a stable error response for invalid JSON
- [x] Keep route behavior aligned with current backend API style

## Story 3: Backend Tests

- [x] Add unit tests for `formatJson`
- [x] Add unit tests for `validateJson`
- [x] Add API test for valid formatting
- [x] Add API test for invalid JSON
- [x] Add API test for empty input

## Story 4: Frontend JSON Tool Page

- [x] Create `frontend/src/pages/JsonPage.jsx`
- [x] Add textarea input
- [x] Add format button
- [x] Add clear button
- [x] Add copy button
- [x] Add output panel
- [x] Add loading state
- [x] Add validation/error state
- [x] POST JSON input to `/api/json/format`
- [x] Ensure long formatted output remains usable on mobile

## Story 5: Route and App Integration

- [x] Extend route/content config to support `toolType: 'json'`
- [x] Add JSON entries to `frontend/src/seoContent.js`
- [x] Update `frontend/src/routes.jsx` if needed
- [x] Update `frontend/src/App.jsx` to render `JsonPage`
- [x] Verify ping, IP, and DNS routes still work

## Story 6: SEO Content

- [x] Add content entry for `/json-formatter`
- [x] Add content entry for `/json-pretty-print`
- [x] Add content entry for `/json-validator`
- [x] Add content entry for `/json-viewer`
- [x] Write unique title and description for each page
- [x] Write unique `h1` and intro copy for each page
- [x] Add 2-3 useful sections per page
- [x] Add a quick facts or checklist block per page
- [x] Verify content avoids thin duplication

## Story 7: Prerender Integration

- [x] Add JSON routes to the prerender route list
- [x] Verify prerender output includes metadata and visible content
- [x] Confirm generated HTML exists for all JSON routes after build

## Story 8: Sitemap Integration

- [x] Add all JSON routes to `/sitemap.xml`
- [x] Keep sitemap format aligned with current output
- [x] Confirm JSON routes appear in the sitemap response

## Story 9: Internal Linking

- [x] Add links from ping pages to JSON pages
- [x] Add links from IP pages to JSON pages
- [ ] Add links from DNS pages to JSON pages
- [x] Add links from JSON pages back to ping, IP, and DNS tools
- [x] Keep internal linking useful and lightweight

## Story 10: Frontend Tests

- [x] Add JSON route mapping tests
- [x] Add `JsonPage` success-state test
- [x] Add loading-state test
- [x] Add invalid-JSON error-state test
- [x] Add empty-input handling test
- [x] Add copy/clear behavior tests if practical

## Story 11: Build, QA, and Release Readiness

- [x] Run `cd backend && npm test`
- [x] Run `cd frontend && npm test`
- [x] Run `cd frontend && npm run build`
- [x] Manually test valid JSON
- [x] Manually test invalid JSON
- [x] Manually test empty input
- [ ] Manually test nested JSON
- [x] Manually test copy and clear actions
- [ ] Verify mobile textarea and output layout
- [ ] Review final output against `sprint/SPRINT-json-formatter-tool.md`

## Suggested Milestones

### Milestone 1: Backend Ready

- [x] Stories 1-3 complete
- [x] Backend tests added and passing

### Milestone 2: Frontend Ready

- [x] Stories 4-6 complete
- [x] JSON pages render and route correctly

### Milestone 3: SEO and Integration Ready

- [ ] Stories 7-9 complete
- [x] Prerender and sitemap updated

### Milestone 4: Release Ready

- [ ] Stories 10-11 complete
- [ ] Full test suite and build passing

## Open Decisions to Lock Before Coding

- [x] Confirm v1 is format-only and does not include minify
- [x] Confirm formatting happens on button click, not automatically
- [x] Confirm output should be read-only
- [x] Confirm copy feedback should be simple inline/button-state feedback

## Done When

- [x] `backend/jsonService.js` exists
- [x] `POST /api/json/format` exists and is tested
- [x] JSON routes render through the existing config-driven frontend
- [x] JSON pages are prerendered
- [x] Sitemap includes JSON routes
- [ ] Internal linking includes the JSON tool
- [x] Backend tests pass
- [x] Frontend tests pass
- [x] Frontend build passes
