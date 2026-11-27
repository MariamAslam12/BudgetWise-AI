
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

const records = [
  {
    id: 1,
    title: 'Office Supplies',
    employee: 'Ahmed Khan',
    department: 'Operations',
    date: 'Nov 10, 2026',
    amount: 1250,
    type: 'expense',
    status: 'Approved'
  },
  {
    id: 2,
    title: 'Client Payment',
    employee: 'Sara Ali',
    department: 'Sales',
    date: 'Nov 09, 2026',
    amount: 4800,
    type: 'income',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Software Subscription',
    employee: 'Usman Malik',
    department: 'Technology',
    date: 'Nov 08, 2026',
    amount: 350,
    type: 'expense',
    status: 'Pending'
  },
  {
    id: 4,
    title: 'Marketing Campaign',
    employee: 'Ayesha Noor',
    department: 'Marketing',
    date: 'Nov 07, 2026',
    amount: 920,
    type: 'expense',
    status: 'Approved'
  },
  {
    id: 5,
    title: 'Project Payment',
    employee: 'Sara Ali',
    department: 'Sales',
    date: 'Nov 06, 2026',
    amount: 2600,
    type: 'income',
    status: 'Completed'
  }
]

function FinancialRecords({ role }) {
  const visibleRecords = role === 'employee'
    ? records.filter(record => record.employee === 'Ahmed Khan')
    : records

  return (
    <section className="dashboard-panel transactions-panel">
      <div className="panel-heading">
        <div>
          <h3>
            {role === 'employee' ? 'My financial activity' : 'Company financial records'}
          </h3>
          <p>
            {role === 'employee'
              ? 'Your submitted financial activity'
              : 'Income and expenses across the company'}
          </p>
        </div>
      </div>

      <div className="transaction-table-wrap">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>DESCRIPTION</th>

              {role !== 'employee' && <th>EMPLOYEE</th>}

              <th>DEPARTMENT</th>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {visibleRecords.map(record => (
              <tr key={record.id}>
                <td>
                  <strong>{record.title}</strong>
                </td>

                {role !== 'employee' && (
                  <td>{record.employee}</td>
                )}

                <td>{record.department}</td>
                <td>{record.date}</td>

                <td className={record.type === 'income' ? 'income-amount' : 'expense-amount'}>
                  {record.type === 'income'
                    ? <ArrowDownLeft size={15} />
                    : <ArrowUpRight size={15} />}
                  ${record.amount.toLocaleString()}
                </td>

                <td>
                  <span className={`transaction-status ${record.status.toLowerCase()}`}>
                    {record.status}
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

export default FinancialRecords
