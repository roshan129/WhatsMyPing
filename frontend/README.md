# Frontend

This folder contains the React + Vite client for What's My Ping.

## Pages

- `/`
- `/ping-test`
- `/ping-google`
- `/ping-cloudflare`
- `/ping-discord`
- `/ping-youtube`
- `/ping-aws`

## Key Files

- [src/App.jsx](/Users/roshanadke/IdeaProjects/WhatsMyPing/frontend/src/App.jsx): app entry component
- [src/routes.jsx](/Users/roshanadke/IdeaProjects/WhatsMyPing/frontend/src/routes.jsx): route-to-page mapping
- [src/pages/PingPage.jsx](/Users/roshanadke/IdeaProjects/WhatsMyPing/frontend/src/pages/PingPage.jsx): reusable ping page UI
- [src/seoContent.js](/Users/roshanadke/IdeaProjects/WhatsMyPing/frontend/src/seoContent.js): SEO metadata and content for each page

## Scripts

- `npm run dev`: start the Vite development server
- `npm run build`: create a production build
- `npm run preview`: preview the production build locally
- `npm run lint`: run ESLint

## Development Notes

- The app uses a lightweight route system based on `window.location.pathname`.
- All pages share the same ping UI and only change metadata, copy, and target configuration.
- `npm run build` performs a client build, an SSR render pass, and writes prerendered HTML files for the public routes into `dist/`.
- During local development, `/api` and `/health` are proxied to `http://localhost:4001` unless `VITE_API_BASE_URL` is set.

See the root README for the full project overview and backend API documentation.
