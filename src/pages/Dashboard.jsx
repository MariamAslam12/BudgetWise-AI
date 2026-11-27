
import { useLocation, Link } from 'react-router-dom'
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Clock,
  Users,
  FileText,
  Receipt,
  CheckCircle,
  Building2,
  ShieldCheck
} from 'lucide-react'
import Projects from '../../components/dashboard/Projects'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import StatCard from '../../components/dashboard/StatCard'
import FinancialRecords from '../../components/dashboard/FinancialRecords'

import './Dashboard.css'

const roleInfo = {
  employee: {
    title: 'Welcome back, Ahmed',
    description: 'Here is an overview of your personal requests and expenses.'
  },
  finance_manager: {
    title: 'Welcome back, Finance Manager',
    description: 'Here is your company financial overview.'
  },
  company_admin: {
    title: 'Welcome back, Administrator',
    description: 'Monitor company finances and manage your organization.'
  }
}

const pageNames = {
  transactions: 'Transactions',
  expenses: 'Expenses',
  invoices: 'Invoices',
  projects: 'Projects',
  approvals: 'Approvals',
  budgets: 'Budgets',
  vendors: 'Vendors',
  reports: 'Financial Reports',
  employees: 'Employees',
  'finance-managers': 'Finance Managers',
  departments: 'Departments',
  permissions: 'Roles & Permissions',
  'audit-logs': 'Audit Logs',
  'company-settings': 'Company Settings',
  profile: 'My Profile',
  settings: 'Settings',
  'my-expenses': 'My Expenses',
  'invoice-request': 'Request an Invoice',
  requests: 'My Requests',
  'my-invoices': 'My Invoices'
}

function Dashboard({ role }) {
  const location = useLocation()
  const currentPage = location.pathname.split('/').filter(Boolean).pop()
  const isOverview = currentPage === 'dashboard'
  const isEmployee = role === 'employee'
  const isAdmin = role === 'company_admin'

  const titles = roleInfo[role] || roleInfo.employee

  const cards = isEmployee
    ? [
        { title: 'My expenses', amount: '$1,250', change: '2 submitted', icon: Receipt, color: 'purple', positive: true },
        { title: 'Approved expenses', amount: '$850', change: '1 approved', icon: CheckCircle, color: 'green', positive: true },
        { title: 'Pending requests', amount: '3', change: 'Awaiting review', icon: Clock, color: 'orange', positive: false },
        { title: 'My invoices', amount: '4', change: '1 pending', icon: FileText, color: 'blue', positive: true }
      ]
    : [
        { title: 'Total balance', amount: '$84,250', change: '12.8%', icon: Wallet, color: 'purple', positive: true },
        { title: 'Total income', amount: '$56,400', change: '8.4%', icon: TrendingUp, color: 'green', positive: true },
        { title: 'Total expenses', amount: '$24,680', change: '4.2%', icon: CreditCard, color: 'orange', positive: false },
        { title: 'Pending approvals', amount: '18', change: '3 new', icon: Clock, color: 'blue', positive: false }
      ]

  const adminCards = [
    { title: 'Total employees', amount: '48', icon: Users, color: 'purple' },
    { title: 'Finance managers', amount: '3', icon: ShieldCheck, color: 'green' },
    { title: 'Departments', amount: '6', icon: Building2, color: 'blue' },
    { title: 'Pending approvals', amount: '18', icon: Clock, color: 'orange' }
  ]

  const pageTitle = pageNames[currentPage]

  return (
    <DashboardLayout role={role}>
      {isOverview ? (
        <>
          <div className="dashboard-welcome">
            <div>
              <span className="welcome-label">
                {isEmployee ? 'EMPLOYEE WORKSPACE' : 'COMPANY OVERVIEW'}
              </span>
              <h1>{titles.title}</h1>
              <p>{titles.description}</p>
            </div>

            <div className="welcome-date">
              <span>REPORTING PERIOD</span>
              <strong>November 2026</strong>
            </div>
          </div>

          <section className="stats-grid">
            {cards.map(card => (
              <StatCard key={card.title} {...card} />
            ))}
          </section>

          {isAdmin && (
            <>
              <h2 className="dashboard-section-title">Company administration</h2>

              <section className="stats-grid">
                {adminCards.map(card => (
                  <StatCard
                    key={card.title}
                    {...card}
                    change="Current total"
                    positive
                  />
                ))}
              </section>
            </>
          )}

          <FinancialRecords role={role} />

          {!isEmployee && (
            <div className="dashboard-panel admin-finance-note">
              <h3>Company-wide financial visibility</h3>
              <p>
                {isAdmin
                  ? 'You have access to company financial records, reports, budgets, invoices and administration tools.'
                  : 'You have access to company financial records and daily finance management tools.'}
              </p>
            </div>
          )}

          {isEmployee && (
            <div className="dashboard-panel">
              <h3>Quick actions</h3>
              <div className="quick-actions">
                <Link to={`/${role}/expenses`}>Submit an expense</Link>
                <Link to={`/${role}/invoice-request`}>Request an invoice</Link>
                <Link to={`/${role}/requests`}>Track my requests</Link>
              </div>
            </div>
          )}
        </>
      ) : (
        <section className="dashboard-page-content">
          <div className="dashboard-welcome">
            <div>
              <span className="welcome-label">BUDGETWISE WORKSPACE</span>
              <h1>{pageTitle || 'Dashboard'}</h1>
              <p>Manage and review your {pageTitle?.toLowerCase() || 'workspace'}.</p>
            </div>
          </div>

          {currentPage === 'projects' && !isEmployee && (
            <Projects />
          )}

          {[
             'transactions',
             'expenses',
             'invoices',
             'approvals',
             'budgets',
             'vendors',
             'reports'
           ].includes(currentPage) && (
             <FinancialRecords role={role} />
         )}

          {[
            'employees',
            'finance-managers',
            'departments',
            'permissions',
            'audit-logs',
            'company-settings'
          ].includes(currentPage) && isAdmin && (
            <div className="dashboard-panel">
              <h3>{pageTitle}</h3>
              <p>
                This administration section is ready for its dedicated
                management interface. The company administrator has access
                to this section.
              </p>
            </div>
          )}

          {[
            'my-expenses',
            'invoice-request',
            'requests',
            'my-invoices',
            'profile',
            'settings'
          ].includes(currentPage) && (
            <div className="dashboard-panel">
              <h3>{pageTitle}</h3>
              <p>
                This section will contain the forms and records for your
                account. We will build its working features next.
              </p>
            </div>
          )}
        </section>
      )}
    </DashboardLayout>
  )
}

export default Dashboard
