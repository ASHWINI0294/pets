# StackBlitz copy guide

## Why in-app mocks?

Fetching `/api/users.json` from `public/` often fails in StackBlitz (HTML returned instead of JSON).  
`getUser` / `getTransactions` inside `App.jsx` avoid that.

## Files to copy

1. Replace `src/App.jsx`
2. Replace/create `src/App.css`
3. Optional: replace `src/index.css` and add the Google Fonts link from `index.html`

## Credentials

| Email | Password |
|-------|----------|
| `riya.sharma@example.com` | `riya123` |
| `amit.patel@example.com` | `amit123` |
| `sara.khan@example.com` | `sara123` |

## Flow

1. Login with email + password  
2. See **Welcome, {name}!**  
3. See **that user's transactions** only  
