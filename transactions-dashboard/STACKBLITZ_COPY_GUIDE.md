# StackBlitz copy guide

## Auth (production style)

Hardcode the access token and send it as a custom header — do **not** mock requests:

```js
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'
const ACCESS_TOKEN_HEADER = 'Access-Token'

fetch('/api/user', {
  headers: {
    Accept: 'application/json',
    [ACCESS_TOKEN_HEADER]: ACCESS_TOKEN,
  },
})
```

Same header on `GET /api/transactions`.

## Files to copy

1. Replace `src/App.jsx` (set `ACCESS_TOKEN` / header name to match the assignment)
2. Replace/create `src/App.css`
3. Optional: `src/index.css`

## Flow

1. App loads → fetches user + transactions with the access-token header  
2. Shows **Welcome, {name}!**  
3. Shows transactions (search + status filter)  
