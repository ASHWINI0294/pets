import { useEffect, useMemo, useState } from 'react'
import './App.css'

// ---------- Mock API (swap these two functions for real fetch calls) ----------

const MOCK_USER = {
  name: 'Riya Sharma',
  email: 'riya.sharma@example.com',
  accountType: 'Premium',
  balance: 12480.5,
  currency: 'USD',
}

const MOCK_TRANSACTIONS = [
  { id: '1', merchant: 'Amazon', amount: 129.99, currency: 'USD', status: 'completed', date: '2026-07-10T10:30:00Z' },
  { id: '2', merchant: 'Starbucks', amount: 6.45, currency: 'USD', status: 'pending', date: '2026-07-11T08:15:00Z' },
  { id: '3', merchant: 'Uber', amount: 24.5, currency: 'USD', status: 'failed', date: '2026-07-09T19:40:00Z' },
  { id: '4', merchant: 'Netflix', amount: 15.99, currency: 'USD', status: 'completed', date: '2026-07-01T00:00:00Z' },
  { id: '5', merchant: 'Target', amount: 58.2, currency: 'USD', status: 'pending', date: '2026-07-12T14:22:00Z' },
  { id: '6', merchant: 'Apple Store', amount: 999, currency: 'USD', status: 'failed', date: '2026-07-08T09:05:00Z' },
  { id: '7', merchant: 'Spotify', amount: 10.99, currency: 'USD', status: 'completed', date: '2026-07-05T00:00:00Z' },
]

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

async function getUser() {
  await delay(600)
  // Uncomment next line to test error state:
  // throw new Error('Failed to load user')
  return MOCK_USER
}

async function getTransactions() {
  await delay(800)
  // Uncomment next line to test error state:
  // throw new Error('Failed to load transactions')
  // Return [] to test empty state:
  return MOCK_TRANSACTIONS
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
      setTransactions(txnData)
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

      {/* User profile */}
      {user && (
        <section className="card">
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <div className="profile-row">
            <span>Account: <strong>{user.accountType}</strong></span>
            <span>Balance: <strong className="balance">{formatAmount(user.balance, user.currency)}</strong></span>
          </div>
        </section>
      )}

      {/* Transactions */}
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
                  <td><span className={`badge ${t.status}`}>{t.status}</span></td>
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
