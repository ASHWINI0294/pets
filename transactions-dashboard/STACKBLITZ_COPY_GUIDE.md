# StackBlitz — 4 files only (API-driven, not hardcoded)

Data is **not** hardcoded in React. The UI fetches it from:

- `GET /api/user`
- `GET /api/transactions`

## Files to add/replace in your StackBlitz project

| File | Action |
|------|--------|
| `src/App.jsx` | **Replace** — contains only `fetch` + UI |
| `src/App.css` | **Replace** — styles |
| `public/api/user` | **Add** — JSON response for `/api/user` |
| `public/api/transactions` | **Add** — JSON response for `/api/transactions` |

Create the folder `public/api/` in StackBlitz, then paste the two API files there (no `.json` extension — so the URLs match the assignment exactly).

## Why this is not hardcoded

`App.jsx` only does:

```js
const res = await fetch('/api/user')
return res.json()
```

All name/email/balance/transactions live in the API files. Change those files (or point `fetch` at a real backend) and the UI updates — no UI code changes needed.

## Test UI states

- **Error**: temporarily rename `public/api/user` → UI shows error + Retry
- **Empty**: set `public/api/transactions` contents to `[]`
- **Success**: leave the provided API files as-is
