import { useEffect, useMemo, useState } from 'react'
import './App.css'

// ---------- API calls (data comes from the server, not hardcoded in UI) ----------

async function getUser() {
  const res = await fetch('/api/user')
  if (!res.ok) throw new Error('Failed to load user')
  return res.json()
}

async function getTransactions() {
  const res = await fetch('/api/transactions')
  if (!res.ok) throw new Error('Failed to load transactions')
  return res.json()
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

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [userData, txnData] = await Promise.all([getUser(), getTransactions()])
      setUser(userData)
      setTransactions(Array.isArray(txnData) ? txnData : txnData.transactions || [])
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return transactions.filter((t) => {
      const matchStatus = filter === 'all' || t.status === filter
      const matchSearch = !term || t.merchant.toLowerCase().includes(term)
      return matchStatus && matchSearch
    })
  }, [transactions, filter, search])

  if (loading) {
    return (
      <div className="app">
        <div className="state">Loading…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="state state-error">
          {error}
          <button type="button" onClick={loadData}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>My Dashboard</h1>

      {user && (
        <section className="card">
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <div className="profile-row">
            <span>Account: <strong>{user.accountType}</strong></span>
            <span>
              Balance:{' '}
              <strong className="balance">
                {formatAmount(user.balance, user.currency)}
              </strong>
            </span>
          </div>
        </section>
      )}

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

        {transactions.length === 0 ? (
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
