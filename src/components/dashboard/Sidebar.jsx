
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Receipt,
  CheckCircle,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Users,
  Building2,
  ShieldCheck,
  ClipboardList,
  CircleHelp,
  X,
  FolderKanban
} from 'lucide-react'

const menus = {
  employee: [
    {
      title: 'MY WORKSPACE',
      items: [
        { name: 'Overview', icon: LayoutDashboard, path: 'dashboard' },
        { name: 'Submit Expense', icon: Receipt, path: 'expenses' },
        { name: 'My Expenses', icon: Wallet, path: 'my-expenses' },
        { name: 'Request Invoice', icon: FileText, path: 'invoice-request' },
        { name: 'My Requests', icon: ClipboardList, path: 'requests' },
        { name: 'My Invoices', icon: FileText, path: 'my-invoices' },
      ]
    },
    {
      title: 'PREFERENCES',
      items: [
        { name: 'My Profile', icon: Users, path: 'profile' },
        { name: 'Settings', icon: Settings, path: 'settings' },
      ]
    }
  ],

  finance_manager: [
    {
      title: 'FINANCIAL WORKSPACE',
      items: [
        { name: 'Overview', icon: LayoutDashboard, path: 'dashboard' },
        { name: 'Transactions', icon: ArrowLeftRight, path: 'transactions' },
        { name: 'Expenses', icon: Receipt, path: 'expenses' },
        { name: 'Invoices', icon: FileText, path: 'invoices' },
        { name: 'Projects', icon: FolderKanban, path: 'projects' },
        { name: 'Approvals', icon: CheckCircle, path: 'approvals' },
        { name: 'Budgets', icon: Wallet, path: 'budgets' },
        { name: 'Vendors', icon: Building2, path: 'vendors' },
        { name: 'Reports', icon: BarChart3, path: 'reports' },
      ]
    },
    {
      title: 'PREFERENCES',
      items: [
        { name: 'Profile', icon: Users, path: 'profile' },
        { name: 'Settings', icon: Settings, path: 'settings' },
      ]
    }
  ],

  company_admin: [
    {
      title: 'FINANCIAL WORKSPACE',
      items: [
        { name: 'Overview', icon: LayoutDashboard, path: 'dashboard' },
        { name: 'Transactions', icon: ArrowLeftRight, path: 'transactions' },
        { name: 'Expenses', icon: Receipt, path: 'expenses' },
        { name: 'Invoices', icon: FileText, path: 'invoices' },
        { name: 'Projects', icon: FolderKanban, path: 'projects' },
        { name: 'Approvals', icon: CheckCircle, path: 'approvals' },
        { name: 'Budgets', icon: Wallet, path: 'budgets' },
        { name: 'Vendors', icon: Building2, path: 'vendors' },
        { name: 'Reports', icon: BarChart3, path: 'reports' },
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { name: 'Employees', icon: Users, path: 'employees' },
        { name: 'Finance Managers', icon: ShieldCheck, path: 'finance-managers' },
        { name: 'Departments', icon: Building2, path: 'departments' },
        { name: 'Roles & Permissions', icon: ShieldCheck, path: 'permissions' },
        { name: 'Audit Logs', icon: ClipboardList, path: 'audit-logs' },
      ]
    },
    {
      title: 'PREFERENCES',
      items: [
        { name: 'Company Settings', icon: Settings, path: 'company-settings' },
        { name: 'My Profile', icon: Users, path: 'profile' },
      ]
    }
  ]
}

const roleLabels = {
  employee: 'Employee',
  finance_manager: 'Finance Manager',
  company_admin: 'Company Administrator'
}

function Sidebar({ role, open, onClose }) {
  const location = useLocation()
  const roleMenus = menus[role] || menus.employee

  const basePath = `/${role === 'employee' ? 'employee' :
    role === 'finance_manager' ? 'finance' : 'admin'}`

  return (
    <>
      {open && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`dashboard-sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <BarChart3 size={23} />
          </div>

          <span>Budget<span>Wise</span></span>

          <button className="sidebar-close" onClick={onClose}>
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-company">
          <div className="company-avatar">AC</div>
          <div className="company-details">
            <strong>Acme Corporation</strong>
            <small>Business workspace</small>
          </div>
        </div>

        {roleMenus.map((section) => (
          <div className="sidebar-group" key={section.title}>
            <div className="sidebar-section-label">
              {section.title}
            </div>

            <nav className="sidebar-menu">
              {section.items.map((item) => {
                const Icon = item.icon
                const target = `${basePath}/${item.path}`
                const isActive = location.pathname === target

                return (
                  <Link
                    key={item.name}
                    to={target}
                    onClick={onClose}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>

                    {item.name === 'Approvals' && (
                      <span className="sidebar-count">5</span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">MA</div>
            <div>
              <strong>Admin User</strong>
              <small>{roleLabels[role]}</small>
            </div>
          </div>

          <Link to="/" className="sidebar-link logout-link">
            <LogOut size={18} />
            <span>Back to website</span>
          </Link>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
