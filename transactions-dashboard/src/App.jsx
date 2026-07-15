import { useMemo, useState } from 'react'
import './App.css'

// ---------- Mock API (stands in for GET /api/user and GET /api/transactions) ----------
// No public/ files needed — works immediately in StackBlitz.

const USERS = [
  {
    id: 'u1',
    name: 'Riya Sharma',
    email: 'riya.sharma@example.com',
    password: 'riya123',
    accountType: 'Premium',
    balance: 12480.5,
    currency: 'USD',
  },
  {
    id: 'u2',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    password: 'amit123',
    accountType: 'Standard',
    balance: 3200,
    currency: 'USD',
  },
  {
    id: 'u3',
    name: 'Sara Khan',
    email: 'sara.khan@example.com',
    password: 'sara123',
    accountType: 'Premium',
    balance: 8750.25,
    currency: 'USD',
  },
]

const TRANSACTIONS = [
  { id: '1', userId: 'u1', merchant: 'Amazon', amount: 129.99, currency: 'USD', status: 'completed', date: '2026-07-10T10:30:00Z' },
  { id: '2', userId: 'u1', merchant: 'Starbucks', amount: 6.45, currency: 'USD', status: 'pending', date: '2026-07-11T08:15:00Z' },
  { id: '3', userId: 'u1', merchant: 'Uber', amount: 24.5, currency: 'USD', status: 'failed', date: '2026-07-09T19:40:00Z' },
  { id: '4', userId: 'u1', merchant: 'Netflix', amount: 15.99, currency: 'USD', status: 'completed', date: '2026-07-01T00:00:00Z' },
  { id: '5', userId: 'u1', merchant: 'Target', amount: 58.2, currency: 'USD', status: 'pending', date: '2026-07-12T14:22:00Z' },
  { id: '6', userId: 'u2', merchant: 'Flipkart', amount: 89, currency: 'USD', status: 'completed', date: '2026-07-08T12:00:00Z' },
  { id: '7', userId: 'u2', merchant: 'Swiggy', amount: 18.75, currency: 'USD', status: 'pending', date: '2026-07-11T19:20:00Z' },
  { id: '8', userId: 'u2', merchant: 'IRCTC', amount: 45, currency: 'USD', status: 'failed', date: '2026-07-07T06:10:00Z' },
  { id: '9', userId: 'u3', merchant: 'Zara', amount: 210, currency: 'USD', status: 'completed', date: '2026-07-09T16:45:00Z' },
  { id: '10', userId: 'u3', merchant: 'Airbnb', amount: 450, currency: 'USD', status: 'completed', date: '2026-07-03T09:00:00Z' },
  { id: '11', userId: 'u3', merchant: 'Shell', amount: 52.3, currency: 'USD', status: 'pending', date: '2026-07-12T07:30:00Z' },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock: login / resolve current user (like GET /api/user after auth)
async function getUser(email, password) {
  await delay(500)
  const found = USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  )
  if (!found) throw new Error('Invalid email or password')
  const { password: _pw, ...safeUser } = found
  return safeUser
}

// Mock: GET /api/transactions for the logged-in user
async function getTransactions(userId) {
  await delay(500)
  return TRANSACTIONS.filter((t) => t.userId === userId)
}

// ---------- Helpers ----------

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

// ---------- App ----------

export default function App() {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const loggedInUser = await getUser(email, password)
      const txns = await getTransactions(loggedInUser.id)
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

  async function refreshTransactions() {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const txns = await getTransactions(user.id)
      setTransactions(txns)
    } catch (err) {
      setError(err.message || 'Failed to refresh')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return transactions.filter((t) => {
      const matchStatus = filter === 'all' || t.status === filter
      const matchSearch = !term || t.merchant.toLowerCase().includes(term)
      return matchStatus && matchSearch
    })
  }, [transactions, filter, search])

  if (!user) {
    return (
      <div className="login-page">
        <div className="aurora" aria-hidden="true">
          <span className="aurora-blob aurora-blob--1" />
          <span className="aurora-blob aurora-blob--2" />
          <span className="aurora-blob aurora-blob--3" />
        </div>

        <div className="login-content">
          <h1>FinTrackr</h1>
          <section className="card login-card">
            <h2 className="login-title">Login</h2>
            <p className="login-subtitle">Sign in to load your profile and transactions.</p>

            <form className="login-form" onSubmit={handleLogin}>
              <label className="login-label">
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
              <label className="login-label">
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
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="aurora" aria-hidden="true">
        <span className="aurora-blob aurora-blob--1" />
        <span className="aurora-blob aurora-blob--2" />
        <span className="aurora-blob aurora-blob--3" />
      </div>

      <div className="app dashboard-content">
        <div className="topbar">
          <h1>My Dashboard</h1>
          <button type="button" className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {error && (
          <div className="state state-error">
            {error}
            <button type="button" onClick={refreshTransactions}>
              Retry
            </button>
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
    </div>
  )
}
