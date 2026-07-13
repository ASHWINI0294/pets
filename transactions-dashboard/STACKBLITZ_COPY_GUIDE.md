# Optimal StackBlitz solution — only 2 files

In your StackBlitz React (JavaScript) boilerplate, **replace only these 2 files**:

1. `src/App.jsx`  ← paste contents from this folder's `src/App.jsx`
2. `src/App.css`  ← paste contents from this folder's `src/App.css`

That's it. Do **not** create any new folders or components.

## How to test UI states quickly

Inside `src/App.jsx`, in `getUser()` / `getTransactions()`:

- Error state → uncomment `throw new Error(...)`
- Empty state → change `return MOCK_TRANSACTIONS` to `return []`
- Success state → leave as-is (default)

## If your boilerplate uses `.js` instead of `.jsx`

Rename / paste into `src/App.js` instead — same content works.
