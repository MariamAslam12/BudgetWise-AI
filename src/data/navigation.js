
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Receipt,
  CheckCircle,
  FileText,
  BarChart3,
  Settings,
  Users,
  Building2,
  User,
  CircleHelp,
  FolderKanban
} from 'lucide-react'

export const roleMenus = {
  // EMPLOYEE
  employee: [
    { label: 'My Dashboard', section: 'dashboard', icon: LayoutDashboard },
    { label: 'My Expenses', section: 'expenses', icon: Receipt },
    { label: 'Invoice Requests', section: 'invoices', icon: FileText },
    { label: 'My Requests', section: 'requests', icon: CircleHelp },
    { label: 'My Profile', section: 'profile', icon: User },
  ],

  // FINANCE MANAGER
  finance_manager: [
    { label: 'Overview', section: 'dashboard', icon: LayoutDashboard },
    { label: 'Transactions', section: 'transactions', icon: ArrowLeftRight },
    { label: 'Expenses', section: 'expenses', icon: Receipt },
    { label: 'Projects', section: 'projects', icon: FolderKanban },
    { label: 'Approvals', section: 'approvals', icon: CheckCircle },
    { label: 'Invoices', section: 'invoices', icon: FileText },
    { label: 'Budgets', section: 'budgets', icon: Wallet },
    { label: 'Reports', section: 'reports', icon: BarChart3 },
    { label: 'Settings', section: 'settings', icon: Settings },
  ],

  // COMPANY ADMINISTRATOR
  company_admin: [
    // Financial management
    { label: 'Overview', section: 'dashboard', icon: LayoutDashboard },
    { label: 'Transactions', section: 'transactions', icon: ArrowLeftRight },
    { label: 'Expenses', section: 'expenses', icon: Receipt },
    { label: 'Projects', section: 'projects', icon: FolderKanban },
    { label: 'Invoices', section: 'invoices', icon: FileText },
    { label: 'Approvals', section: 'approvals', icon: CheckCircle },
    { label: 'Budgets', section: 'budgets', icon: Wallet },
    { label: 'Reports', section: 'reports', icon: BarChart3 },

    // Company administration
    { label: 'Employees', section: 'users', icon: Users },
    { label: 'Finance Managers', section: 'managers', icon: User },
    { label: 'Company Details', section: 'company', icon: Building2 },
    { label: 'Settings', section: 'settings', icon: Settings },
  ],
}

export const roleNames = {
  employee: 'Employee',
  finance_manager: 'Finance Manager',
  company_admin: 'Company Administrator',
}
