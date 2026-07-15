import type { StatusFilter, Transaction, User } from '../types'
import { EmptyState, ErrorState, LoadingState } from './UiStates'
import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'
import UserProfile from './UserProfile'

interface DashboardProps {
  user: User
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  loading: boolean
  error: string
  filter: StatusFilter
  search: string
  onFilterChange: (value: StatusFilter) => void
  onSearchChange: (value: string) => void
  onLogout: () => void
  onRetry: () => void
}

export default function Dashboard({
  user,
  transactions,
  filteredTransactions,
  loading,
  error,
  filter,
  search,
  onFilterChange,
  onSearchChange,
  onLogout,
  onRetry,
}: DashboardProps) {
  return (
    <div className="app dashboard-content">
      <div className="topbar">
        <h1>My Dashboard</h1>
        <button type="button" className="logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      {error ? <ErrorState message={error} onRetry={onRetry} /> : null}

      <UserProfile user={user} />

      <section className="card" aria-label="Transactions">
        <h2>Transactions</h2>

        <TransactionFilters
          search={search}
          filter={filter}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
        />

        {loading ? (
          <LoadingState label="Loading transactions…" />
        ) : transactions.length === 0 ? (
          <EmptyState message="No transactions yet." />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState message="No matching transactions." />
        ) : (
          <TransactionTable transactions={filteredTransactions} />
        )}
      </section>
    </div>
  )
}
