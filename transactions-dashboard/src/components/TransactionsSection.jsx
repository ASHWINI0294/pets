import { useCallback, useMemo, useState } from 'react'
import { getTransactions } from '../api/mockApi'
import { useAsync } from '../hooks/useAsync'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'
import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'

function filterTransactions(transactions, { statusFilter, searchTerm }) {
  const term = searchTerm.trim().toLowerCase()

  return transactions.filter((txn) => {
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter
    const matchesSearch = !term || txn.merchant.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })
}

export default function TransactionsSection() {
  const fetcher = useCallback(() => getTransactions(), [])
  const { status, data: transactions, error, retry } = useAsync(fetcher)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTransactions = useMemo(() => {
    if (!transactions) return []
    return filterTransactions(transactions, { statusFilter, searchTerm })
  }, [transactions, statusFilter, searchTerm])

  return (
    <section className="card transactions-card" aria-label="Transactions">
      <div className="section-header">
        <h2>Transactions</h2>
      </div>

      {status === 'success' && transactions.length > 0 && (
        <TransactionFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      )}

      {status === 'loading' && <LoadingState label="Loading transactions…" />}
      {status === 'error' && <ErrorState message={error} onRetry={retry} />}

      {status === 'success' && transactions.length === 0 && (
        <EmptyState message="You don't have any transactions yet." />
      )}

      {status === 'success' && transactions.length > 0 && filteredTransactions.length === 0 && (
        <EmptyState message="No transactions match your search or filter." />
      )}

      {status === 'success' && filteredTransactions.length > 0 && (
        <TransactionTable transactions={filteredTransactions} />
      )}
    </section>
  )
}
