# StackBlitz Copy Guide — Currency Converter

Use this map to paste the code into a Vite React + TypeScript StackBlitz project.

## File map

| Copy FROM (this folder) | Paste INTO (StackBlitz) | Action |
|---|---|---|
| `index.html` | `index.html` | Replace (keeps Google Fonts links) |
| `src/main.tsx` | `src/main.tsx` | Replace |
| `src/index.css` | `src/index.css` | Replace |
| `src/App.tsx` | `src/App.tsx` | Replace |
| `src/App.css` | `src/App.css` | Replace |
| `src/types.ts` | `src/types.ts` | Create |
| `src/api/exchangeRate.ts` | `src/api/exchangeRate.ts` | Create |
| `src/vite-env.d.ts` | `src/vite-env.d.ts` | Create if missing |

## Step-by-step in StackBlitz

1. Open a **Vite React TypeScript** project in StackBlitz.
2. Replace `src/App.tsx` and `src/App.css` with the files from this folder.
3. Replace `src/index.css` and `src/main.tsx`.
4. Update `index.html` so it includes the Fraunces + Outfit font links and title.
5. Create `src/types.ts`.
6. Create folder `src/api` and add `exchangeRate.ts`.
7. Save — StackBlitz should hot-reload automatically.

## If your boilerplate is JavaScript (`.jsx`) instead of TypeScript

- Rename files to `.jsx` / `.js` and remove type annotations.
- Or switch the StackBlitz template to **React TypeScript**.

## Rates note

`src/api/exchangeRate.ts` uses simulated USD-based rates so conversion always works when outbound network calls are blocked in the sandbox.
