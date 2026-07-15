# Concepts covered in this project

This app was structured to match common frontend interview / hiring checklist items.

## 1. Promises, async/await, and the Event Loop

- `src/utils/delay.ts` — returns a `Promise` backed by `setTimeout` (macrotask).
- `src/api/mockApi.ts` — `async` functions `await delay(...)` then resolve/reject.
- UI callers use `async/await` + `try/catch/finally` (`useAuthDashboard`).

**Event Loop story you can explain:**
1. `await delay(400)` yields a Promise and frees the call stack.
2. After 400ms, the timer callback runs from the **macrotask** queue and resolves the Promise.
3. The continuation of the `async` function is queued as a **microtask** and then updates React state.

## 2. React components, behavior, and state management

- Presentational components: `LoginForm`, `UserProfile`, `TransactionFilters`, `TransactionTable`, `Dashboard`.
- State lives in `useAuthDashboard` (`useState` + `useMemo` for derived filtered list).
- Conditional rendering: login screen vs dashboard; loading / error / empty / success.

## 3. Clean, modular, type-safe architecture

```
src/
  types.ts              # shared TypeScript domain types
  api/mockApi.ts        # async data layer
  hooks/useAuthDashboard.ts
  components/…          # UI pieces
  utils/…               # pure helpers
  App.tsx               # composition root
```

TypeScript `strict` mode keeps props and API responses type-safe.

## 4. Async operations, loading states, and errors

- `loading` disables the form and shows “Signing in…” / table loading state.
- `error` surfaces login failures and refresh failures with Retry.
- Empty states cover “no transactions” and “no matches”.

## 5. Testing (unit + integration)

```bash
npm test
```

- Unit: `format.test.ts`, `filterTransactions.test.ts`, `mockApi.test.ts`
- Integration: `App.integration.test.tsx` (login success/failure + status filter)

## 6. Communicating the thought process

Use this file + PR description in interviews:
- Why mock APIs instead of fragile `public/*.json` in StackBlitz
- Why a hook owns async state instead of stuffing it into every component
- Why pure helpers (`filterTransactions`, `format*`) are easy to unit test
