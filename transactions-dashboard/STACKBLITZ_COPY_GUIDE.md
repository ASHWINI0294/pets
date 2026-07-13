# Copying this into your StackBlitz React (JavaScript) boilerplate

This folder is a full, runnable copy of the dashboard (`npm install && npm run dev`)
so you can review/test it here. To move it into your StackBlitz project, create the
files below with the same paths, relative to your project's `src/` folder.

StackBlitz's default "React" starter is Vite-based, so it already ships with
`src/main.jsx` and `src/App.jsx`. If yours uses `.js` extensions instead of `.jsx`,
just keep the extension your boilerplate already uses — the content is identical.

## Files to add

```
src/api/mockApi.js
src/utils/format.js
src/hooks/useAsync.js
src/components/LoadingState.jsx
src/components/ErrorState.jsx
src/components/EmptyState.jsx
src/components/StatusBadge.jsx
src/components/UserProfile.jsx
src/components/TransactionFilters.jsx
src/components/TransactionTable.jsx
src/components/TransactionsSection.jsx
```

## Files to replace/edit

- `src/App.jsx` — replace with this project's `src/App.jsx` (renders `<UserProfile />`
  and `<TransactionsSection />`).
- `src/App.css` — replace with this project's `src/App.css` (all dashboard styling).
- `src/main.jsx` — no changes needed beyond making sure it renders `<App />`
  (already the case in most boilerplates).

## Testing the different UI states

Append a query param to the StackBlitz preview URL:

- `?mock=error` — both the profile and the transactions request fail (error state).
- `?mock=userError` — only the profile request fails.
- `?mock=txnsError` — only the transactions request fails.
- `?mock=emptyTxns` — transactions resolve successfully but the list is empty (empty state).
- No param — both requests succeed with sample data (success state).
