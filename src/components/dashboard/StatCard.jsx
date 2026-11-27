
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

function StatCard({ title, amount, change, icon: Icon, color, positive }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>
        <div className={`stat-icon ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <h3>{amount}</h3>

      <div className="stat-card-bottom">
        <span className={positive ? 'stat-positive' : 'stat-negative'}>
          {positive
            ? <ArrowUpRight size={15} />
            : <ArrowDownRight size={15} />}
          {change}
        </span>
        <span>compared with last month</span>
      </div>
    </div>
  )
}

export default StatCard
