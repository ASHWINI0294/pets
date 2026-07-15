import type { Transaction } from '../types'
import { formatAmount, formatDate } from '../utils/format'
import StatusBadge from './StatusBadge'

interface TransactionTableProps {
  transactions: Transaction[]
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="table-wrapper">
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
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.merchant}</td>
              <td>{formatAmount(txn.amount, txn.currency)}</td>
              <td>
                <StatusBadge status={txn.status} />
              </td>
              <td>{formatDate(txn.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
