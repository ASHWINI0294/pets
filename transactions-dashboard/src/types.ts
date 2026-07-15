/** Shared domain types — keeps the UI and API type-safe. */

export type AccountType = 'Premium' | 'Standard'

export type TransactionStatus = 'completed' | 'pending' | 'failed'

export type StatusFilter = 'all' | TransactionStatus

export interface User {
  id: string
  name: string
  email: string
  accountType: AccountType
  balance: number
  currency: string
}

/** Internal user record that includes the password for the mock login API only. */
export interface UserCredentials extends User {
  password: string
}

export interface Transaction {
  id: string
  userId: string
  merchant: string
  amount: number
  currency: string
  status: TransactionStatus
  date: string
}
