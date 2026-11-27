import { motion } from 'framer-motion'
import {
  BarChart3, Wallet, Building2, Receipt,
  FileText, Users, Bell, PieChart, Sparkles
} from 'lucide-react'

function DashboardPreview() {
  return (
    <motion.div
      className="dashboard-scene"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <div className="dashboard">
        <aside className="dashboard-sidebar">
          <div className="dash-brand">
            <BarChart3 size={22} /> BudgetWise
          </div>

          <div className="dash-menu active"><PieChart /> Dashboard</div>
          <div className="dash-menu"><Wallet /> Transactions</div>
          <div className="dash-menu"><BarChart3 /> Budgets</div>
          <div className="dash-menu"><Building2 /> Departments</div>
          <div className="dash-menu"><Receipt /> Expenses</div>
          <div className="dash-menu"><FileText /> Invoices</div>
          <div className="dash-menu"><Sparkles /> AI Insights</div>
          <div className="dash-menu"><Users /> Team</div>
        </aside>

        <div className="dashboard-main">
          <div className="dash-top">
            <div>
              <span className="dash-small">COMPANY OVERVIEW</span>
              <h3>Welcome back, Acme Corp!</h3>
              <p>Here's your financial overview for this month.</p>
            </div>
            <span className="dash-date">November 2026⌄</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Income</span>
              <strong>Rs. 1,250,000</strong>
              <small className="positive">↑ 12.5%</small>
            </div>

            <div className="stat-card pink">
              <span>Total Expenses</span>
              <strong>Rs. 980,000</strong>
              <small className="negative">↑ 8.2%</small>
            </div>

            <div className="stat-card green">
              <span>Recorded Balance</span>
              <strong>Rs. 270,000</strong>
              <small className="positive">↑ 5.4%</small>
            </div>
          </div>

          <div className="dash-content-grid">
            <div className="chart-card">
              <div className="chart-heading">
                <strong>Monthly Overview</strong>
                <span>● Income　● Expenses</span>
              </div>

              <div className="chart">
                <div className="chart-y">
                  <span>1.5M</span>
                  <span>1M</span>
                  <span>500K</span>
                  <span>0</span>
                </div>

                <svg viewBox="0 0 440 175" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".22" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {[25, 65, 105, 145].map(y => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="440"
                      y2={y}
                      stroke="#eee8fa"
                    />
                  ))}

                  <path
                    d="M0 100 C50 75 70 60 105 67 S175 115 220 83 S300 43 335 60 S400 35 440 25 L440 160 L0 160Z"
                    fill="url(#chartFill)"
                  />

                  <path
                    d="M0 100 C50 75 70 60 105 67 S175 115 220 83 S300 43 335 60 S400 35 440 25"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                  />

                  <path
                    d="M0 110 C60 105 75 95 105 100 S175 85 220 105 S290 115 335 90 S400 105 440 85"
                    fill="none"
                    stroke="#c4b5fd"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              <div className="chart-months">
                <span>Jan</span><span>Feb</span><span>Mar</span>
                <span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>

            <div className="quick-card">
              <strong>Quick Actions</strong>
              <div><Wallet /> Add Transaction</div>
              <div><BarChart3 /> Create Budget</div>
              <div><Receipt /> Submit Expense</div>
              <div><FileText /> View Reports</div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="alert-float"
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Bell size={19} />
        <div>
          <strong>Budget Alert</strong>
          <p>Marketing budget is at 90%</p>
          <small>Review spending →</small>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPreview