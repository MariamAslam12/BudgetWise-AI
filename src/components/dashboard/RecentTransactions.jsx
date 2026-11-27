
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

const transactions = [
  {
    name: 'Office Supplies',
    category: 'Operations',
    date: 'Nov 10, 2026',
    amount: '$1,250',
    status: 'Approved',
    type: 'expense',
    initials: 'OS'
  },
  {
    name: 'Client Payment',
    category: 'Revenue',
    date: 'Nov 09, 2026',
    amount: '$4,800',
    status: 'Completed',
    type: 'income',
    initials: 'CP'
  },
  {
    name: 'Software Subscription',
    category: 'Technology',
    date: 'Nov 08, 2026',
    amount: '$350',
    status: 'Pending',
    type: 'expense',
    initials: 'SS'
  },
  {
    name: 'Marketing Campaign',
    category: 'Marketing',
    date: 'Nov 07, 2026',
    amount: '$920',
    status: 'Approved',
    type: 'expense',
    initials: 'MC'
  },
  {
    name: 'Project Payment',
    category: 'Revenue',
    date: 'Nov 06, 2026',
    amount: '$2,600',
    status: 'Completed',
    type: 'income',
    initials: 'PP'
  }
]

function RecentTransactions() {
  return (
    <section className="dashboard-panel transactions-panel" id="transactions">
      <div className="panel-heading">
        <div>
          <h3>Recent transactions</h3>
          <p>Latest financial activity in your company</p>
        </div>

        <button className="view-all-button">View all</button>
      </div>

      <div className="transaction-table-wrap">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>TRANSACTION</th>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.name}>
                <td>
                  <div className="transaction-name">
                    <div className={`transaction-avatar ${transaction.type}`}>
                      {transaction.initials}
                    </div>

                    <div>
                      <strong>{transaction.name}</strong>
                      <small>{transaction.category}</small>
                    </div>
                  </div>
                </td>

                <td className="transaction-date">{transaction.date}</td>

                <td className={transaction.type === 'income' ? 'income-amount' : 'expense-amount'}>
                  {transaction.type === 'income'
                    ? <ArrowDownLeft size={15} />
                    : <ArrowUpRight size={15} />}
                  {transaction.amount}
                </td>

                <td>
                  <span className={`transaction-status ${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RecentTransactions
