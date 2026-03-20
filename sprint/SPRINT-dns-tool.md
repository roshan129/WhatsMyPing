# Sprint: DNS Lookup Tool

## Sprint Goal

Add a DNS lookup tool to What's My Ping so users can inspect common DNS records from the same network diagnostics site and architecture.

This sprint should introduce a reusable DNS tool page, a backend DNS lookup endpoint, and a small set of SEO-focused DNS pages without breaking the current ping and IP tools.

Suggested target routes:

- `/dns-lookup`
- `/dns-check`
- `/check-dns-records`
- `/mx-lookup`
- `/txt-lookup`

## Product Goal

Give users a simple way to enter a domain and inspect common DNS records such as:

- `A`
- `AAAA`
- `CNAME`
- `MX`
- `TXT`
- `NS`

Version 1 should focus on reliability, clarity, and useful output rather than becoming a full DNS debugging suite.

## Architecture Notes

The new DNS tool should reuse the same patterns already established in the project:

- backend route and API logic stay in the existing Express backend
- shared DNS lookup logic should live in a dedicated service module
- frontend routes remain config-driven
- page content stays centralized in `frontend/src/seoContent.js`
- tool rendering stays centralized in `frontend/src/App.jsx`
- prerender and sitemap must stay aligned with route config

Recommended implementation shape:

- add `toolType: 'dns'` support to the current route/content model
- add `backend/dnsService.js` for lookup and normalization logic
- add `frontend/src/pages/DnsPage.jsx` as the reusable UI
- keep the DNS tool read-only and server-driven

## Scope Guardrails

Include in version 1:

- domain input
- common record lookups
- user-friendly empty states
- clear validation and error messages
- SEO copy for DNS-focused pages

Do not include in version 1:

- DNS propagation history
- DNSSEC analysis
- third-party geolocation or WHOIS enrichment
- zone transfers
- bulk lookup
- saved history or user accounts

## Stories

### Story 1: DNS Service Design

Goal:
Create a small shared backend service for DNS record resolution.

Tasks:

1. Add `backend/dnsService.js`
2. Implement lookup helpers for:
   - `A`
   - `AAAA`
   - `CNAME`
   - `MX`
   - `TXT`
   - `NS`
3. Normalize results into a stable response shape
4. Handle record-not-found cases without treating them as hard server failures
5. Add timeout/error handling so slow lookups fail gracefully

Acceptance criteria:

- service exposes a reusable DNS lookup function
- record results are returned in a consistent structure
- missing records are represented cleanly
- transient lookup failures return predictable errors

### Story 2: Input Validation and Normalization

Goal:
Protect the API from invalid or malformed domain input.

Tasks:

1. Define accepted input format for hostnames/domains
2. Reject invalid values such as:
   - empty strings
   - URLs with protocol
   - paths or query strings
   - obviously malformed hostnames
3. Normalize case and whitespace
4. Decide whether subdomains are allowed in v1
5. Return clear validation errors from the API

Acceptance criteria:

- invalid input returns `400`
- valid domains and subdomains are accepted according to the chosen rule
- API error messages are user-friendly and stable

### Story 3: Backend API Endpoint

Goal:
Expose DNS lookup results through a public backend endpoint.

Tasks:

1. Add `GET /api/dns?domain=example.com`
2. Use the shared DNS service for resolution
3. Return:
   - `domain`
   - `records`
   - `queriedAt`
   - optional `errors` or `warnings`
4. Keep the JSON structure stable enough for frontend rendering and testing
5. Decide whether all record types are returned in one request or filtered by page intent

Acceptance criteria:

- endpoint returns DNS results for valid domains
- invalid domains return a validation error
- response shape is documented and consistent

Suggested response shape:

```json
{
  "domain": "example.com",
  "queriedAt": "2026-03-20T12:00:00.000Z",
  "records": {
    "A": ["93.184.216.34"],
    "AAAA": [],
    "CNAME": [],
    "MX": [{ "exchange": "mail.example.com", "priority": 10 }],
    "TXT": ["v=spf1 include:_spf.example.com ~all"],
    "NS": ["ns1.example.com", "ns2.example.com"]
  }
}
```

### Story 4: Frontend DNS Tool Page

Goal:
Build a reusable DNS page that matches the existing ping/IP tool style.

Tasks:

1. Add `frontend/src/pages/DnsPage.jsx`
2. Render:
   - form input
   - submit action
   - loading state
   - success state
   - validation/error state
3. Present records in a readable grouped layout
4. Make long values like TXT records wrap safely on mobile
5. Add helper copy for empty record groups

Acceptance criteria:

- users can submit a domain and see DNS records
- error messages are understandable
- layout remains usable on mobile and desktop

### Story 5: Route and App Integration

Goal:
Integrate DNS routes without introducing a separate routing system.

Tasks:

