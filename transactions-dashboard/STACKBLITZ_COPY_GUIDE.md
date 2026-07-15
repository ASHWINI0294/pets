# StackBlitz — only 2 files (no public/api needed)

## Why you saw the error

StackBlitz was not serving `/api/users.json` from `public/`, so login failed.

## Fix

Do **not** create `public/api` files. Replace only:

1. `src/App.jsx`
2. `src/App.css`

Mock API functions inside `App.jsx` simulate:
- `GET /api/user` → `getUser(email, password)`
- `GET /api/transactions` → `getTransactions(userId)`

## Test credentials (type them yourself — not shown on UI)

| Email | Password |
|-------|----------|
| `riya.sharma@example.com` | `riya123` |
| `amit.patel@example.com` | `amit123` |
| `sara.khan@example.com` | `sara123` |
