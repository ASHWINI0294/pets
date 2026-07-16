# AGENTS.md

## Cursor Cloud specific instructions

This repo is a mixed monorepo with three independent products (no root workspace / no root `package.json`):

- `transactions-dashboard/` — React 18 + TypeScript + Vite 5 SPA. Data and auth are fully mocked in-memory (`src/api/mockApi.ts`); no backend, DB, or env vars needed. Demo login: `riya.sharma@example.com` / `riya123`. Scripts (run from that dir): `npm run dev`, `npm run build` (runs `tsc --noEmit` then `vite build`), `npm test` (Vitest), `npm run test:watch`.
- `url-shortener/` — React 19 + Vite 8 SPA. Scripts: `npm run dev`, `npm run build`, `npm run lint` (oxlint). No test script. The shorten feature calls the external `api.shrtco.de` API, which is often unavailable — validation/loading/error UI states still work offline.
- Repo root — static HTML/Bootstrap/jQuery marketing site (no build step); serve with any static server, e.g. `python3 -m http.server`.

Non-obvious notes:
- Dependencies are per-project: run `npm install` separately inside `transactions-dashboard/` and `url-shortener/` (no hoisting). The startup update script already does this.
- Both Vite apps default to port `5173`. If running them at the same time, give one a different port, e.g. `npm run dev -- --port 5174`.
- `url-shortener` uses Vite 8 which requires Node 20.19+/22.12+; the VM's Node 22 satisfies both apps.
