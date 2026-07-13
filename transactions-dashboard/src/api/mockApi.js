// Mock backend layer. In a real app, these two functions would be plain
// `fetch('/api/user')` / `fetch('/api/transactions')` calls. They are kept
// here, isolated from the UI, so swapping mocks for a real HTTP client later
// only touches this one file.

const NETWORK_DELAY_MS = 700

const MOCK_USER = {
  id: 'usr_8241',
  name: 'Riya Sharma',
  email: 'riya.sharma@example.com',
  accountType: 'Premium',
  balance: 12480.5,
  currency: 'USD',
}

const MOCK_TRANSACTIONS = [
  {
    id: 'txn_001',
    merchant: 'Amazon',
    amount: 129.99,
    currency: 'USD',
    status: 'completed',
    date: '2026-07-10T10:30:00Z',
  },
  {
    id: 'txn_002',
    merchant: 'Starbucks',
    amount: 6.45,
    currency: 'USD',
    status: 'pending',
    date: '2026-07-11T08:15:00Z',
  },
  {
    id: 'txn_003',
    merchant: 'Uber',
    amount: 24.5,
    currency: 'USD',
    status: 'failed',
    date: '2026-07-09T19:40:00Z',
  },
  {
    id: 'txn_004',
    merchant: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    status: 'completed',
    date: '2026-07-01T00:00:00Z',
  },
  {
    id: 'txn_005',
    merchant: 'Target',
    amount: 58.2,
    currency: 'USD',
    status: 'pending',
    date: '2026-07-12T14:22:00Z',
  },
  {
    id: 'txn_006',
    merchant: 'Apple Store',
    amount: 999,
    currency: 'USD',
    status: 'failed',
    date: '2026-07-08T09:05:00Z',
  },
  {
    id: 'txn_007',
    merchant: 'Spotify',
    amount: 10.99,
    currency: 'USD',
    status: 'completed',
    date: '2026-07-05T00:00:00Z',
  },
]

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Lets you exercise every UI state from the browser address bar without
// touching code, e.g.:
//   ?mock=error        -> both requests fail
//   ?mock=userError     -> only /api/user fails
//   ?mock=emptyTxns    -> transactions resolve to an empty list
function getMockScenario() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('mock')
}

export async function getUser() {
  await wait(NETWORK_DELAY_MS)

  const scenario = getMockScenario()
  if (scenario === 'error' || scenario === 'userError') {
    throw new Error('Unable to load user profile. Please try again.')
  }

  return MOCK_USER
}

export async function getTransactions() {
  await wait(NETWORK_DELAY_MS + 200)

  const scenario = getMockScenario()
  if (scenario === 'error' || scenario === 'txnsError') {
    throw new Error('Unable to load transactions. Please try again.')
  }
  if (scenario === 'emptyTxns') {
    return []
  }

  return MOCK_TRANSACTIONS
}
