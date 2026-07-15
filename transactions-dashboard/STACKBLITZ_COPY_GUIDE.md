# StackBlitz fix for login error

## Why you saw this error

```
Unexpected token '<', "<!doctype "... is not valid JSON
```

`fetch('/api/users')` did **not** find your JSON file, so StackBlitz returned the HTML page (`<!doctype html>...`). `.json()` then crashed.

## Why "riya" looked highlighted

That orange/yellow mark is **browser Find on page** (Ctrl+F / Cmd+F), not app styling. Clear the find box / press Esc and it goes away.

## Exact files to create in StackBlitz

In the StackBlitz file tree:

1. Create folder: `public`
2. Inside it create folder: `api`
3. Add these **2 files** (names must include `.json`):

### `public/api/users.json`

Paste the contents from this repo's `transactions-dashboard/public/api/users.json`

### `public/api/transactions.json`

Paste the contents from this repo's `transactions-dashboard/public/api/transactions.json`

4. Replace `src/App.jsx` and `src/App.css` with the repo versions.

## Demo logins

| Email | Password |
|-------|----------|
| `riya.sharma@example.com` | `riya123` |
| `amit.patel@example.com` | `amit123` |
| `sara.khan@example.com` | `sara123` |

After the `.json` files exist, Sign in should work.
