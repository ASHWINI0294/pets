# StackBlitz — login + multi-user dashboard

## How login → fetch works

1. User enters **email + password** on the login screen
2. App calls `GET /api/users`, finds a matching account
3. On success it keeps that user's profile in state (without password)
4. App calls `GET /api/transactions` and keeps only rows where `userId` matches
5. Different credentials → different user → different transactions

So Riya / Amit / Sara are **not** hardcoded in the UI — they come from the API after login.

## Demo credentials

| Email | Password | What you see |
|-------|----------|--------------|
| `riya.sharma@example.com` | `riya123` | Riya + her 5 txns |
| `amit.patel@example.com` | `amit123` | Amit + his 3 txns |
| `sara.khan@example.com` | `sara123` | Sara + her 3 txns |

## Files to copy into StackBlitz

| File | Action |
|------|--------|
| `src/App.jsx` | Replace |
| `src/App.css` | Replace |
| `public/api/users` | Add (all accounts) |
| `public/api/transactions` | Add (all txns with `userId`) |

Create folder `public/api/` first, then paste the two API files.

## Note about the original assignment

Many StackBlitz tasks only ask for `GET /api/user` (singular = "currently logged-in user") with **no login UI**. That always shows one user by design.

This version adds login because you asked: *"how does it fetch the user if I login with another credentials?"*
