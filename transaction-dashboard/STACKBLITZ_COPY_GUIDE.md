# StackBlitz Copy Guide — Transaction Search Dashboard

Use this map to paste the code into your existing React + JavaScript StackBlitz boilerplate.

## File map

| Copy FROM (this folder) | Paste INTO (StackBlitz) | Action |
|---|---|---|
| `src/App.jsx` | `src/App.jsx` (or `src/App.js`) | **Replace entire file** |
| `src/App.css` | `src/App.css` | **Replace entire file** (create if missing) |
| `src/components/TransactionDashboard.jsx` | `src/components/TransactionDashboard.jsx` | **Create new file** |
| `src/api/transactions.js` | `src/api/transactions.js` | **Create new file** |
| `src/index.js` | `src/index.js` | **Keep as-is** (no changes needed) |

> **Important:** Files that contain JSX must use the `.jsx` extension. If you see `Unexpected JSX expression`, rename `TransactionDashboard.js` → `TransactionDashboard.jsx` and update the import in `App.jsx`.

## Step-by-step in StackBlitz

1. Open your StackBlitz React project.
2. In the file tree, click `src/App.jsx` (or `src/App.js`) and replace all contents with `src/App.jsx` from this guide.
3. Replace `src/App.css` (or create it if your template only has `styles.css`).
4. Right-click `src` → **New Folder** → name it `components`.
5. Inside `components`, create `TransactionDashboard.jsx` and paste the code.
6. Right-click `src` → **New Folder** → name it `api`.
7. Inside `api`, create `transactions.js` and paste the code.
8. Save all files. StackBlitz should hot-reload automatically.

## If your boilerplate uses `styles.css` instead of `App.css`

Either:

- Rename/import: in `App.js`, change `import './App.css'` to `import './styles.css'` and paste the CSS into `styles.css`, **or**
- Keep `App.css` and add `import './App.css'` in `App.js` (already done in the provided `App.js`).

## API note

`src/api/transactions.js` tries to fetch from a remote URL first, then falls back to local mock data so the page always works in StackBlitz.

If your assignment gives a specific API URL, replace `API_URL` at the top of `transactions.js`.

## Requirements covered

- Transaction list
- Search by merchant name
- Filter by status (`pending`, `completed`, `failed`)
- Sort by amount or date
- Loading state
- Error state
- Empty state
