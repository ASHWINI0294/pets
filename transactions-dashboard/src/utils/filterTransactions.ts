import type { StatusFilter, Transaction } from '../types'

export function filterTransactions(
  transactions: Transaction[],
  statusFilter: StatusFilter,
  searchTerm: string,
): Transaction[] {
  const term = searchTerm.trim().toLowerCase()

  return transactions.filter((txn) => {
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter
    const matchesSearch = !term || txn.merchant.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })
}