1. Extend the route/content config model to support `toolType: 'dns'`
2. Add DNS route entries in `frontend/src/seoContent.js`
3. Update `frontend/src/routes.jsx` if needed
4. Update `frontend/src/App.jsx` so DNS routes render `DnsPage`
5. Keep current ping and IP behavior unchanged

Acceptance criteria:

- all DNS routes resolve correctly
- existing routes still work
- unknown-route fallback behavior remains intact

### Story 6: SEO Content for DNS Pages

Goal:
Create distinct DNS pages that are useful before and after the interactive lookup runs.

Tasks:

1. Add unique content entries for each DNS route
2. Give each page:
   - unique title
   - unique description
   - unique `h1`
   - DNS-specific intro copy
   - 2-3 section blocks
   - a quick facts or checklist section
3. Differentiate page intent by route angle

Page angle ideas:

- `/dns-lookup`: broad all-purpose DNS lookup page
- `/dns-check`: troubleshooting framing
- `/check-dns-records`: verification and configuration sanity check
- `/mx-lookup`: mail routing focus
- `/txt-lookup`: SPF, DKIM, verification-token focus

Acceptance criteria:

- each page has distinct metadata and body copy
- prerendered HTML contains meaningful page content
- pages avoid thin-content duplication

### Story 7: Prerender Integration

Goal:
Emit the new DNS routes as static HTML in the frontend build.

Tasks:

1. Add all DNS routes to the prerender route list
2. Ensure prerender output contains the correct title and page copy
3. Verify route coverage through tests or build checks

Acceptance criteria:

- frontend build emits HTML files for DNS pages
- generated HTML includes visible content, not only a client shell

### Story 8: Sitemap Integration

Goal:
Expose the DNS routes to search engines.

Tasks:

1. Add DNS pages to `/sitemap.xml`
2. Keep the sitemap output format aligned with existing routes
3. Ensure future additions remain easy to maintain

Acceptance criteria:

- sitemap includes all DNS pages
- sitemap tests cover the new routes

### Story 9: Internal Linking

Goal:
Connect DNS pages with the existing ping and IP tools.

Tasks:

1. Add links from ping pages to relevant DNS pages
2. Add links from IP pages to relevant DNS pages
3. Add links from DNS pages back to `/ping-test` and IP pages
4. Keep link sets lightweight and relevant

Acceptance criteria:

- each DNS page links to useful adjacent tools
- at least some existing tools surface DNS as a next step

### Story 10: Backend Tests

Goal:
Cover the DNS service and API behavior with automated tests.

Tasks:

1. Add unit tests for domain validation and normalization
2. Add unit tests for DNS service result shaping
3. Add API tests for:
   - valid lookup
   - invalid domain
   - empty record sets
   - service failure handling
4. Mock DNS resolution where needed to keep tests deterministic

Acceptance criteria:

- backend DNS logic is covered by Vitest
- `/api/dns` behavior is verified with stable tests

### Story 11: Frontend Tests

Goal:
Cover route mapping and page behavior for the DNS tool.

Tasks:

1. Add tests for DNS route mapping
2. Add tests for `DnsPage` loading, success, and failure states
3. Add tests for rendering grouped DNS records
4. Add prerender coverage tests for DNS routes

Acceptance criteria:

- frontend tests cover the new DNS flows
- prerender route coverage includes DNS pages

### Story 12: Build, QA, and Release Readiness

Goal:
Verify the feature is ready to merge and ship.

Tasks:

1. Run backend tests
2. Run frontend tests
3. Run frontend build and prerender
4. Manually test:
   - a normal domain
   - a subdomain
   - an invalid domain
   - a domain with sparse records
5. Confirm mobile layout and text wrapping

Acceptance criteria:

- tests pass
- build succeeds
- DNS tool works across key manual scenarios

## Recommended Execution Order

1. DNS validation rules
2. `backend/dnsService.js`
3. `GET /api/dns`
4. `DnsPage.jsx`
5. route/app integration
6. SEO content
7. prerender update
8. sitemap update
9. internal linking
10. backend and frontend tests
11. build and manual QA

## Open Decisions

These should be resolved before implementation starts:

1. Should v1 allow subdomains as input, or only apex domains and common subdomains?
2. Should the API always return all record types, or support a `type=` filter later?
3. Should TXT values be flattened into strings or preserved as raw segments?
4. Should `CNAME` be shown only when directly present, without chasing the chain?

Recommended defaults:

- allow subdomains
- return all common record types in one request
- flatten TXT output for display
- do not chase DNS chains beyond the direct lookup

## Definition of Done

- `GET /api/dns` exists and returns a stable shape
- DNS pages render in the current config-driven frontend
- DNS routes are prerendered
- sitemap includes DNS pages
- backend and frontend tests cover the new feature
- the tool is usable on mobile and desktop
