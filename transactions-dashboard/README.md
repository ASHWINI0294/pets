# User Transactions Dashboard (React + JavaScript)

Fetches the **current user** and **transactions** from the real API — no mocks.

Auth is a **hardcoded access token** sent as a custom header on every `fetch`.

## Setup

In `src/App.jsx`, set the token from your assignment:

```js
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'
const ACCESS_TOKEN_HEADER = 'Access-Token' // rename if the API expects another header
```

Endpoints (relative — same as production):

- `GET /api/user`
- `GET /api/transactions`

## Run locally

```bash
cd transactions-dashboard
npm install
npm run dev
```

## What the UI shows

1. **Welcome, {name}!** from `/api/user`
2. Account details when the API returns them
3. That user’s transactions (search + status filter)

## StackBlitz

Copy `src/App.jsx` + `src/App.css` (and optionally `src/index.css`).  
Paste your real `ACCESS_TOKEN` value. No `public/api` mock files needed.
