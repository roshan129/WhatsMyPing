# Feature Checklist: DNS Tool

## Goal

Translate the DNS sprint plan into a practical implementation checklist that can be worked through on a feature branch such as `feature/dns-tool`.

This checklist is intentionally execution-focused. The sprint file remains the source of truth for story context, scope, and acceptance criteria.

Related sprint doc:

- `sprint/SPRINT-dns-tool.md`

## Branch Setup

- [ ] Create branch `feature/dns-tool` from `development`
- [ ] Confirm working tree is clean before starting implementation
- [ ] Review `sprint/SPRINT-dns-tool.md` before coding

## Story 1: DNS Service Design

- [x] Create `backend/dnsService.js`
- [x] Add reusable lookup function for DNS records
- [x] Add support for `A` records
- [x] Add support for `AAAA` records
- [x] Add support for `CNAME` records
- [x] Add support for `MX` records
- [x] Add support for `TXT` records
- [x] Add support for `NS` records
- [x] Normalize each record type into a frontend-friendly structure
- [x] Handle "no records found" without throwing a fatal error
- [ ] Add timeout/error handling for slow or failed DNS lookups

## Story 2: Input Validation and Normalization

- [x] Define valid domain/subdomain input rules for v1
- [x] Reject empty input
- [x] Accept full URLs by stripping protocol, path, query strings, and fragments before validation
- [x] Accept pasted host values that include paths or ports by normalizing them before validation
- [x] Normalize whitespace and casing
- [x] Return stable validation error messages for bad input

## Story 3: Backend API Endpoint

- [x] Add `GET /api/dns` to the backend app
- [x] Accept `domain` query param
- [x] Call shared DNS service from the route
- [x] Return stable JSON response with `domain`, `queriedAt`, and `records`
- [x] Return `400` for invalid input
- [x] Return graceful error response for lookup failures
- [x] Keep route behavior aligned with existing backend API style

## Story 4: Frontend DNS Tool Page

- [x] Create `frontend/src/pages/DnsPage.jsx`
- [x] Add domain input UI
- [x] Add submit action
- [x] Add loading state
- [x] Add success state
- [x] Add validation/error state
- [x] Render grouped DNS record sections
- [x] Render readable empty states for missing record types
- [x] Ensure long TXT/CNAME/NS values wrap safely on mobile

## Story 5: Route and App Integration

- [x] Extend route/content config to support `toolType: 'dns'`
- [x] Add DNS entries to `frontend/src/seoContent.js`
- [x] Update `frontend/src/routes.jsx` if needed
- [x] Update `frontend/src/App.jsx` to render `DnsPage` for DNS routes
- [x] Verify existing ping and IP routes still render correctly

## Story 6: SEO Content

- [x] Add content entry for `/dns-lookup`
- [x] Add content entry for `/dns-check`
- [x] Add content entry for `/check-dns-records`
- [x] Add content entry for `/mx-lookup`
- [x] Add content entry for `/txt-lookup`
- [x] Write unique title and description for each page
- [x] Write unique `h1` and intro copy for each page
- [x] Add 2-3 sections of useful static content per page
- [x] Add a quick facts or checklist block per page
- [x] Verify content avoids thin duplication across DNS pages

## Story 7: Prerender Integration

- [x] Add DNS routes to the prerender route list
- [x] Verify prerender output includes titles and visible content
- [x] Confirm generated HTML exists for all DNS routes after build

## Story 8: Sitemap Integration

- [x] Add all DNS routes to `/sitemap.xml`
- [x] Keep sitemap format aligned with current output
- [x] Confirm DNS routes appear in the generated sitemap response

## Story 9: Internal Linking

- [x] Add links from ping pages to relevant DNS pages
- [x] Add links from IP pages to relevant DNS pages
- [x] Add links from DNS pages back to ping and IP tools
- [x] Keep internal linking useful and lightweight

## Story 10: Backend Tests

- [x] Add unit tests for domain validation
- [x] Add unit tests for domain normalization
- [x] Add unit tests for DNS response shaping
- [x] Add API test for valid DNS lookup
- [x] Add API test for invalid domain handling
- [x] Add API test for empty record-set behavior
- [x] Add API test for DNS service failure handling
- [x] Mock DNS resolution so tests stay deterministic

## Story 11: Frontend Tests

- [x] Add DNS route mapping tests
- [x] Add `DnsPage` success-state test
- [x] Add `DnsPage` loading-state test
- [x] Add `DnsPage` validation/error-state test
- [x] Add grouped record rendering test
- [x] Add prerender route coverage test for DNS pages

## Story 12: Build, QA, and Release Readiness

- [x] Run `cd backend && npm test`
- [x] Run `cd frontend && npm test`
- [x] Run `cd frontend && npm run build`
- [x] Manually test a normal domain
- [x] Manually test a subdomain
- [x] Manually test invalid input
- [x] Manually test a domain with sparse records
- [ ] Verify mobile layout and safe text wrapping
- [ ] Review final output against `sprint/SPRINT-dns-tool.md`

## Suggested Milestones

### Milestone 1: Backend Ready

- [x] Stories 1-3 complete
- [x] Backend tests added and passing

### Milestone 2: Frontend Ready

- [x] Stories 4-6 complete
- [x] DNS pages render and route correctly

### Milestone 3: SEO and Integration Ready

- [x] Stories 7-9 complete
- [x] Prerender and sitemap updated

### Milestone 4: Release Ready

- [ ] Stories 10-12 complete
- [ ] Full test suite and build passing

## Open Decisions to Lock Before Coding

- [x] Confirm v1 allows subdomains
- [x] Confirm v1 returns all common record types in one request
- [x] Confirm TXT values should be flattened for display
- [x] Confirm v1 does not chase DNS chains beyond direct lookup

## Done When

- [x] `GET /api/dns` exists and is tested
- [x] DNS routes render through the existing config-driven frontend
- [x] DNS pages are prerendered
- [x] Sitemap includes DNS pages
- [x] Internal linking is in place
- [x] Backend tests pass
- [x] Frontend tests pass
- [x] Frontend build passes
