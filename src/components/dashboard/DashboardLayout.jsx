
import { useState } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopbar from './DashboardTopbar'

function DashboardLayout({ role, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="bw-dashboard">
      <DashboardSidebar
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="dashboard-main">
        <DashboardTopbar
          role={role}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="dashboard-content">
          {children}

          <footer className="dashboard-footer">
            <span>© 2026 BudgetWise. All rights reserved.</span>
            <span>Financial control made simple.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
