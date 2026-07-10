// Swap this URL if your assignment provides a different API endpoint.
const API_URL = 'https://mock-api.vercel.app/api/transactions';

const FALLBACK_TRANSACTIONS = [
  {
    id: '1',
    merchant: 'Amazon',
    amount: 129.99,
    status: 'completed',
    date: '2026-07-08T10:30:00Z',
  },
  {
    id: '2',
    merchant: 'Starbucks',
    amount: 6.45,
    status: 'pending',
    date: '2026-07-09T08:15:00Z',
  },
  {
    id: '3',
    merchant: 'Uber',
    amount: 24.5,
    status: 'failed',
    date: '2026-07-07T19:40:00Z',
  },
  {
    id: '4',
    merchant: 'Netflix',
    amount: 15.99,
    status: 'completed',
    date: '2026-07-01T00:00:00Z',
  },
  {
    id: '5',
    merchant: 'Target',
    amount: 58.2,
    status: 'pending',
    date: '2026-07-09T14:22:00Z',
  },
];

export async function fetchTransactions() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to load transactions');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.transactions || FALLBACK_TRANSACTIONS;
  } catch {
    // Use local mock data when the remote API is unavailable.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return FALLBACK_TRANSACTIONS;
  }
}
