
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const chartData = [
  { month: 'Jan', expenses: 12000, income: 22000 },
  { month: 'Feb', expenses: 16000, income: 26000 },
  { month: 'Mar', expenses: 13500, income: 24000 },
  { month: 'Apr', expenses: 19000, income: 31000 },
  { month: 'May', expenses: 17000, income: 29000 },
  { month: 'Jun', expenses: 23000, income: 35000 },
  { month: 'Jul', expenses: 18500, income: 33000 },
  { month: 'Aug', expenses: 25000, income: 38000 },
  { month: 'Sep', expenses: 21000, income: 36000 },
  { month: 'Oct', expenses: 28000, income: 42000 },
  { month: 'Nov', expenses: 24000, income: 39000 },
  { month: 'Dec', expenses: 31000, income: 46000 },
]

function ExpenseChart() {
  return (
    <section className="dashboard-panel chart-panel" id="expense-chart">
      <div className="panel-heading">
        <div>
          <h3>Financial overview</h3>
          <p>Income and expenses throughout the year</p>
        </div>

        <select defaultValue="2026" aria-label="Select year">
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="chart-legend">
        <span><i className="legend-income"></i> Income</span>
        <span><i className="legend-expense"></i> Expenses</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#eeeaf4" strokeDasharray="4 4" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9992A7', fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9992A7', fontSize: 11 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => `$${Number(value).toLocaleString()}`}
              contentStyle={{
                border: '1px solid #eeeaf4',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(30,20,50,.08)'
              }}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#8B5CF6"
              strokeWidth={3}
              fill="url(#incomeGradient)"
            />

            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#F59E0B"
              strokeWidth={3}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default ExpenseChart
