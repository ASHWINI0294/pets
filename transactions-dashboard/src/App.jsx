import { useEffect, useMemo, useState } from 'react'
import './App.css'

// ---------------------------------------------------------------------------
// Production-style API access
// Hardcode the access token from the assignment and send it as a custom header
// on every request — no mock data, no fake delay.
// ---------------------------------------------------------------------------

const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'

/** Custom header name expected by the API (not Authorization Bearer). */
const ACCESS_TOKEN_HEADER = 'Access-Token'

const API = {
  user: '/api/user',
  transactions: '/api/transactions',
}

async function apiFetch(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      [ACCESS_TOKEN_HEADER]: ACCESS_TOKEN,
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`)
  }

  return response.json()
}

/** GET /api/user — current user profile (authenticated via access token header). */
async function getUser() {
  const data = await apiFetch(API.user)
  // Support either a bare user object or { user: {...} }
  return data?.user ?? data
}

/** GET /api/transactions — transactions for the authenticated user. */
async function getTransactions() {
  const data = await apiFetch(API.transactions)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.transactions)) return data.transactions
  return []
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  async function loadDashboard() {
    setLoading(true)
    setError('')

    try {
      // Token header authenticates both calls — same as production.
      const [userData, txnData] = await Promise.all([getUser(), getTransactions()])
      setUser(userData)
      setTransactions(txnData)
      setFilter('all')
      setSearch('')
    } catch (err) {
      setUser(null)
      setTransactions([])
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return transactions.filter((t) => {
      const matchStatus = filter === 'all' || t.status === filter
      const matchSearch = !term || String(t.merchant || '').toLowerCase().includes(term)
      return matchStatus && matchSearch
    })
  }, [transactions, filter, search])

  const displayName = user?.name || user?.username || user?.email || 'there'

  if (loading) {
    return (
      <div className="app">
        <p className="brand">Ledgerly</p>
        <div className="state">Loading your account…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <p className="brand">Ledgerly</p>
        <div className="state state-error">
          {error}
          <button type="button" onClick={loadDashboard}>
            Retry
          </button>
        </div>
        <p className="muted hint">
          Requests send <code>{ACCESS_TOKEN_HEADER}</code> with your hardcoded access token.
          Set <code>ACCESS_TOKEN</code> at the top of <code>App.jsx</code> to the value from the
          assignment if this fails.
        </p>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="topbar">
        <p className="brand">Ledgerly</p>
        <button type="button" className="logout" onClick={loadDashboard}>
          Refresh
        </button>
      </div>

      <section className="panel welcome-panel" aria-label="Welcome">
        <p className="welcome-eyebrow">Signed in</p>
        <h1 className="welcome-title">Welcome, {displayName}!</h1>
        {user?.email ? <p className="muted">{user.email}</p> : null}
        <div className="profile-row">
          {user?.accountType ? (
            <span>
              Account: <strong>{user.accountType}</strong>
            </span>
          ) : null}
          {typeof user?.balance === 'number' ? (
            <span>
              Balance:{' '}
              <strong className="balance">
                {formatAmount(user.balance, user.currency || 'USD')}
              </strong>
            </span>
          ) : null}
        </div>
      </section>

      <section className="panel" aria-label="Transactions">
        <h2>Your transactions</h2>
        <p className="muted">Loaded from the API with your access token header.</p>

        <div className="controls">
          <input
            type="search"
            placeholder="Search merchant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search merchant"
          />
          <div className="tabs" role="tablist" aria-label="Status filter">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={filter === f ? 'active' : ''}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="state">No transactions yet.</div>
        ) : filtered.length === 0 ? (
          <div className="state">No matching transactions.</div>
        ) : (
          <div className="table-wrap">
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
                    <td>{formatAmount(t.amount, t.currency || 'USD')}</td>
                    <td>
                      <span className={`badge ${t.status}`}>{t.status}</span>
                    </td>
                    <td>{formatDate(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
