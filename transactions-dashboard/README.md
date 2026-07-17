# User Transactions Dashboard (React + JavaScript)

Login with email/password, then see a **welcome message** and that user's **transactions**.

## Run locally

```bash
cd transactions-dashboard
npm install
npm run dev
```

## StackBlitz

Prefer a **React + JavaScript** Vite template. Copy:

| From this folder | Into StackBlitz |
|---|---|
| `src/App.jsx` | `src/App.jsx` (replace) |
| `src/App.css` | `src/App.css` (replace / create) |
| `src/index.css` | `src/index.css` (optional polish) |
| `index.html` | fonts link (optional) |

Mock APIs live inside `App.jsx` — no `public/api` files needed.

## Test credentials

| Email | Password |
|-------|----------|
| `riya.sharma@example.com` | `riya123` |
| `amit.patel@example.com` | `amit123` |
| `sara.khan@example.com` | `sara123` |

## What you get after login

1. Welcome message: `Welcome, {name}!`
2. Account type + balance
3. That user's transaction list (search + status filter)
