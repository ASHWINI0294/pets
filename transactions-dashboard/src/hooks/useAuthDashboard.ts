import { useCallback, useMemo, useState } from 'react'
import { getTransactions, getUser } from '../api/mockApi'
import type { StatusFilter, Transaction, User } from '../types'
import { filterTransactions } from '../utils/filterTransactions'

/**
 * Central state for auth + dashboard data.
 * Keeps components presentational and makes async/loading/error behavior reusable/testable.
 */
export function useAuthDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  const login = useCallback(async (email: string, password: string) => {
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
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setTransactions([])
    setError('')
    setFilter('all')
    setSearch('')
  }, [])

  const refreshTransactions = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const txns = await getTransactions(user.id)
      setTransactions(txns)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh')
    } finally {
      setLoading(false)
    }
  }, [user])

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filter, search),
    [transactions, filter, search],
  )

  return {
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
  }
}
