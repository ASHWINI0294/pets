import StatusBadge from './StatusBadge'
import { formatCurrency, formatDate } from '../utils/format'

export default function TransactionTable({ transactions }) {
  return (
    <div className="table-wrapper">
      <table className="transaction-table">
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
              <td className="cell-merchant">{txn.merchant}</td>
              <td className="cell-amount">{formatCurrency(txn.amount, txn.currency)}</td>
              <td>
                <StatusBadge status={txn.status} />
              </td>
              <td className="cell-date">{formatDate(txn.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
