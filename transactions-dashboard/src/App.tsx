import AuroraBackground from './components/AuroraBackground'
import Dashboard from './components/Dashboard'
import LoginForm from './components/LoginForm'
import { useAuthDashboard } from './hooks/useAuthDashboard'
import './App.css'

export default function App() {
  const {
    user,
    transactions,
    filteredTransactions,
    loading,
    error,
    filter,
    search,
    setFilter,
    setSearch,
    login,
    logout,
    refreshTransactions,
  } = useAuthDashboard()

  if (!user) {
    return (
      <div className="login-page">
        <AuroraBackground />
        <div className="login-content">
          <h1>FinTrackr</h1>
          <LoginForm loading={loading} error={error} onSubmit={login} />
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <AuroraBackground />
      <Dashboard
        user={user}
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        loading={loading}
        error={error}
        filter={filter}
        search={search}
        onFilterChange={setFilter}
        onSearchChange={setSearch}
        onLogout={logout}
        onRetry={refreshTransactions}
      />
    </div>
  )
}
