import { useEffect, useMemo, useState } from 'react'
import './App.css'

// After login we know WHO the user is (userId).
// Then we fetch that user's profile + only their transactions.

async function fetchJson(url) {
  const res = await fetch(url)
  const text = await res.text()

  // If the file is missing, Vite/StackBlitz returns index.html instead of JSON.
  // That causes: Unexpected token '<', "<!doctype "... is not valid JSON
  if (!res.ok || text.trim().startsWith('<')) {
    throw new Error(
      `Could not load ${url}. In StackBlitz create this file under public/ (see copy guide).`,
    )
  }

  return JSON.parse(text)
}

async function loginUser(email, password) {
  // Use .json so StackBlitz/Vite always serves it as a static file
  const users = await fetchJson('/api/users.json')
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  )

  if (!found) throw new Error('Invalid email or password')

  // Never keep password in React state
  const { password: _pw, ...safeUser } = found
  return safeUser
}

async function getTransactionsForUser(userId) {
  const all = await fetchJson('/api/transactions.json')
  // Real backend would do: GET /api/transactions?userId=...
  // Here we filter client-side because StackBlitz only has static JSON files.
  return all.filter((t) => t.userId === userId)
}

function formatAmount(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

const FILTERS = ['all', 'completed', 'pending', 'failed']

const DEMO_ACCOUNTS = [
  { email: 'riya.sharma@example.com', password: 'riya123' },
  { email: 'amit.patel@example.com', password: 'amit123' },
  { email: 'sara.khan@example.com', password: 'sara123' },
]

export default function App() {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Login form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1) Authenticate → get THIS user's profile
      const loggedInUser = await loginUser(email, password)
      // 2) Fetch ONLY that user's transactions
      const txns = await getTransactionsForUser(loggedInUser.id)

      setUser(loggedInUser)
      setTransactions(txns)
      setFilter('all')
      setSearch('')
    } catch (err) {
      setUser(null)
      setTransactions([])
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setUser(null)
    setTransactions([])
    setError('')
    setPassword('')
  }

  // If already logged in and you want a manual refresh of transactions:
  async function refreshTransactions() {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const txns = await getTransactionsForUser(user.id)
      setTransactions(txns)
    } catch (err) {
      setError(err.message || 'Failed to refresh')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // no auto-login — user must sign in first
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return transactions.filter((t) => {
      const matchStatus = filter === 'all' || t.status === filter
      const matchSearch = !term || t.merchant.toLowerCase().includes(term)
      return matchStatus && matchSearch
    })
  }, [transactions, filter, search])

  // ---------- LOGIN SCREEN ----------
  if (!user) {
    return (
      <div className="app">
        <h1>My Dashboard</h1>
        <section className="card login-card">
          <h2>Login</h2>
          <p className="muted">Sign in to load your profile and transactions.</p>

          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="demo-box">
            <strong>Demo accounts</strong>
            <ul>
              {DEMO_ACCOUNTS.map((a) => (
                <li key={a.email}>
                  <button
                    type="button"
                    className="linkish"
                    onClick={() => {
                      setEmail(a.email)
                      setPassword(a.password)
                      setError('')
                    }}
                  >
                    {a.email}
                  </button>
                  {' / '}
                  {a.password}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    )
  }

  // ---------- DASHBOARD (after login) ----------
  return (
    <div className="app">
      <div className="topbar">
        <h1>My Dashboard</h1>
        <button type="button" className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && (
        <div className="state state-error">
          {error}
          <button type="button" onClick={refreshTransactions}>Retry</button>
        </div>
      )}

      <section className="card">
        <h2>{user.name}</h2>
        <p className="muted">{user.email}</p>
        <div className="profile-row">
          <span>
            Account: <strong>{user.accountType}</strong>
          </span>
          <span>
            Balance:{' '}
            <strong className="balance">{formatAmount(user.balance, user.currency)}</strong>
          </span>
        </div>
      </section>

      <section className="card">
        <h2>Transactions</h2>

        <div className="controls">
          <input
            type="search"
            placeholder="Search merchant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="tabs">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={filter === f ? 'active' : ''}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="state">Loading…</div>
        ) : transactions.length === 0 ? (
          <div className="state">No transactions yet.</div>
        ) : filtered.length === 0 ? (
          <div className="state">No matching transactions.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>{t.merchant}</td>
                  <td>{formatAmount(t.amount, t.currency)}</td>
                  <td>
                    <span className={`badge ${t.status}`}>{t.status}</span>
                  </td>
                  <td>{formatDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
