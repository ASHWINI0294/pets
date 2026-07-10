import { useEffect, useMemo, useState } from 'react';
import { fetchTransactions } from '../api/transactions';

const STATUS_OPTIONS = ['all', 'pending', 'completed', 'failed'];

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatAmount(value) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export default function TransactionDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      setLoading(true);
      setError('');

      try {
        const data = await fetchTransactions();
        if (!cancelled) {
          setTransactions(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Something went wrong while fetching transactions.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = transactions.filter((transaction) => {
      const matchesSearch = transaction.merchant.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all' || transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'amount') {
        return b.amount - a.amount;
      }

      return new Date(b.date) - new Date(a.date);
    });
  }, [transactions, search, statusFilter, sortBy]);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Transaction Search Dashboard</h1>
        <p>Search, filter, and sort your recent transactions.</p>
      </header>

      <section className="dashboard__controls" aria-label="Transaction filters">
        <label className="control">
          <span>Search by merchant</span>
          <input
            type="search"
            placeholder="e.g. Amazon"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label className="control">
          <span>Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All statuses' : status}
              </option>
            ))}
          </select>
        </label>

        <label className="control">
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="date">Date (newest first)</option>
            <option value="amount">Amount (highest first)</option>
          </select>
        </label>
      </section>

      <section className="dashboard__content">
        {loading && (
          <div className="state state--loading" role="status">
            Loading transactions...
          </div>
        )}

        {!loading && error && (
          <div className="state state--error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="state state--empty">
            No transactions match your search or filters.
          </div>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <ul className="transaction-list">
            {filteredTransactions.map((transaction) => (
              <li key={transaction.id} className="transaction-card">
                <div>
                  <h2>{transaction.merchant}</h2>
                  <p>{formatDate(transaction.date)}</p>
                </div>
                <div className="transaction-card__meta">
                  <strong>{formatAmount(transaction.amount)}</strong>
                  <span className={`status status--${transaction.status}`}>
                    {transaction.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
