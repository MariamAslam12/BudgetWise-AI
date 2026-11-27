import * as XLSX from 'xlsx-js-style'
import jsPDF from 'jspdf'
import { FolderKanban } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiRequest } from '../services/api'

import {
  Wallet,
  TrendingUp,
  Receipt,
  Clock,
  Plus,
  FileText,
  Users,
  CheckCircle,
  X,
  Trash2,
  Pencil,
  UserX,
} from 'lucide-react'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

// PAGE INFORMATION
const pageInfo = {
  dashboard: ['Dashboard', 'Your workspace overview and latest activity.'],
  projects: ['Projects', 'Track project budgets, client revenue, expenses and profitability.'],
  expenses: ['Expenses', 'Manage expense claims and spending records.'],
  invoices: ['Invoices', 'Manage invoice requests and company invoices.'],
  requests: ['My Requests', 'Track the status of your submitted requests.'],
  profile: ['My Profile', 'View and update your personal information.'],
  transactions: ['Transactions', 'Review your company financial transactions.'],
  approvals: ['Approvals', 'Review and manage pending employee requests.'],
  budgets: ['Budgets', 'Set and manage your company monthly budgets.'],
  reports: ['Reports', 'Review company financial performance.'],
  settings: ['Settings', 'Manage your workspace preferences.'],
  users: ['Employees', 'Manage employee accounts and access.'],
  managers: ['Finance Managers', 'Manage finance manager accounts.'],
  company: ['Company Details', 'Manage your company information.'],
}

// ROLE PERMISSIONS
const roleAccess = {
  employee: ['dashboard', 'expenses', 'invoices', 'requests', 'profile'],
  finance_manager: [
    'dashboard', 'transactions', 'expenses', 'projects', 'approvals',
    'invoices', 'budgets', 'reports', 'settings', 'profile',
  ],
  company_admin: [
    'dashboard', 'transactions', 'expenses', 'projects', 'approvals',
    'invoices', 'budgets', 'reports', 'settings',
    'users', 'managers', 'company', 'profile',
  ],
}

// DEMO DATA — replace with database data as those modules are connected
const sampleRows = {
  requests: [],
  transactions: [
    ['Client payment', 'Income', '$4,800', 'Completed'],
    ['Office supplies', 'Expense', '$250', 'Approved'],
    ['Software subscription', 'Expense', '$350', 'Pending'],
  ],
  approvals: [],
  users: [],
  managers: [],
}

const monthlyFinancialData = [
  { month: 'Jan', revenue: 12000, expenses: 6500, budget: 8000 },
  { month: 'Feb', revenue: 14500, expenses: 7200, budget: 8500 },
  { month: 'Mar', revenue: 13500, expenses: 6800, budget: 8500 },
  { month: 'Apr', revenue: 17000, expenses: 9000, budget: 10000 },
  { month: 'May', revenue: 15500, expenses: 7500, budget: 9000 },
  { month: 'Jun', revenue: 19000, expenses: 10500, budget: 11000 },
  { month: 'Jul', revenue: 21000, expenses: 11500, budget: 12000 },
  { month: 'Aug', revenue: 18500, expenses: 9800, budget: 11000 },
  { month: 'Sep', revenue: 22500, expenses: 12000, budget: 13000 },
  { month: 'Oct', revenue: 24000, expenses: 13500, budget: 14000 },
  { month: 'Nov', revenue: 26000, expenses: 14500, budget: 15000 },
  { month: 'Dec', revenue: 29000, expenses: 16000, budget: 17000 },
]

const yearlyFinancialData = [
  { year: '2022', revenue: 95000, expenses: 52000 },
  { year: '2023', revenue: 125000, expenses: 68000 },
  { year: '2024', revenue: 160000, expenses: 85000 },
  { year: '2025', revenue: 210000, expenses: 112000 },
  { year: '2026', revenue: 245000, expenses: 128000 },
]

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className="workspace-stat">
      <div>
        <span>{title}</span>
        <h2>{value}</h2>
      </div>
      <div className={`workspace-stat-icon ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  )
}

function DataTable({
  rows = [],
  columns = [],
  employeeRecords = [],
  onEditEmployee,
  onToggleEmployee
}) {
  const showActions = Boolean(onEditEmployee && onToggleEmployee)

  return (
    <div className="workspace-table-wrap">
      <table className="workspace-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            {showActions && <th>ACTIONS</th>}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (showActions ? 1 : 0)}>
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const cells = Array.isArray(row)
                ? row
                : [
                    row.name,
                    row.role,
                    row.email,
                    row.department,
                    row.status
                  ]

              const employee = employeeRecords[index]

              return (
                <tr key={employee?._id || index}>
                  {cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {cellIndex === cells.length - 1 ? (
                        <span className={`workspace-status ${String(cell).toLowerCase()}`}>
                          {cell}
                        </span>
                      ) : cell}
                    </td>
                  ))}

                 {showActions && (
  <td>
    <div className="employee-row-actions">
      <button
        type="button"
        className="employee-edit-btn"
        onClick={() => employee && onEditEmployee(employee)}
        disabled={!employee}
        title="Edit employee"
      >
        <Pencil size={17} />
      </button>

      <button
        type="button"
        className="employee-remove-btn"
        onClick={() => employee && onToggleEmployee(employee)}
        disabled={!employee}
        title={employee?.active === false ? 'Reactivate employee' : 'Remove employee'}
      >
        {employee?.active === false
          ? <UserCheck size={17} />
          : <UserX size={17} />}
      </button>
    </div>
  </td>
)}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

function FinancialCharts({
  monthlyData = [],
  yearlyData = [],
  departmentData = []
}) {
  const moneyFormat = (value) =>
    `Rs. ${Number(value || 0).toLocaleString('en-PK')}`

  const axisFormat = (value) =>
    Number(value) >= 100000
      ? `Rs. ${(Number(value) / 100000).toFixed(1)}L`
      : `Rs. ${(Number(value) / 1000).toFixed(0)}k`

  return (
    <div className="workspace-charts">

      {/* MONTHLY PERFORMANCE */}
      <div className="workspace-panel workspace-chart-panel">
        <div className="workspace-panel-heading">
          <div>
            <h3>Monthly Financial Performance</h3>
            <p>Actual income and expenses by month.</p>
          </div>
        </div>

        <div className="workspace-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={axisFormat} />
              <Tooltip formatter={moneyFormat} />
              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                name="Income"
                stroke="#16a34a"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#f97316"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* YEARLY PERFORMANCE */}
      <div className="workspace-panel workspace-chart-panel">
        <div className="workspace-panel-heading">
          <div>
            <h3>Yearly Revenue & Expenses</h3>
            <p>Actual financial performance across years.</p>
          </div>
        </div>

        <div className="workspace-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={axisFormat} />
              <Tooltip formatter={moneyFormat} />
              <Legend />

              <Bar
                dataKey="revenue"
                name="Income"
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#f97316"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DEPARTMENT SPENDING */}
      <div className="workspace-panel workspace-chart-panel">
        <div className="workspace-panel-heading">
          <div>
            <h3>Department Budget Comparison</h3>
            <p>Allocated budgets vs. actual spending.</p>
          </div>
        </div>

        <div className="workspace-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="department" />
              <YAxis tickFormatter={axisFormat} />
              <Tooltip formatter={moneyFormat} />
              <Legend />

              <Bar
                dataKey="budget"
                name="Allocated Budget"
                fill="#8b5cf6"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="spent"
                name="Actual Spending"
                fill="#f97316"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

// EMPLOYEE EXPENSE / INVOICE REQUEST FORM
function RequestForm({ section }) {
  const isExpense = section === 'expenses'
  const type = isExpense ? 'expense' : 'invoice'

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(
    isExpense ? 'travel' : 'invoice_generation'
  )
  const [invoiceType, setInvoiceType] = useState('vendor')
  const [vendorName, setVendorName] = useState('')
  const [clientName, setClientName] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [priority, setPriority] = useState('medium')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const categoryOptions = isExpense
    ? [
        { value: 'travel', label: 'Travel' },
        { value: 'fuel', label: 'Fuel' },
        { value: 'office_supplies', label: 'Office Supplies' },
        { value: 'business_meal', label: 'Business Meal' },
        { value: 'internet', label: 'Internet' },
      ]
    : [
        { value: 'invoice_generation', label: 'Invoice Generation' },
      ]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!title.trim()) {
      setError('Please enter a request title.')
      return
    }

    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }

    if (!description.trim()) {
      setError('Please enter a description.')
      return
    }

    if (!isExpense && invoiceType === 'vendor' && !vendorName.trim()) {
      setError('Please enter the vendor name.')
      return
    }

    if (!isExpense && invoiceType === 'client' && !clientName.trim()) {
      setError('Please enter the client name.')
      return
    }

    try {
      setSaving(true)

      const requestPayload = {
        type,
        title: title.trim(),
        category,
        description: description.trim(),
        amount: Number(amount),
        priority,
      }

      // Add invoice-specific information only for invoice requests
      if (!isExpense) {
        requestPayload.invoiceType = invoiceType

        if (invoiceType === 'vendor') {
          requestPayload.vendorName = vendorName.trim()
        } else {
          requestPayload.clientName = clientName.trim()
        }
      }

      const data = await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify(requestPayload),
      })

      setSuccess(data.message || 'Your request was submitted successfully.')
      setTitle('')
      setDescription('')
      setAmount('')
      setPriority('medium')
      setCategory(categoryOptions[0].value)
      setInvoiceType('vendor')
      setVendorName('')
      setClientName('')
    } catch (err) {
      setError(err.message || 'Failed to submit your request.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="workspace-request-section">
      <div className="workspace-panel">
        <h3>{isExpense ? 'Submit Expense Request' : 'Request an Invoice'}</h3>

        <p>
          {isExpense
            ? 'Submit your expense for Finance Manager review.'
            : 'Request a vendor or client invoice from your finance team.'}
        </p>

        <form className="workspace-form" onSubmit={handleSubmit}>
          <label>
            Request title
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={
                isExpense
                  ? 'e.g. Office travel expense'
                  : 'e.g. Invoice for project services'
              }
            />
          </label>

          {/* Invoice type — only shown for invoice requests */}
          {!isExpense && (
            <>
              <label>
                Invoice type
                <select
                  value={invoiceType}
                  onChange={(event) => {
                    setInvoiceType(event.target.value)
                    setVendorName('')
                    setClientName('')
                  }}
                  required
                >
                  <option value="vendor">Vendor Invoice (Company pays)</option>
                  <option value="client">Client Invoice (Company receives)</option>
                </select>
              </label>

              {invoiceType === 'vendor' && (
                <label>
                  Vendor / Supplier Name
                  <input
                    required
                    value={vendorName}
                    onChange={(event) => setVendorName(event.target.value)}
                    placeholder="Enter vendor or supplier name"
                  />
                </label>
              )}

              {invoiceType === 'client' && (
                <label>
                  Client Name
                  <input
                    required
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder="Enter client name"
                  />
                </label>
              )}
            </>
          )}

          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              {categoryOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            {isExpense ? 'Expense amount' : 'Invoice amount'}
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
            />
          </label>

          <label>
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label>
            Description
            <textarea
              rows="4"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain your request in detail..."
            />
          </label>

          {error && <p className="workspace-error">{error}</p>}
          {success && <p className="workspace-success">{success}</p>}

          <button
            type="submit"
            className="workspace-primary-button"
            disabled={saving}
          >
            <Plus size={17} />
            {saving ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

// EMPLOYEE REQUEST TRACKING — NO SUBMISSION FORM HERE
function MyRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRequests = async () => {
    try {
      setError('')
      const data = await apiRequest('/requests')
      setRequests(data.requests || [])
    } catch (err) {
      setError(err.message || 'Unable to load your requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const formatStatus = (value) =>
    value?.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || '—'
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '—'

  return (
    <div className="workspace-panel">
      <div className="workspace-panel-heading">
        <div>
          <h3>My Submitted Requests</h3>
          <p>Track your submitted requests and their latest status.</p>
        </div>
        <button type="button" onClick={() => { setLoading(true); fetchRequests() }}>
          Refresh
        </button>
      </div>

      {error && <p className="workspace-error">{error}</p>}
      {loading ? (
        <p>Loading your requests...</p>
      ) : requests.length === 0 ? (
        <p>You haven't submitted any requests yet.</p>
      ) : (
        <div className="workspace-table-wrap">
          <table className="workspace-table">
            <thead>
              <tr>
                <th>TITLE</th><th>TYPE</th><th>CATEGORY</th>
                <th>AMOUNT</th><th>DATE</th><th>PRIORITY</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td><strong>{request.title}</strong></td>
                  <td>{formatStatus(request.type)}</td>
                  <td>{formatStatus(request.category)}</td>
                  <td>{request.amount > 0 ? `Rs. ${Number(request.amount).toLocaleString()}` : '—'}</td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>{formatStatus(request.priority)}</td>
                  <td>
                    <span className={`workspace-status ${request.status}`}>
                      {formatStatus(request.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
// FINANCE MANAGER AND COMPANY ADMIN APPROVALS
function ApprovalsTable({ role }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isAdmin = role === 'company_admin'

  const fetchRequests = async () => {
    try {
      setError('')
      const data = await apiRequest('/requests')
      setRequests(data.requests || [])
    } catch (err) {
      setError(err.message || 'Unable to load requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [role])

  const updateRequestStatus = async (id, status) => {
    try {
      setUpdatingId(id)
      setError('')
      setSuccess('')

      const data = await apiRequest(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })

      if (data.request) {
        setRequests((previous) =>
          previous.map((item) =>
            item._id === id ? data.request : item
          )
        )
      } else {
        await fetchRequests()
      }

      setSuccess(`Request ${status.replace(/_/g, ' ')} successfully.`)
    } catch (err) {
      setError(err.message || 'Unable to update request.')
    } finally {
      setUpdatingId('')
    }
  }
const deleteRequest = async (id) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this request? This action cannot be undone.'
  )

  if (!confirmed) return

  try {
    setUpdatingId(id)
    setError('')
    setSuccess('')

    const data = await apiRequest(`/requests/${id}`, {
      method: 'DELETE',
    })

    setRequests((previous) =>
      previous.filter((item) => item._id !== id)
    )

    setSuccess(data.message || 'Request deleted successfully.')
  } catch (err) {
    setError(err.message || 'Unable to delete request.')
  } finally {
    setUpdatingId('')
  }
}

  const formatText = (value) =>
    value?.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || '—'

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : '—'

  const formatAmount = (amount) =>
    Number(amount) > 0
      ? `Rs. ${Number(amount).toLocaleString()}`
      : '—'

  return (
    <div className="workspace-panel">
      <div className="workspace-panel-heading">
        <div>
          <h3>
            {isAdmin ? 'Company Requests' : 'Employee Financial Requests'}
          </h3>
          <p>
            {isAdmin
              ? 'Review and monitor all requests submitted by your employees.'
              : 'Review expense and invoice requests submitted by employees.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true)
            fetchRequests()
          }}
          disabled={loading || updatingId !== ''}
        >
          Refresh
        </button>
      </div>

      {error && <p className="workspace-error">{error}</p>}
      {success && <p className="workspace-success">{success}</p>}

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No employee requests have been submitted yet.</p>
      ) : (
        <div className="workspace-table-wrap">
          <table className="workspace-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>DEPARTMENT</th>
                <th>REQUEST</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>PRIORITY</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => {
                const isFinancial = ['expense', 'invoice'].includes(request.type)
                const isPending = request.status === 'pending'
                const isWorkplace = !isFinancial

                return (
                  <tr key={request._id}>
                    <td>
                      <strong>{request.createdBy?.name || 'Employee'}</strong>
                      {request.createdBy?.email && (
                        <p>{request.createdBy.email}</p>
                      )}
                    </td>
                    <td>
                      {request.department || request.createdBy?.department || 'Not assigned'}
                    </td>

                    <td>
                      <strong>{request.title}</strong>
                      {request.description && <p>{request.description}</p>}
                    </td>

                    <td>{formatText(request.type)}</td>
                    <td>{formatAmount(request.amount)}</td>
                    <td>{formatText(request.priority)}</td>
                    <td>{formatDate(request.createdAt)}</td>

                    <td>
                      <span className={`workspace-status ${request.status}`}>
                        {formatText(request.status)}
                      </span>
                    </td>

                    <td>
                    <div className="workspace-request-actions">

                      {/* FINANCIAL REQUESTS: APPROVE / REJECT */}
                      {isFinancial && isPending && (
                        <>
                          <button
                            type="button"
                            disabled={updatingId === request._id}
                            onClick={() =>
                              updateRequestStatus(request._id, 'approved')
                            }
                            className="workspace-approve-button"
                          >
                            {updatingId === request._id ? 'Saving...' : 'Approve'}
                          </button>

                          <button
                            type="button"
                            disabled={updatingId === request._id}
                            onClick={() =>
                              updateRequestStatus(request._id, 'rejected')
                            }
                            className="workspace-reject-button"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* COMPANY ADMIN: WORKPLACE REQUEST STATUS */}
                      {isAdmin && isWorkplace && (
                        <select
                          value={request.status}
                          disabled={updatingId === request._id}
                          onChange={(event) =>
                            updateRequestStatus(request._id, event.target.value)
                          }
                          aria-label={`Update status for ${request.title}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      )}

                      {/* DELETE: ONLY NON-APPROVED / NON-RESOLVED REQUESTS */}
                      {request.status !== 'approved' &&
                        request.status !== 'resolved' &&
                        (isAdmin || (role === 'finance_manager' && isFinancial)) && (
                          <button
                            type="button"
                            title="Delete request"
                            aria-label={`Delete request: ${request.title}`}
                            disabled={updatingId === request._id}
                            onClick={() => deleteRequest(request._id)}
                            className="workspace-delete-button"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                    </div>
                  </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// PROFILE — LOADS AND SAVES THE LOGGED-IN USER
function ProfileForm() {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      try {
        const data = await apiRequest('/auth/me')
        const user = data.user || data
        if (cancelled) return

        setProfile({
          name: user.name || '',
          email: user.email || '',
        })
        localStorage.setItem('budgetwiseUser', JSON.stringify(user))
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load your profile.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProfile()
    return () => { cancelled = true }
  }, [])

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const name = profile.name.trim()
    const email = profile.email.trim().toLowerCase()

    if (!name || !email) {
      setError('Name and email are required.')
      return
    }

    try {
      setSaving(true)
      const data = await apiRequest('/users/me/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, email }),
      })

      const updatedUser = data.user
      if (!updatedUser) throw new Error('The server did not return the updated user.')

      setProfile({ name: updatedUser.name, email: updatedUser.email })

      let previousUser = {}
      try {
        previousUser = JSON.parse(localStorage.getItem('budgetwiseUser') || '{}')
      } catch {
        previousUser = {}
      }

      localStorage.setItem(
        'budgetwiseUser',
        JSON.stringify({ ...previousUser, ...updatedUser })
      )
      setSuccess(data.message || 'Profile updated successfully.')
    } catch (err) {
      setError(err.message || 'Unable to update your profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="workspace-panel">
      <div className="workspace-panel-heading">
        <div>
          <h3>Personal information</h3>
          <p>View and update your account details.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading your profile...</p>
      ) : (
        <form className="workspace-form" onSubmit={handleSave}>
          <label>
            Full name
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={(event) => setProfile((previous) => ({ ...previous, name: event.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={(event) => setProfile((previous) => ({ ...previous, email: event.target.value }))}
              placeholder="Enter your email address"
              required
            />
          </label>
          {error && <p className="workspace-error">{error}</p>}
          {success && <p className="workspace-success">{success}</p>}
          <button type="submit" className="workspace-primary-button" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  )
}

// CREATE RECORD MODAL
function CreateRecordModal({ type, onClose, onSubmit, formData, setFormData, saving }) {
  const titles = {
    expense: 'Create Expense',
    invoice: 'Create Invoice',
    employee: 'Add Employee',
    manager: 'Add Finance Manager',
  }

const DEPARTMENTS = [
  'Marketing',
  'Development & IT',
  'Finance',
  'HR',
  'Operations',
  'Sales',
  'Other'
]

function EmployeeManagement() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [editingEmployee, setEditingEmployee] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: ''
  })

  // Load employees
  const loadEmployees = async () => {
    try {
      setLoading(true)

      const data = await apiRequest('/users')

      setEmployees(
        (data.users || []).filter(user => user.role === 'employee')
      )
    } catch (error) {
      setNotice(error.message || 'Could not load employees.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  // Open edit form
  const openEdit = (employee) => {
    setEditingEmployee(employee)

    setForm({
      name: employee.name || '',
      email: employee.email || '',
      department: employee.department || ''
    })

    setNotice('')
  }

  // Save employee changes
  const handleUpdate = async (event) => {
    event.preventDefault()
    setNotice('')

    if (!form.department) {
      setNotice('Please select a department.')
      return
    }

    try {
      setSaving(true)

      const data = await apiRequest(
        `/users/${editingEmployee._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            department: form.department
          })
        }
      )

      if (data.user) {
        setEmployees(previous =>
          previous.map(employee =>
            employee._id === editingEmployee._id
              ? data.user
              : employee
          )
        )
      } else {
        await loadEmployees()
      }

      setEditingEmployee(null)
      setNotice(data.message || 'Employee updated successfully.')
    } catch (error) {
      setNotice(error.message || 'Could not update employee.')
    } finally {
      setSaving(false)
    }
  }

  // Deactivate or reactivate employee
  const handleStatusChange = async (employee) => {
    const newStatus = employee.active === false

    const confirmed = window.confirm(
      newStatus
        ? `Reactivate ${employee.name}?`
        : `Deactivate ${employee.name}? They will no longer be able to access BudgetWise.`
    )

    if (!confirmed) return

    try {
      setNotice('')

      const data = await apiRequest(
        `/users/${employee._id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            active: newStatus
          })
        }
      )

      if (data.user) {
        setEmployees(previous =>
          previous.map(item =>
            item._id === employee._id
              ? data.user
              : item
          )
        )
      } else {
        await loadEmployees()
      }

      setNotice(
        data.message ||
        (newStatus
          ? 'Employee reactivated successfully.'
          : 'Employee deactivated successfully.')
      )
    } catch (error) {
      setNotice(error.message || 'Could not update employee status.')
    }
  }

  return (
    <div className="workspace-panel">

      <div className="workspace-panel-heading">
        <div>
          <h3>Employee Management</h3>
          <p>Manage employee details, departments and account access.</p>
        </div>
      </div>

      {notice && (
        <p role="status" style={{ padding: '10px', margin: '10px 0' }}>
          {notice}
        </p>
      )}

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '650px'
          }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Department</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map(employee => (
                <tr key={employee._id}>
                  <td style={{ padding: '12px' }}>
                    {employee.name}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {employee.email}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {employee.department || 'Not assigned'}
                  </td>

                  <td style={{ padding: '12px' }}>
                    <span>
                      {employee.active === false ? 'Inactive' : 'Active'}
                    </span>
                  </td>

                  <td style={{ padding: '12px' }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        type="button"
                        className="workspace-secondary-button"
                        onClick={() => openEdit(employee)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="workspace-primary-button"
                        onClick={() => handleStatusChange(employee)}
                      >
                        {employee.active === false
                          ? 'Reactivate'
                          : 'Deactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
{editingEmployee && (
  <div
    className="workspace-modal-overlay"
    onClick={() => setEditingEmployee(null)}
  >
    <div
      className="workspace-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="employee-modal-heading">
        <div>
          <h3>Edit Employee</h3>
          <p>Update this employee's information.</p>
        </div>

        <button
          type="button"
          className="employee-modal-close"
          onClick={() => setEditingEmployee(null)}
        >
          <X size={19} />
        </button>
      </div>

      <form onSubmit={handleSaveEmployee}>
        <label>
          Employee Name
          <input
            value={employeeEditForm.name}
            onChange={(e) =>
              setEmployeeEditForm({
                ...employeeEditForm,
                name: e.target.value
              })
            }
            required
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            value={employeeEditForm.email}
            onChange={(e) =>
              setEmployeeEditForm({
                ...employeeEditForm,
                email: e.target.value
              })
            }
            required
          />
        </label>

        <label>
          Department
          <select
            value={employeeEditForm.department}
            onChange={(e) =>
              setEmployeeEditForm({
                ...employeeEditForm,
                department: e.target.value
              })
            }
            required
          >
            <option value="">Select Department</option>
            <option value="Marketing">Marketing</option>
            <option value="Development & IT">Development & IT</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <div className="workspace-form-actions">
          <button
            type="button"
            onClick={() => setEditingEmployee(null)}
          >
            Cancel
          </button>

          <button type="submit" disabled={savingEmployee}>
            {savingEmployee ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  )
}


  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  return (
    <div className="workspace-modal-overlay">
      <div className="workspace-modal">
        <div className="workspace-panel-heading">
          <div>
            <h3>{titles[type]}</h3>
            <p>Enter the information below.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form">
            <X size={20} />
          </button>
        </div>

        <form className="workspace-form" onSubmit={onSubmit}>
          {['employee', 'manager'].includes(type) && (
            <>
              <label>
                Full name
                <input required value={formData.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Enter full name" />
              </label>
              <label>
                Email address
                <input required type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Enter email address" />
              </label>
              <label>
                Temporary password
                <input required type="password" minLength={8} value={formData.password} onChange={(event) => updateField('password', event.target.value)} placeholder="Minimum 8 characters" />
              </label>
              {type === 'employee' && (
  <label>
    Department
    <select
      required
      value={formData.department || ''}
      onChange={(event) => updateField('department', event.target.value)}
    >
      <option value="">Select department</option>
      <option value="Marketing">Marketing</option>
      <option value="Development & IT">Development & IT</option>
      <option value="Finance">Finance</option>
      <option value="HR">HR</option>
      <option value="Operations">Operations</option>
      <option value="Sales">Sales</option>
      <option value="Other">Other</option>
    </select>
  </label>
)}
            </>
          )}

         

{type === 'invoice' && (
  <>
    {/* INVOICE TYPE */}
    <label>
      Invoice type
      <select
        required
        value={formData.invoiceType || 'vendor'}
        onChange={(event) => updateField('invoiceType', event.target.value)}
      >
        <option value="vendor">Vendor Invoice</option>
        <option value="client">Client Invoice</option>
      </select>
    </label>

    {/* VENDOR INVOICE */}
    {formData.invoiceType !== 'client' ? (
      <label>
        Vendor name
        <input
          required
          value={formData.vendor || ''}
          onChange={(event) => updateField('vendor', event.target.value)}
          placeholder="Enter vendor name"
        />
      </label>
    ) : (
      /* CLIENT INVOICE */
      <>
        <label>
          Client name
          <input
            required
            value={formData.clientName || ''}
            onChange={(event) => updateField('clientName', event.target.value)}
            placeholder="Enter client name"
          />
        </label>

        <label>
          Client email
          <input
            type="email"
            value={formData.clientEmail || ''}
            onChange={(event) => updateField('clientEmail', event.target.value)}
            placeholder="Enter client email"
          />
        </label>

        <label>
          Client phone
          <input
            value={formData.clientPhone || ''}
            onChange={(event) => updateField('clientPhone', event.target.value)}
            placeholder="Enter client phone"
          />
        </label>

        <label>
          Project name
          <input
            required
            value={formData.projectName || ''}
            onChange={(event) => updateField('projectName', event.target.value)}
            placeholder="e.g. Website Development"
          />
        </label>

        <label>
          Project budget (Rs.)
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={formData.projectBudget || ''}
            onChange={(event) => updateField('projectBudget', event.target.value)}
            placeholder="Enter project budget"
          />
        </label>
      </>
    )}

    {/* DUE DATE */}
    <label>
      Due date
      <input
        type="date"
        value={formData.dueDate || ''}
        onChange={(event) => updateField('dueDate', event.target.value)}
      />
    </label>
  </>
)}


          {['expense', 'invoice'].includes(type) && (
            <label>
              Amount
              <input required type="number" min="0.01" step="0.01" value={formData.amount} onChange={(event) => updateField('amount', event.target.value)} placeholder="Enter amount" />
            </label>
          )}

          <div className="workspace-modal-actions">
            <button type="button" className="workspace-secondary-button" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="workspace-primary-button" disabled={saving}>
              <Plus size={17} />
              {saving ? 'Saving...' : titles[type]}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


// EXPENSE RECORDS TABLE




function ExpenseRecordsTable({
  canManage,
  onDeleteExpense,
  deletingExpense
}) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingExpense, setUpdatingExpense] = useState(null)

  // LOAD EXPENSES
  const loadExpenses = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiRequest('/expenses')

      setExpenses(
        Array.isArray(response.expenses)
          ? response.expenses
          : Array.isArray(response)
            ? response
            : []
      )
    } catch (err) {
      setError(err.message || 'Unable to load expenses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  // UPDATE PAYMENT STATUS
  const handlePaymentChange = async (expenseId, currentStatus) => {
    const normalizedStatus = String(currentStatus || 'unpaid')
      .trim()
      .toLowerCase()

    const nextStatus =
      normalizedStatus === 'paid' ? 'unpaid' : 'paid'

    try {
      setUpdatingExpense(expenseId)
      setError('')

      const response = await apiRequest(
        `/expenses/${expenseId}/payment-status`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            status: nextStatus
          })
        }
      )

      if (!response.expense) {
        throw new Error(
          response.message || 'Server did not return the updated expense.'
        )
      }

      setExpenses(prev =>
        prev.map(expense =>
          expense._id === expenseId
            ? {
                ...expense,
                ...response.expense,
                paymentStatus: response.expense.paymentStatus
              }
            : expense
        )
      )

    } catch (err) {
      console.error('Payment status error:', err)
      setError(err.message || 'Could not update payment status.')
    } finally {
      setUpdatingExpense(null)
    }
  }

  // FORMAT DATE
  const formatDate = date =>
    date ? new Date(date).toLocaleDateString() : '—'

  // FORMAT AMOUNT
  const formatAmount = amount =>
    `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`

  // SUMMARY TOTALS
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  )

  const paidExpenses = expenses
    .filter(expense =>
      String(expense.paymentStatus || 'unpaid')
        .trim()
        .toLowerCase() === 'paid'
    )
    .reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    )

  const unpaidExpenses = totalExpenses - paidExpenses

  return (
    <div className="workspace-request-section expense-management-page">

      <div className="workspace-panel-heading">
        <div>
          <h3>Company Expenses</h3>
          <p>Manage and monitor your company's spending.</p>
        </div>
      </div>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && (
        <div className="expense-summary-grid">

          <div className="expense-summary-card">
            <span>Total Expenses</span>
            <h2>{formatAmount(totalExpenses)}</h2>
          </div>

          <div className="expense-summary-card">
            <span>Paid Expenses</span>
            <h2>{formatAmount(paidExpenses)}</h2>
          </div>

          <div className="expense-summary-card">
            <span>Unpaid Expenses</span>
            <h2>{formatAmount(unpaidExpenses)}</h2>
          </div>

          <div className="expense-summary-card">
            <span>Total Records</span>
            <h2>{expenses.length}</h2>
          </div>

        </div>
      )}

      <div className="workspace-panel">

        <div className="workspace-panel-heading">
          <div>
            <h3>Expense Records</h3>
            <p>All recorded company expenses.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <div className="workspace-table-wrap">
            <table className="workspace-table">

              <thead>
                <tr>
                  <th>EXPENSE</th>
                  <th>CATEGORY</th>
                  <th>DEPARTMENT</th>
                  <th>AMOUNT</th>
                  <th>DATE</th>
                  <th>PAYMENT STATUS</th>
                  <th>PAYMENT ACTION</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map(expense => {
                  const paid =
                    String(expense.paymentStatus || 'unpaid')
                      .trim()
                      .toLowerCase() === 'paid'

                  return (
                    <tr key={expense._id}>

                      <td>
                        <strong>{expense.title}</strong>

                        {expense.description && (
                          <p>{expense.description}</p>
                        )}
                      </td>

                      <td>{expense.category || '—'}</td>

                      <td>{expense.department || '—'}</td>

                      <td>{formatAmount(expense.amount)}</td>

                      <td>{formatDate(expense.createdAt)}</td>

                      <td>
                        <span
                          className={`workspace-status ${
                            paid ? 'approved' : 'pending'
                          }`}
                        >
                          {paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>

                      <td>
                        {canManage && expense.status === 'approved' ? (
                          <button
                            type="button"
                            disabled={updatingExpense === expense._id}
                            onClick={() =>
                              handlePaymentChange(
                                expense._id,
                                expense.paymentStatus
                              )
                            }
                          >
                            {updatingExpense === expense._id
                              ? 'Saving...'
                              : paid
                                ? 'Mark Unpaid'
                                : 'Mark Paid'}
                          </button>
                        ) : '—'}
                      </td>

                      <td>
                        {canManage ? (
                          <button
                            type="button"
                            className="expense-delete-btn"
                            disabled={deletingExpense === expense._id}
                            onClick={() => onDeleteExpense(expense._id)}
                          >
                            <Trash2 size={17} />
                          </button>
                        ) : '—'}
                      </td>

                    </tr>
                  )
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  )
}





// INVOICE RECORDS TABLE
function InvoiceRecordsTable({
  invoices,
  loading,
  onStatusChange,
  updatingInvoice
}) {
  const [deletingInvoice, setDeletingInvoice] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : '—'

  const formatAmount = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`

  const handleActionChange = async (invoice, action) => {
    if (action !== 'delete') {
      onStatusChange(invoice._id, action)
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete invoice ${invoice.invoiceNumber}?`
    )

    if (!confirmed) return

    try {
      setDeletingInvoice(invoice._id)
      setDeleteError('')

      await apiRequest(`/invoices/${invoice._id}`, {
        method: 'DELETE'
      })

      window.location.reload()

    } catch (error) {
      setDeleteError(error.message || 'Failed to delete invoice.')
      setDeletingInvoice(null)
    }
  }

  return (
    <div className="workspace-panel">
      <div className="workspace-panel-heading">
        <div>
          <h3>Invoice records</h3>
          <p>Invoices saved in your company database.</p>
        </div>
      </div>

      {deleteError && (
        <p className="workspace-error">{deleteError}</p>
      )}

      {loading ? (
        <p>Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p>No invoices found. Create your first invoice to get started.</p>
      ) : (
        <div className="workspace-table-wrap">
          <table className="workspace-table">
            <thead>
              <tr>
                <th>INVOICE NUMBER</th>
                <th>INVOICE TYPE</th>
                <th>CLIENT / VENDOR</th>
                <th>PROJECT</th>
                <th>AMOUNT</th>
                <th>DUE DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => {
                const isClient = invoice.type === 'client'
                const isDeleting = deletingInvoice === invoice._id

                return (
                  <tr key={invoice._id}>
                    <td>
                      <strong>{invoice.invoiceNumber}</strong>
                    </td>

                    <td>
                      <span className={`workspace-status ${isClient ? 'paid' : 'pending'}`}>
                        {isClient ? 'Client Invoice' : 'Vendor Invoice'}
                      </span>
                    </td>

                    <td>
                      {isClient
                        ? invoice.clientName || '—'
                        : invoice.vendor || '—'}
                    </td>

                    <td>
                      {invoice.project?.name || invoice.projectName || '—'}
                    </td>

                    <td>{formatAmount(invoice.amount)}</td>

                    <td>{formatDate(invoice.dueDate)}</td>

                    <td>
                      <span className={`workspace-status ${String(invoice.status).toLowerCase()}`}>
                        {invoice.status}
                      </span>
                    </td>

                    <td>
                      <select
                        value={isDeleting ? 'delete' : invoice.status}
                        disabled={
                          isDeleting ||
                          updatingInvoice === invoice._id
                        }
                        onChange={(event) =>
                          handleActionChange(invoice, event.target.value)
                        }
                        aria-label={`Actions for ${invoice.invoiceNumber}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="delete">Delete</option>
                      </select>

                      {isDeleting && <span> Deleting...</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

 // BUDGET MANAGEMENT

function BudgetManager() {
  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  const [departments, setDepartments] = useState([])

  const [budgets, setBudgets] = useState([])
  const [month, setMonth] = useState(getCurrentMonth())
  const [amount, setAmount] = useState('')
  const [budgetType, setBudgetType] = useState('company')
  const [department, setDepartment] = useState('Sales')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const formatMoney = (value) =>
    `Rs. ${Number(value || 0).toLocaleString('en-PK')}`

  const formatMonth = (value) => {
    if (!value) return '—'

    const [year, monthNumber] = value.split('-')

    return new Date(Number(year), Number(monthNumber) - 1, 1)
      .toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
  }

  const loadBudgets = async () => {
    try {
      setError('')

      const data = await apiRequest('/budgets')

      setBudgets(data.budgets || [])
    } catch (err) {
      setError(err.message || 'Unable to load budgets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBudgets()
  }, [])
  useEffect(() => {
  const loadDepartments = async () => {
    try {
      const data = await apiRequest('/departments')
      setDepartments(data.departments || [])
    } catch (error) {
      console.error('Unable to load departments:', error)
    }
  }

  loadDepartments()
}, [])

  const resetForm = () => {
    setMonth(getCurrentMonth())
    setAmount('')
    setBudgetType('company')
    setDepartment('Sales')
    setEditing(false)
    setEditingId(null)
    setError('')
  }

  const handleSave = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    const budgetAmount = Number(amount)

    if (!Number.isFinite(budgetAmount) || budgetAmount <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }

    if (budgetType === 'department' && !department) {
      setError('Please select a department.')
      return
    }

    try {
      setSaving(true)

      const budgetName =
        budgetType === 'company'
          ? 'Company Budget'
          : department

      const data = await apiRequest('/budgets', {
        method: 'POST',
        body: JSON.stringify({
          month,
          type: budgetType,
          name: budgetName,
          amount: budgetAmount,
        }),
      })

      setSuccess(
        data.message ||
        `${budgetName} budget saved successfully.`
      )

      setShowForm(false)
      resetForm()

      await loadBudgets()

    } catch (err) {
      setError(err.message || 'Unable to save budget.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (budget) => {
    if (!['company', 'department'].includes(budget.type)) {
      return
    }

    setMonth(budget.month)
    setAmount(String(budget.amount))
    setBudgetType(budget.type)

    if (budget.type === 'department') {
      setDepartment(budget.name)
    }

    setEditing(true)
    setEditingId(budget._id)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (budget) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${budget.name}" for ${formatMonth(budget.month)}?`
    )

    if (!confirmed) return

    try {
      setDeletingId(budget._id)
      setError('')
      setSuccess('')

      const data = await apiRequest(`/budgets/${budget._id}`, {
        method: 'DELETE',
      })

      setBudgets((previous) =>
        previous.filter((item) => item._id !== budget._id)
      )

      setSuccess(data.message || 'Budget deleted successfully.')

      if (editingId === budget._id) {
        setShowForm(false)
        resetForm()
      }

    } catch (err) {
      setError(err.message || 'Unable to delete budget.')
    } finally {
      setDeletingId(null)
    }
  }

  const sortedBudgets = [...budgets].sort((a, b) => {
    const monthOrder = (b.month || '').localeCompare(a.month || '')

    if (monthOrder !== 0) return monthOrder

    return (a.name || '').localeCompare(b.name || '')
  })

  return (
    <div className="workspace-request-section budget-management-page">

      {/* BUDGET HEADER */}
      <div className="workspace-panel">

        <div className="workspace-panel-heading">
          <div>
            <h3>Budget Management</h3>
            <p>
              Manage monthly company and department spending limits.
            </p>
          </div>

          <button
            type="button"
            className="workspace-primary-button"
            onClick={() => {
              if (showForm) {
                setShowForm(false)
                resetForm()
              } else {
                resetForm()
                setShowForm(true)
              }
            }}
          >
            <Plus size={17} />
            Add Budget
          </button>
        </div>

        {/* CREATE / EDIT FORM */}
        {showForm && (
          <form
            className="workspace-form"
            onSubmit={handleSave}
          >

            <h3>
              {editing ? 'Edit Budget' : 'Create New Budget'}
            </h3>

            {/* BUDGET TYPE */}
            <label>
              Budget Type

              <select
                value={budgetType}
                onChange={(event) => {
                  setBudgetType(event.target.value)
                  setError('')
                }}
                disabled={editing}
                required
              >
                <option value="company">
                  Company Budget
                </option>

                <option value="department">
                  Department Budget
                </option>
              </select>
            </label>

            {/* DEPARTMENT SELECTOR */}
            {budgetType === 'department' && (
              <label>
                Select Department

                <select
                  value={department}
                  onChange={(event) =>
                    setDepartment(event.target.value)
                  }
                  required
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {/* MONTH */}
            <label>
              Select Month

              <input
                type="month"
                value={month}
                onChange={(event) =>
                  setMonth(event.target.value)
                }
                required
              />
            </label>

            {/* AMOUNT */}
            <label>
              {budgetType === 'company'
                ? 'Company Budget Amount (Rs.)'
                : `${department} Department Budget (Rs.)`}

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="Enter budget amount"
                required
              />
            </label>

            {error && (
              <p className="workspace-error">
                {error}
              </p>
            )}

            <div className="workspace-form-actions">

              <button
                type="submit"
                className="workspace-primary-button"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editing
                    ? 'Update Budget'
                    : 'Save Budget'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
              >
                Cancel
              </button>

            </div>
          </form>
        )}

        {success && (
          <p className="workspace-success">
            {success}
          </p>
        )}

      </div>

      {/* ALL BUDGET RECORDS */}
      <div className="workspace-panel">

        <div className="workspace-panel-heading">
          <div>
            <h3>Budget Records</h3>
            <p>
              View and manage company and department budget allocations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true)
              loadBudgets()
            }}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {error && !showForm && (
          <p className="workspace-error">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading budgets...</p>
        ) : sortedBudgets.length === 0 ? (
          <p>
            No budgets created yet. Click Add Budget to get started.
          </p>
        ) : (
          <div className="workspace-table-wrap">

            <table className="workspace-table">

              <thead>
                <tr>
                  <th>BUDGET NAME</th>
                  <th>BUDGET TYPE</th>
                  <th>MONTH</th>
                  <th>ALLOCATED AMOUNT</th>
                  <th>LAST UPDATED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {sortedBudgets.map((budget) => (
                  <tr key={budget._id}>

                    <td>
                      <strong>
                        {budget.name || 'Company Budget'}
                      </strong>
                    </td>

                    <td>
                      {budget.type === 'company'
                        ? 'Company'
                        : budget.type === 'department'
                          ? 'Department'
                          : 'Category'}
                    </td>

                    <td>
                      {formatMonth(budget.month)}
                    </td>

                    <td>
                      {formatMoney(budget.amount)}
                    </td>

                    <td>
                      {budget.updatedAt
                        ? new Date(budget.updatedAt).toLocaleDateString()
                        : '—'}
                    </td>

                    <td>
                      <div className="workspace-expense-actions">

                        {['company', 'department'].includes(budget.type) && (
                          <button
                            type="button"
                            onClick={() => handleEdit(budget)}
                          >
                            Edit
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={deletingId === budget._id}
                          onClick={() => handleDelete(budget)}
                        >
                          {deletingId === budget._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}




 // REPORTS MANAGEMENT
function ReportsManager() {
  const getCurrentMonthValue = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const getMonthDates = (monthValue) => {
  const [year, month] = monthValue.split('-').map(Number)
  const lastDay = new Date(year, month, 0).getDate()

  return {
    from: `${year}-${String(month).padStart(2, '0')}-01`,
    to: `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
  }
}

const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue())
const [dates, setDates] = useState(() => getMonthDates(getCurrentMonthValue()))
  const [selectedReport, setSelectedReport] = useState('')
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const reports = [
    { id: 'expenses', title: 'Monthly Expense Report', description: 'Approved company expenses and spending records.' },
    { id: 'categories', title: 'Category Spending Report', description: 'Compare spending across expense categories.' },
    { id: 'invoices', title: 'Invoice Summary', description: 'Review paid, pending and overdue invoices.' },
    { id: 'approvals', title: 'Approval Activity Report', description: 'Review approved and rejected financial requests.' },
  ]

  const formatMoney = (value) =>
    `Rs. ${Number(value || 0).toLocaleString()}`

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : '—'

  const formatText = (value) =>
    String(value || '—').replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())

  const loadReport = async (reportType) => {
    setError('')
    setSuccess('')

    if (!dates.from || !dates.to || dates.from > dates.to) {
      setError('Please select a valid date range.')
      return
    }

    try {
      setLoading(true)
      setSelectedReport(reportType)

      const query = new URLSearchParams({
        from: dates.from,
        to: dates.to,
      })

      const data = await apiRequest(
        `/reports/${reportType}?${query.toString()}`
      )

      setReportData(data)
    } catch (err) {
      setReportData(null)
      setError(err.message || 'Unable to generate this report.')
    } finally {
      setLoading(false)
    }
  }

  const getTable = () => {
    if (!reportData) return { columns: [], rows: [] }

    if (selectedReport === 'expenses') {
      return {
        columns: ['Expense', 'Category', 'Amount', 'Submitted By', 'Date'],
        rows: (reportData.expenses || []).map(item => [
          item.title,
          formatText(item.category),
          formatMoney(item.amount),
          item.createdBy?.name || '—',
          formatDate(item.createdAt),
        ]),
      }
    }

    if (selectedReport === 'categories') {
      return {
        columns: ['Category', 'Total Spending', 'Number of Expenses'],
        rows: (reportData.categories || []).map(item => [
          formatText(item.category),
          formatMoney(item.amount),
          item.count,
        ]),
      }
    }

    if (selectedReport === 'invoices') {
      return {
        columns: ['Invoice Number', 'Vendor', 'Amount', 'Status', 'Due Date'],
        rows: (reportData.invoices || []).map(item => [
          item.invoiceNumber,
          item.vendor,
          formatMoney(item.amount),
          formatText(item.status),
          formatDate(item.dueDate),
        ]),
      }
    }

    if (selectedReport === 'approvals') {
      return {
        columns: ['Request', 'Type', 'Employee', 'Amount', 'Status', 'Updated'],
        rows: (reportData.requests || []).map(item => [
          item.title,
          formatText(item.type),
          item.createdBy?.name || '—',
          formatMoney(item.amount),
          formatText(item.status),
          formatDate(item.updatedAt),
        ]),
      }
    }

    return { columns: [], rows: [] }
  }

  const getSummary = () => {
    if (!reportData) return []

    if (selectedReport === 'expenses') {
      return [
        ['Total Expenses', formatMoney(reportData.total)],
        ['Number of Records', reportData.recordCount || 0],
      ]
    }

    if (selectedReport === 'categories') {
      return [
        ['Total Spending', formatMoney(reportData.total)],
        ['Categories', reportData.categories?.length || 0],
      ]
    }

    if (selectedReport === 'invoices') {
      const s = reportData.summary || {}
      return [
        ['Total Invoices', s.totalInvoices || 0],
        ['Total Amount', formatMoney(s.totalAmount)],
        ['Paid Amount', formatMoney(s.paidAmount)],
        ['Pending Amount', formatMoney(s.pendingAmount)],
        ['Overdue Amount', formatMoney(s.overdueAmount)],
      ]
    }

    if (selectedReport === 'approvals') {
      const s = reportData.summary || {}
      return [
        ['Total Reviewed', s.total || 0],
        ['Approved', s.approved || 0],
        ['Rejected', s.rejected || 0],
      ]
    }

    return []
  }

  const downloadExcel = () => {
  const table = getTable()
  const summary = getSummary()

  const reportTitle =
    reports.find(item => item.id === selectedReport)?.title || 'Financial Report'

  const rows = [
    ['BUDGETWISE'],
    [reportTitle],
    ['Reporting Period', `${dates.from} to ${dates.to}`],
    ['Generated On', new Date().toLocaleString()],
    [],
    ['SUMMARY', 'VALUE'],
    ...summary,
    [],
    table.columns,
    ...table.rows,
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(rows)

  const columnCount = Math.max(table.columns.length, 2)

  worksheet['!cols'] = Array.from(
    { length: columnCount },
    (_, index) => ({
      wch: index === 0 ? 28 : index === 1 ? 22 : 20,
    })
  )

  worksheet['!freeze'] = {
    xSplit: 0,
    ySplit: 1,
  }

  const titleEnd = XLSX.utils.encode_cell({
    r: 0,
    c: columnCount - 1,
  })

  if (columnCount > 1) {
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columnCount - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: columnCount - 1 } },
    ]
  }

  const styleCell = (cellAddress, style) => {
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = style
    }
  }

  const purpleHeader = {
    fill: { fgColor: { rgb: '6D28D9' } },
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      bottom: { style: 'thin', color: { rgb: 'D8B4FE' } },
    },
  }

  styleCell('A1', {
    font: { bold: true, size: 20, color: { rgb: '6D28D9' } },
  })

  styleCell('A2', {
    font: { bold: true, size: 14, color: { rgb: '333333' } },
  })

  // Style summary heading
  styleCell('A6', purpleHeader)
  styleCell('B6', purpleHeader)

  // Style report table heading
  const tableHeaderRow = 7 + summary.length
  const lastColumn = XLSX.utils.encode_col(table.columns.length - 1)

  for (let column = 0; column < table.columns.length; column++) {
    const address = XLSX.utils.encode_cell({
      r: tableHeaderRow,
      c: column,
    })
    styleCell(address, purpleHeader)
  }

  // Add filter to the report table
  if (table.columns.length > 0) {
    worksheet['!autofilter'] = {
      ref: `A${tableHeaderRow + 1}:${lastColumn}${rows.length}`,
    }
  }

  // Add readable row heights
  worksheet['!rows'] = rows.map((_, index) => ({
    hpt: index === 0 ? 30 : index === tableHeaderRow ? 24 : 21,
  }))

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Report')

  XLSX.writeFile(
    workbook,
    `BudgetWise-${selectedReport}-${selectedMonth}.xlsx`
  )

  setSuccess('Excel report downloaded successfully.')
}

  const downloadCSV = () => {
    const table = getTable()
    const summary = getSummary()

    const escapeCSV = (value) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`

    const lines = [
      [reports.find(item => item.id === selectedReport)?.title || 'Report'],
      [`Period: ${dates.from} to ${dates.to}`],
      [],
      ...summary,
      [],
      table.columns,
      ...table.rows,
    ]

    const csv = lines
      .map(row => row.map(escapeCSV).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `BudgetWise-${selectedReport}-${dates.from}-to-${dates.to}.csv`
    link.click()

    URL.revokeObjectURL(url)
    setSuccess('CSV report downloaded successfully.')
  }

  const downloadPDF = () => {
    const table = getTable()
    const summary = getSummary()

    const pdf = new jsPDF()
    const reportTitle =
      reports.find(item => item.id === selectedReport)?.title || 'Financial Report'

    pdf.setFontSize(19)
    pdf.text('BudgetWise', 14, 18)

    pdf.setFontSize(14)
    pdf.text(reportTitle, 14, 29)

    pdf.setFontSize(10)
    pdf.text(`Period: ${dates.from} to ${dates.to}`, 14, 37)
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 43)

    autoTable(pdf, {
      startY: 50,
      head: [['Summary', 'Value']],
      body: summary,
      theme: 'grid',
      headStyles: { fillColor: [109, 40, 217] },
    })

    autoTable(pdf, {
      startY: pdf.lastAutoTable.finalY + 10,
      head: [table.columns],
      body: table.rows,
      theme: 'grid',
      headStyles: { fillColor: [109, 40, 217] },
      styles: { fontSize: 8 },
    })

    pdf.save(`BudgetWise-${selectedReport}-${dates.from}-to-${dates.to}.pdf`)
    setSuccess('PDF report downloaded successfully.')
  }

  const activeReport = reports.find(item => item.id === selectedReport)
  const table = getTable()

  return (
    <div className="workspace-request-section budget-management-page">
      <div className="workspace-panel">
        <div className="workspace-panel-heading">
          <div>
            <h3>Financial Reports</h3>
            <p>Generate and download reports using your company's saved records.</p>
          </div>
        </div>

        <div className="workspace-form">
  <label>
    Select report month
    <input
      type="month"
      value={selectedMonth}
      onChange={(event) => {
        const value = event.target.value

        if (!value) return

        setSelectedMonth(value)
        setDates(getMonthDates(value))
        setReportData(null)
        setSelectedReport('')
        setError('')
        setSuccess('')
      }}
      required
    />
  </label>

  <button
    type="button"
    className="workspace-secondary-button"
    onClick={() => {
      const currentMonth = getCurrentMonthValue()

      setSelectedMonth(currentMonth)
      setDates(getMonthDates(currentMonth))
      setReportData(null)
      setSelectedReport('')
      setError('')
      setSuccess('')
    }}
  >
    Current Month
  </button>
</div>
        {error && <p className="workspace-error">{error}</p>}
        {success && <p className="workspace-success">{success}</p>}

        <div className="workspace-report-list">
          {reports.map(report => (
            <div className="workspace-report-row" key={report.id}>
              <FileText size={20} />
              <div className="workspace-report-info">
                <strong>{report.title}</strong>
                <p>{report.description}</p>
              </div>
              <button
                type="button"
                className="workspace-primary-button"
                disabled={loading}
                onClick={() => loadReport(report.id)}
              >
                View Report
              </button>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="workspace-panel">
          <p>Generating your report...</p>
        </div>
      )}

      {!loading && reportData && (
        <div className="workspace-panel">
          <div className="workspace-panel-heading">
            <div>
              <h3>{activeReport?.title}</h3>
              <p>{dates.from} to {dates.to}</p>
            </div>

            <div className="workspace-report-actions">
             <button type="button" onClick={downloadExcel}>
               Download Excel
             </button>

             <button type="button" onClick={downloadCSV}>
               Download CSV
             </button>

             <button type="button" onClick={downloadPDF}>
               Download PDF
             </button>
           </div>
          </div>

          <div className="workspace-stats">
            {getSummary().map(([label, value]) => (
              <div className="workspace-stat" key={label}>
                <div>
                  <span>{label}</span>
                  <h2>{value}</h2>
                </div>
              </div>
            ))}
          </div>

          <h3>Report Details</h3>

          <div className="workspace-table-wrap">
            <table className="workspace-table">
              <thead>
                <tr>
                  {table.columns.map(column => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.length === 0 ? (
                  <tr>
                    <td colSpan={table.columns.length}>
                      No records found for this date range.
                    </td>
                  </tr>
                ) : (
                  table.rows.map((row, index) => (
                    <tr key={index}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}


 // TRANSACTIONS MANAGEMENT
function TransactionsManager() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalTransactions: 0,
  })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const formatMoney = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : '—'

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiRequest('/transactions')

      setTransactions(data.transactions || [])
      setSummary(data.summary || {
        totalIncome: 0,
        totalExpenses: 0,
        totalTransactions: (data.transactions || []).length,
      })
    } catch (err) {
      setError(err.message || 'Unable to load transactions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const filteredTransactions = transactions.filter((item) => {
    const matchesType =
      filter === 'all' || item.type === filter

    const searchText = search.trim().toLowerCase()

    const matchesSearch =
      !searchText ||
      String(item.title || '').toLowerCase().includes(searchText) ||
      String(item.category || '').toLowerCase().includes(searchText) ||
      String(item.createdBy?.name || '').toLowerCase().includes(searchText)

    return matchesType && matchesSearch
  })

  const netBalance =
    Number(summary.totalIncome || 0) -
    Number(summary.totalExpenses || 0)

  return (
    <div className="workspace-request-section transaction-management-page">

      {/* TRANSACTION SUMMARY */}
      <div className="workspace-stats">
        <SummaryCard
          title="Total Income"
          value={formatMoney(summary.totalIncome)}
          icon={TrendingUp}
          color="green"
        />

        <SummaryCard
          title="Total Expenses"
          value={formatMoney(summary.totalExpenses)}
          icon={Receipt}
          color="orange"
        />


        <SummaryCard
          title="Total Transactions"
          value={summary.totalTransactions || transactions.length}
          icon={FileText}
          color="blue"
        />
      </div>

      {/* TRANSACTION RECORDS */}
      <div className="workspace-panel">

        <div className="workspace-panel-heading">
          <div>
            <h3>All Transactions</h3>
            <p>
              A combined view of recorded company income and paid expenses.
            </p>
          </div>

          <button
            type="button"
            onClick={loadTransactions}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {error && <p className="workspace-error">{error}</p>}

        {/* FILTERS */}
        <div className="transaction-toolbar">
          <input
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>

        {loading ? (
          <p>Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="workspace-table-wrap">
            <table className="workspace-table">
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th>TYPE</th>
                  <th>CATEGORY</th>
                  <th>AMOUNT</th>
                  <th>RECORDED BY</th>
                  <th>DATE</th>
                  <th>SOURCE</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.title || 'Untitled transaction'}</strong>
                    </td>

                    <td>
                      <span
                        className={`workspace-status ${
                          item.type === 'income' ? 'approved' : 'pending'
                        }`}
                      >
                        {item.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>

                    <td>{item.category || '—'}</td>

                    <td>
                      <strong>{formatMoney(item.amount)}</strong>
                    </td>

                    <td>{item.createdBy?.name || '—'}</td>

                    <td>{formatDate(item.date)}</td>

                    <td>
                      {item.source === 'income' ? 'Income Record' : 'Expense Record'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <p className="transaction-result-count">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        )}
      </div>
    </div>
  )
}




function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [editingProject, setEditingProject] = useState(null)
  const [expenseProject, setExpenseProject] = useState(null)

  const [editForm, setEditForm] = useState({
    name: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    description: '',
    budgetAmount: '',
    status: 'active',
    startDate: '',
    endDate: ''
  })

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: '',
    amount: '',
    description: '',
    department: ''
  })

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiRequest('/projects')

      setProjects(
        Array.isArray(response)
          ? response
          : response?.projects || []
      )
    } catch (err) {
      setError(err.message || 'Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const formatMoney = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`

  const getValue = (project, keys) => {
    for (const key of keys) {
      if (project[key] !== undefined && project[key] !== null) {
        return project[key]
      }
    }
    return 0
  }

  // OPEN EDIT PROJECT FORM
  const handleEditProject = (project) => {
    setEditingProject(project)

    setEditForm({
      name: project.name || '',
      clientName: project.clientName || '',
      clientEmail: project.clientEmail || '',
      clientPhone: project.clientPhone || '',
      description: project.description || '',
      budgetAmount: project.budgetAmount ?? 0,
      status: project.status || 'active',
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().slice(0, 10)
        : '',
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().slice(0, 10)
        : ''
    })
  }

  // SAVE PROJECT CHANGES
  const handleUpdateProject = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')

      await apiRequest(`/projects/${editingProject._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...editForm,
          budgetAmount: Number(editForm.budgetAmount)
        })
      })

      setEditingProject(null)
      await fetchProjects()
    } catch (err) {
      setError(err.message || 'Unable to update project.')
    } finally {
      setSaving(false)
    }
  }

  // OPEN ADD EXPENSE FORM
  const handleOpenExpense = (project) => {
    setExpenseProject(project)

    setExpenseForm({
      title: '',
      category: '',
      amount: '',
      description: '',
      department: ''
    })
  }

  // CREATE PROJECT EXPENSE
  const handleAddExpense = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')

      await apiRequest('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          ...expenseForm,
          amount: Number(expenseForm.amount),
          projectId: expenseProject._id
        })
      })

      setExpenseProject(null)
      await fetchProjects()
    } catch (err) {
      setError(err.message || 'Unable to add expense.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading projects...</p>
  }

  if (error && projects.length === 0) {
    return <p className="error-message">{error}</p>
  }

  if (projects.length === 0) {
    return (
      <div className="empty-projects">
        <FolderKanban size={42} />
        <h3>No projects yet</h3>
        <p>
          Projects will appear here automatically when you create
          a client invoice and link it to a project.
        </p>
      </div>
    )
  }

  // OVERALL PROJECT TOTALS
  const totalBudget = projects.reduce(
    (total, project) =>
      total + Number(getValue(project, ['budgetAmount', 'budget'])),
    0
  )

  const totalRevenue = projects.reduce(
    (total, project) =>
      total + Number(project.revenue || 0),
    0
  )

  const totalExpenses = projects.reduce(
    (total, project) =>
      total + Number(project.costs || 0),
    0
  )

  const totalProfit = totalRevenue - totalExpenses

  return (
    <div className="projects-manager">

      {/* ERROR MESSAGE */}
      {error && (
        <p className="error-message">{error}</p>
      )}

     
        {/* PROJECT SUMMARY */}
          <div className="projects-summary">

            <div className="project-summary-card">
              <span>Total Projects</span>
              <h3>{projects.length}</h3>
            </div>

            <div className="project-summary-card">
              <span>Total Project Budgets</span>
              <h3>{formatMoney(totalBudget)}</h3>
            </div>

            <div className="project-summary-card">
              <span>Total Revenue</span>
              <h3>{formatMoney(totalRevenue)}</h3>
            </div>

          </div>

      {/* PROJECT TABLE */}
      <div className="projects-list">

        <h3>All Projects</h3>

        <div className="projects-table-wrapper">

          <table className="projects-table">

            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Budget</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Remaining Budget</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              
{projects.map((project) => {
  const budget = Number(project.budgetAmount || 0)
  const revenue = Number(project.revenue || 0)
  const expenses = Number(project.costs || 0)

  // Remaining Budget = Project Budget - Expenses
  const remainingBudget = budget - expenses

  return (
    <tr key={project._id}>

      <td>
        <strong>{project.name || 'Untitled Project'}</strong>
      </td>

      <td>{project.clientName || '—'}</td>

      <td>{formatMoney(budget)}</td>

      <td>{formatMoney(revenue)}</td>

      <td>{formatMoney(expenses)}</td>

      <td>
        <span className={remainingBudget >= 0 ? 'profit-positive' : 'profit-negative'}>
          {formatMoney(remainingBudget)}
        </span>
      </td>

      <td>
        <span className="project-status">
          {project.status || 'Active'}
        </span>
      </td>

      <td>
        <div className="project-actions">

          <button
            type="button"
            onClick={() => handleEditProject(project)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleOpenExpense(project)}
          >
            Add Expense
          </button>

        </div>
      </td>

    </tr>
  )
})}
</tbody>
</table>
</div>
</div>


      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div className="project-modal-overlay">

          <div className="project-modal">

            <h3>Edit Project</h3>

            <form onSubmit={handleUpdateProject}>

              <label>Project Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value
                  })
                }
              />

              <label>Client Name</label>
              <input
                type="text"
                required
                value={editForm.clientName}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    clientName: e.target.value
                  })
                }
              />

              <label>Client Email</label>
              <input
                type="email"
                value={editForm.clientEmail}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    clientEmail: e.target.value
                  })
                }
              />

              <label>Client Phone</label>
              <input
                type="text"
                value={editForm.clientPhone}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    clientPhone: e.target.value
                  })
                }
              />

              <label>Project Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value
                  })
                }
              />

              <label>Project Budget (Rs.)</label>
              <input
                type="number"
                min="0"
                required
                value={editForm.budgetAmount}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    budgetAmount: e.target.value
                  })
                }
              />

              <label>Project Status</label>
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    status: e.target.value
                  })
                }
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>

              <label>Start Date</label>
              <input
                type="date"
                value={editForm.startDate}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    startDate: e.target.value
                  })
                }
              />

              <label>End Date</label>
              <input
                type="date"
                value={editForm.endDate}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    endDate: e.target.value
                  })
                }
              />

              <div className="project-modal-actions">

                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ADD PROJECT EXPENSE MODAL */}
      {expenseProject && (
        <div className="project-modal-overlay">

          <div className="project-modal">

            <h3>Add Project Expense</h3>

            <p>
              Project: <strong>{expenseProject.name}</strong>
            </p>

            <form onSubmit={handleAddExpense}>

              <label>Expense Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Website Hosting"
                value={expenseForm.title}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    title: e.target.value
                  })
                }
              />

              <label>Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Software, Hosting, Domain"
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    category: e.target.value
                  })
                }
              />

              <label>Amount (Rs.)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    amount: e.target.value
                  })
                }
              />

              <label>Department (Optional)</label>
              <input
                type="text"
                value={expenseForm.department}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    department: e.target.value
                  })
                }
              />

              <label>Description (Optional)</label>
              <textarea
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    description: e.target.value
                  })
                }
              />

              <div className="project-modal-actions">

                <button
                  type="button"
                  onClick={() => setExpenseProject(null)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button type="submit" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Expense'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}



// MAIN WORKSPACE PAGE
function WorkspacePage() {
  const { role, section } = useParams()

  const [notice, setNotice] = useState('')
  const [records, setRecords] = useState(sampleRows)
  const [recentActivity, setRecentActivity] = useState([])
const [loadingRecentActivity, setLoadingRecentActivity] = useState(false)
const [employeeRequests, setEmployeeRequests] = useState([])
  const [formType, setFormType] = useState('')
  const [saving, setSaving] = useState(false)
  const [employeeUsers, setEmployeeUsers] = useState([])
  const [editingEmployee, setEditingEmployee] = useState(null)
const [employeeEditForm, setEmployeeEditForm] = useState({
  name: '',
  email: '',
  department: ''
})
const [savingEmployee, setSavingEmployee] = useState(false)

  const [expenseRecords, setExpenseRecords] = useState([])
  const [loadingExpenses, setLoadingExpenses] = useState(false)
  const [deletingExpense, setDeletingExpense] = useState(null)
  const [updatingExpense, setUpdatingExpense] = useState('')

  const [invoiceRecords, setInvoiceRecords] = useState([])
  const [loadingInvoices, setLoadingInvoices] = useState(false)
  const [updatingInvoice, setUpdatingInvoice] = useState('')

  const [dashboardIncome, setDashboardIncome] = useState(0)
const [dashboardExpenses, setDashboardExpenses] = useState(0)
const [dashboardBalance, setDashboardBalance] = useState(0)
const [dashboardMonthlyData, setDashboardMonthlyData] = useState([])
const [dashboardYearlyData, setDashboardYearlyData] = useState([])
const [dashboardDepartmentData, setDashboardDepartmentData] = useState([])
const [dashboardEmployees, setDashboardEmployees] = useState(0)
const [loadingDashboard, setLoadingDashboard] = useState(false)
const [dashboardFinancialSummary, setDashboardFinancialSummary] = useState({
  totalIncome: 0,
  totalExpenses: 0,
  totalBalance: 0,
  employeeCount: 0
})

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    vendor: '',
    amount: '',
    category: '',
    description: '',
    dueDate: '',
  })

  const info = pageInfo[section]
  const isEmployee = role === 'employee'
  const isFinance = role === 'finance_manager'
  const isAdmin = role === 'company_admin'
  const canSeeFinance = isFinance || isAdmin
  const allowedSections = roleAccess[role] || []
  const formatMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-PK')}`

  
  // LOAD REAL DASHBOARD RECENT ACTIVITY
// LOAD REAL EMPLOYEE COUNT FOR ADMIN DASHBOARD
useEffect(() => {
  if (role !== 'company_admin' || section !== 'dashboard') return

  let cancelled = false

  const loadEmployeeCount = async () => {
    try {
      const data = await apiRequest('/users')
      const users = data.users || []

      if (!cancelled) {
        setDashboardFinancialSummary((previous) => ({
          ...previous,
          employeeCount: users.filter(
            (user) => user.role === 'employee'
          ).length
        }))
      }
    } catch (error) {
      console.error('Unable to load employee count:', error)
    }
  }

  loadEmployeeCount()

  return () => {
    cancelled = true
  }
}, [role, section])
useEffect(() => {
  if (section !== 'dashboard') return

  let cancelled = false

  const loadRecentActivity = async () => {
    try {
      setLoadingRecentActivity(true)

      const requestsData = await apiRequest('/requests')
const allRequests = requestsData.requests || []

// Save all requests for the employee dashboard cards and activity table.
if (!cancelled) {
  setEmployeeRequests(allRequests)
}

const requestRows = allRequests.map((item) => ({
        id: item._id,
        description: item.title,
        type: `${item.type} request`,
        amount: item.amount || 0,
        date: item.createdAt,
        status: item.status || 'pending'
      }))

      let activity = [...requestRows]

      // Finance Managers and Company Admins also see
      // actual expense and invoice records.
      if (role === 'finance_manager' || role === 'company_admin') {
        
       const [expensesData, invoicesData, budgetsData] = await Promise.all([
         apiRequest('/expenses'),
         apiRequest('/invoices'),
         apiRequest('/budgets')
       ])


        const expenses = expensesData.expenses || []
const invoices = invoicesData.invoices || []

// Only PAID client invoices count as income
const paidClientInvoices = invoices.filter(
  (invoice) =>
    invoice.type === 'client' &&
    invoice.status === 'paid'
)

// Approved expenses count as expenses
const approvedExpenses = expenses.filter(
  (expense) => expense.status === 'approved'
)

// Financial summary
const totalIncome = paidClientInvoices.reduce(
  (total, invoice) => total + Number(invoice.amount || 0),
  0
)

const totalExpenses = approvedExpenses.reduce(
  (total, expense) => total + Number(expense.amount || 0),
  0
)

if (!cancelled) {
  setDashboardFinancialSummary((previous) => ({
    ...previous,
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses
  }))
}

// Use the current year for the monthly chart
const currentYear = new Date().getFullYear()

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const monthlyData = monthNames.map((month, index) => {
  const monthIncome = paidClientInvoices
    .filter((invoice) => {
      const date = new Date(invoice.invoiceDate || invoice.createdAt)
      return date.getFullYear() === currentYear &&
        date.getMonth() === index
    })
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0)

  const monthExpenses = approvedExpenses
    .filter((expense) => {
      const date = new Date(expense.createdAt)
      return date.getFullYear() === currentYear &&
        date.getMonth() === index
    })
    .reduce((total, expense) => total + Number(expense.amount || 0), 0)

  return {
    month,
    revenue: monthIncome,
    expenses: monthExpenses
  }
})

if (!cancelled) {
  setDashboardMonthlyData(monthlyData)
}

// Yearly financial data
const yearSet = new Set([
  ...paidClientInvoices.map(
    (invoice) =>
      new Date(invoice.invoiceDate || invoice.createdAt).getFullYear()
  ),
  ...approvedExpenses.map(
    (expense) => new Date(expense.createdAt).getFullYear()
  )
])

const yearlyData = [...yearSet]
  .filter((year) => Number.isFinite(year))
  .sort((a, b) => a - b)
  .map((year) => {
    const revenue = paidClientInvoices
      .filter(
        (invoice) =>
          new Date(invoice.invoiceDate || invoice.createdAt).getFullYear() === year
      )
      .reduce((total, invoice) => total + Number(invoice.amount || 0), 0)

    const expenseTotal = approvedExpenses
      .filter(
        (expense) => new Date(expense.createdAt).getFullYear() === year
      )
      .reduce((total, expense) => total + Number(expense.amount || 0), 0)

    return {
      year: String(year),
      revenue,
      expenses: expenseTotal
    }
  })

if (!cancelled) {
  setDashboardYearlyData(yearlyData)
}



// ACTUAL DEPARTMENT SPENDING AND SAVED DEPARTMENT BUDGETS

// Get the current month in YYYY-MM format
const currentMonth = new Date().toISOString().slice(0, 7)

// Read actual department budgets saved in MongoDB
const departmentBudgetData = (budgetsData.budgets || [])
  .filter((item) =>
    item.type === 'department' &&
    String(item.month).slice(0, 7) === currentMonth
  )
  .map((item) => ({
    department: String(item.name || '').trim(),
    budget: Number(item.amount || 0)
  }))
  .filter((item) => item.department)

// Calculate actual spending from approved expenses
const departmentTotals = {}

approvedExpenses.forEach((expense) => {
  const originalDepartment = String(
    expense.department || ''
  ).trim()

  // Group expenses without a department under General / Administration
  const department =
    !originalDepartment ||
    originalDepartment.toLowerCase() === 'unassigned'
      ? 'General / Administration'
      : originalDepartment

  departmentTotals[department] =
    (departmentTotals[department] || 0) +
    Number(expense.amount || 0)
})

// Include departments with saved budgets or actual approved expenses
const allDepartments = new Set([
  ...departmentBudgetData.map((item) => item.department),
  ...Object.keys(departmentTotals)
])

// Combine actual spending with saved budgets
const dashboardDepartmentData = [...allDepartments]
  .map((department) => {
    const existingBudget = departmentBudgetData.find(
      (item) =>
        item.department.toLowerCase() === department.toLowerCase()
    )

    return {
      department,
      spent: departmentTotals[department] || 0,
      budget: existingBudget?.budget || 0
    }
  })
  .sort((a, b) => b.spent - a.spent)

if (!cancelled) {
  setDashboardDepartmentData(dashboardDepartmentData)
}



        const expenseRows = (expensesData.expenses || []).map((item) => ({
          id: item._id,
          description: item.title,
          type: 'Expense',
          amount: item.amount || 0,
          date: item.createdAt,
          status: item.status || 'pending'
        }))

        const invoiceRows = (invoicesData.invoices || []).map((item) => ({
          id: item._id,
          description: item.invoiceNumber || item.vendor,
          type: 'Invoice',
          amount: item.amount || 0,
          date: item.createdAt,
          status: item.status || 'pending'
        }))

        activity = [...activity, ...expenseRows, ...invoiceRows]
      }

      activity.sort(
        (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
      )

      if (!cancelled) {
        setRecentActivity(activity.slice(0, 8))
      }
    } catch (error) {
      if (!cancelled) {
        setNotice(error.message || 'Unable to load recent activity.')
      }
    } finally {
      if (!cancelled) {
        setLoadingRecentActivity(false)
      }
    }
  }

  loadRecentActivity()

  return () => {
    cancelled = true
  }
}, [section, role])

  // LOAD EMPLOYEE AND FINANCE MANAGER ACCOUNTS
useEffect(() => {
  if (role !== 'company_admin' || !['users', 'managers'].includes(section)) return

  let cancelled = false

  const loadUsers = async () => {
    try {
      setNotice('')

      const data = await apiRequest('/users')

      if (cancelled) return

      const users = data.users || []

      // Keep complete employee information for edit/remove actions
      setEmployeeUsers(
        users.filter((user) => user.role === 'employee')
      )

      // Keep existing table rows as arrays
      setRecords((previous) => ({
        ...previous,

        users: users
          .filter((user) => user.role === 'employee')
          .map((user) => [
            user.name,
            'Employee',
            user.email,
            user.department || 'Not assigned',
            user.active === false ? 'Inactive' : 'Active'
          ]),

        managers: users
          .filter((user) => user.role === 'finance_manager')
          .map((user) => [
            user.name,
            user.email,
            'Finance Manager',
            user.active === false ? 'Inactive' : 'Active'
          ])
      }))

    } catch (error) {
      if (!cancelled) {
        setNotice(error.message || 'Unable to load accounts.')
      }
    }
  }

  loadUsers()

  return () => {
    cancelled = true
  }
}, [role, section])

  // LOAD INVOICES
  useEffect(() => {
    if (section !== 'invoices' || !canSeeFinance) return

    let cancelled = false
    const loadInvoices = async () => {
      try {
        setLoadingInvoices(true)
        setNotice('')
        const data = await apiRequest('/invoices')
        if (!cancelled) setInvoiceRecords(data.invoices || [])
      } catch (error) {
        if (!cancelled) setNotice(error.message || 'Unable to load invoices.')
      } finally {
        if (!cancelled) setLoadingInvoices(false)
      }
    }

    loadInvoices()
    return () => { cancelled = true }
  }, [section, role, canSeeFinance])

  const openCreateForm = (type) => {
    setFormType(type)
    setNotice('')
    setFormData({
      name: '', email: '', password: '', title: '',
      vendor: '', amount: '', category: '', description: '', dueDate: '',
    })
  }
  // EDIT EMPLOYEE
const handleEditEmployee = (employee) => {
  setEditingEmployee(employee)
  setEmployeeEditForm({
    name: employee.name || '',
    email: employee.email || '',
    department: employee.department || ''
  })
  setNotice('')
}

// SAVE EMPLOYEE CHANGES
const handleSaveEmployee = async (event) => {
  event.preventDefault()

  try {
    setSavingEmployee(true)
    setNotice('')

    const response = await apiRequest(`/users/${editingEmployee._id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: employeeEditForm.name.trim(),
        email: employeeEditForm.email.trim(),
        department: employeeEditForm.department
      })
    })

    const updatedEmployee = response.user

    setEmployeeUsers((previous) =>
      previous.map((user) =>
        user._id === editingEmployee._id
          ? { ...user, ...updatedEmployee }
          : user
      )
    )

    setRecords((previous) => ({
      ...previous,
      users: previous.users.map((row, index) => {
        const employee = employeeUsers[index]

        if (employee?._id !== editingEmployee._id) return row

        return [
          updatedEmployee.name,
          'Employee',
          updatedEmployee.email,
          updatedEmployee.department || 'Not assigned',
          updatedEmployee.active === false ? 'Inactive' : 'Active'
        ]
      })
    }))

    setEditingEmployee(null)
    setNotice('Employee updated successfully.')
  } catch (error) {
    setNotice(error.message || 'Unable to update employee.')
  } finally {
    setSavingEmployee(false)
  }
}

// REMOVE / REACTIVATE EMPLOYEE
const handleToggleEmployee = async (employee) => {
  const currentlyActive = employee.active !== false
  const nextActive = !currentlyActive

  const confirmed = window.confirm(
    nextActive
      ? `Reactivate ${employee.name}?`
      : `Remove ${employee.name} from active employees?`
  )

  if (!confirmed) return

  try {
    setNotice('')

    await apiRequest(`/users/${employee._id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active: nextActive })
    })

    setEmployeeUsers((previous) =>
      previous.map((user) =>
        user._id === employee._id
          ? { ...user, active: nextActive }
          : user
      )
    )

    setRecords((previous) => ({
      ...previous,
      users: previous.users.map((row, index) => {
        const currentEmployee = employeeUsers[index]

        if (currentEmployee?._id !== employee._id) return row

        return [
          row[0],
          row[1],
          row[2],
          row[3],
          nextActive ? 'Active' : 'Inactive'
        ]
      })
    }))

    setNotice(
      nextActive
        ? 'Employee reactivated successfully.'
        : 'Employee removed successfully.'
    )
  } catch (error) {
    setNotice(error.message || 'Unable to update employee status.')
  }
}

  const closeCreateForm = () => {
    if (!saving) setFormType('')
  }

  const handleExpenseStatus = async (id, status) => {
    try {
      setUpdatingExpense(id)
      setNotice('')
      const data = await apiRequest(`/expenses/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setExpenseRecords((previous) => previous.map((expense) =>
        expense._id === id ? { ...expense, ...(data.expense || {}), status } : expense
      ))
      setNotice(status === 'approved' ? 'Expense approved successfully.' : 'Expense rejected successfully.')
    } catch (error) {
      setNotice(error.message || 'Unable to update expense status.')
    } finally {
      setUpdatingExpense('')
    }
  }

  const handleExpensePaymentStatus = async (id, paymentStatus) => {
  try {
    setUpdatingExpense(id)
    setNotice('')

    const data = await apiRequest(
      `/expenses/${id}/payment-status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ paymentStatus }),
      }
    )

    setExpenseRecords((previous) =>
      previous.map((expense) =>
        expense._id === id
          ? { ...expense, ...(data.expense || {}), paymentStatus }
          : expense
      )
    )

    setNotice(
      paymentStatus === 'paid'
        ? 'Expense marked as paid successfully.'
        : 'Expense marked as unpaid successfully.'
    )
  } catch (error) {
    setNotice(error.message || 'Unable to update payment status.')
  } finally {
    setUpdatingExpense('')
  }
}

const handleDeleteExpense = async (expenseId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this expense? This action cannot be undone.'
  )

  if (!confirmed) return

  try {
    setDeletingExpense(expenseId)
    setNotice('')

    await apiRequest(`/expenses/${expenseId}`, {
      method: 'DELETE'
    })

    // Refresh expenses after deletion
    const data = await apiRequest('/expenses')
    setExpenseRecords(data.expenses || [])

    setNotice('Expense deleted successfully.')
  } catch (error) {
    setNotice(error.message || 'Unable to delete expense.')
  } finally {
    setDeletingExpense('')
  }
}

  const handleInvoiceStatus = async (id, status) => {
    try {
      setUpdatingInvoice(id)
      setNotice('')
      const data = await apiRequest(`/invoices/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setInvoiceRecords((previous) => previous.map((invoice) =>
        invoice._id === id ? { ...invoice, ...(data.invoice || {}), status } : invoice
      ))
      setNotice('Invoice status updated successfully.')
    } catch (error) {
      setNotice(error.message || 'Unable to update invoice status.')
    } finally {
      setUpdatingInvoice('')
    }
  }

  const handleCreateRecord = async (event) => {
    event.preventDefault()
    setNotice('')

    try {
      setSaving(true)

      if (formType === 'employee' || formType === 'manager') {
        const email = formData.email.trim().toLowerCase()
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
          setNotice('Please enter a valid email address.')
          return
        }
        if (formData.password.length < 8) {
          setNotice('Password must contain at least 8 characters.')
          return
        }
        if (formType === 'employee' && !formData.department) {
          setNotice('Please select an employee department.')
          return
        }

        const data = await apiRequest('/users', {
          method: 'POST',
         body: JSON.stringify({
        name: formData.name.trim(),
        email,
        password: formData.password,
        role: formType === 'employee' ? 'employee' : 'finance_manager',
        department: formType === 'employee' ? formData.department : '',
        }),
        })

        const user = data.user
        const row = formType === 'employee'
          ? [user.name, 'Employee', user.email, 'Active']
          : [user.name, user.email, 'Finance Manager', 'Active']
        const key = formType === 'employee' ? 'users' : 'managers'

        setRecords((previous) => ({ ...previous, [key]: [...previous[key], row] }))
        setNotice(data.message || 'Account created successfully.')
        setFormType('')
        return
      }

      const amount = Number(formData.amount)
      if (['expense', 'invoice'].includes(formType) && (!Number.isFinite(amount) || amount <= 0)) {
        setNotice('Please enter an amount greater than zero.')
        return
      }

      if (formType === 'expense') {
        const data = await apiRequest('/expenses', {
          method: 'POST',
          body: JSON.stringify({
            title: formData.title.trim(),
            category: formData.category.trim(),
            amount,
            description: formData.description.trim(),
          }),
        })
        if (data.expense) {
          setExpenseRecords((previous) => [data.expense, ...previous])
        } else {
          const refreshed = await apiRequest('/expenses')
          setExpenseRecords(refreshed.expenses || [])
        }
        setNotice(data.message || 'Expense saved successfully.')
        setFormType('')
        return
      }

     
if (formType === 'invoice') {
  const invoiceType = formData.invoiceType || 'vendor'

  if (
    invoiceType === 'client' &&
    (!formData.clientName?.trim() ||
      !formData.projectName?.trim())
  ) {
    setNotice('Please enter the client name and project name.')
    return
  }

  if (
    invoiceType === 'client' &&
    (!Number.isFinite(Number(formData.projectBudget)) ||
      Number(formData.projectBudget) < 0)
  ) {
    setNotice('Please enter a valid project budget.')
    return
  }

  if (
    invoiceType === 'vendor' &&
    !formData.vendor?.trim()
  ) {
    setNotice('Please enter the vendor name.')
    return
  }

  const invoicePayload = {
    invoiceNumber: `INV-${Date.now()}`,
    type: invoiceType,
    amount,
    dueDate: formData.dueDate || null,
  }

  if (invoiceType === 'vendor') {
    invoicePayload.vendor = formData.vendor.trim()
  } else {
    invoicePayload.clientName = formData.clientName.trim()
    invoicePayload.clientEmail = formData.clientEmail?.trim() || ''
    invoicePayload.clientPhone = formData.clientPhone?.trim() || ''
    invoicePayload.projectName = formData.projectName.trim()
    invoicePayload.projectBudget = Number(formData.projectBudget)
  }

  const data = await apiRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoicePayload),
  })

  if (data.invoice) {
    setInvoiceRecords((previous) => [
      data.invoice,
      ...previous,
    ])
  } else {
    const refreshed = await apiRequest('/invoices')
    setInvoiceRecords(refreshed.invoices || [])
  }

  setNotice(data.message || 'Invoice saved successfully.')
  setFormType('')
}

    } catch (error) {
      setNotice(error.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!info) {
    return <div className="workspace-panel"><h2>Page not found</h2></div>
  }

  if (!allowedSections.includes(section)) {
    return (
      <div className="workspace-panel">
        <h2>Access restricted</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    )
  }

  const [title, description] = info
  const canSubmit = isEmployee && ['expenses', 'invoices'].includes(section)
  const rows = records[section]

  const columns =
    section === 'users' ? ['NAME', 'ROLE', 'EMAIL', 'DEPARTMENT', 'STATUS']
      : section === 'managers' ? ['NAME', 'EMAIL', 'ROLE', 'STATUS']
        : section === 'requests' ? ['REQUEST', 'DATE', 'AMOUNT', 'STATUS']
          : section === 'approvals' ? ['EMPLOYEE', 'REQUEST', 'AMOUNT', 'STATUS']
            : section === 'transactions' ? ['DESCRIPTION', 'TYPE', 'AMOUNT', 'STATUS']
              : ['DESCRIPTION', 'CATEGORY', 'AMOUNT', 'STATUS']
  return (
    <>
      <div className="workspace-heading">
        <div>
          <span className="workspace-eyebrow">{(role || '').replace(/_/g, ' ').toUpperCase()} WORKSPACE</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {isAdmin && section === 'users' && (
          <button className="workspace-primary-button" onClick={() => openCreateForm('employee')}>
            <Plus size={17} /> Add Employee
          </button>
        )}
        {isAdmin && section === 'managers' && (
          <button className="workspace-primary-button" onClick={() => openCreateForm('manager')}>
            <Plus size={17} /> Add Finance Manager
          </button>
        )}
        {canSeeFinance && ['invoices', 'expenses'].includes(section) && (
          <button
            className="workspace-primary-button"
            onClick={() => openCreateForm(section === 'expenses' ? 'expense' : 'invoice')}
          >
            <Plus size={17} /> Create New
          </button>
        )}
      </div>

      {notice && <p className="workspace-success" role="status">{notice}</p>}

      {formType && (
        <CreateRecordModal
          type={formType}
          onClose={closeCreateForm}
          onSubmit={handleCreateRecord}
          formData={formData}
          setFormData={setFormData}
          saving={saving}
        />
      )}

      {/* DASHBOARD */}
      {section === 'dashboard' && (
        <>
          <div className="workspace-stats">
            {isEmployee ? (
              <>
               <SummaryCard
                  title="My expenses"
                 value={employeeRequests.filter(
                   (item) => item.type === 'expense'
                 ).length.toString()}
                 icon={Receipt}
                 color="purple"
               />

               <SummaryCard
                 title="Pending requests"
                 value={employeeRequests.filter(
                   (item) => item.status === 'pending'
                 ).length.toString()}
                 icon={Clock}
                 color="orange"
               />

               <SummaryCard
                 title="Approved"
                 value={employeeRequests.filter(
                   (item) => item.status === 'approved'
                 ).length.toString()}
                 icon={CheckCircle}
                  color="green"
               />
             </>
           ) : (
           <>
  <SummaryCard
    title="Net balance"
    value={formatMoney(dashboardFinancialSummary.totalBalance)}
    icon={Wallet}
    color="purple"
  />

  <SummaryCard
    title="Total income"
    value={formatMoney(dashboardFinancialSummary.totalIncome)}
    icon={TrendingUp}
    color="green"
  />

  <SummaryCard
    title="Total expenses"
    value={formatMoney(dashboardFinancialSummary.totalExpenses)}
    icon={Receipt}
    color="orange"
  />

  <SummaryCard
    title="Pending approvals"
    value={employeeRequests.filter(
      (item) => item.status === 'pending'
    ).length.toString()}
    icon={Clock}
    color="blue"
  />

  {isAdmin && (
    <SummaryCard
      title="Employees"
      value={dashboardFinancialSummary.employeeCount.toString()}
      icon={Users}
      color="purple"
    />
  )}
</>
)}
</div>

          {canSeeFinance && (
           <FinancialCharts
             monthlyData={dashboardMonthlyData}
             yearlyData={dashboardYearlyData}
             departmentData={dashboardDepartmentData}
           />
         )}

          <div className="workspace-panel">
  <div className="workspace-panel-heading">
    <div>
      <h3>
        {isEmployee
          ? 'My Recent Activity'
          : 'Recent Financial Activity'}
      </h3>

      <p>
        {isEmployee
          ? 'Your latest submitted expense and invoice requests.'
          : 'Latest company requests, expenses and invoices.'}
      </p>
    </div>
  </div>

 {loadingRecentActivity ? (
  <p>Loading recent activity...</p>
) : isEmployee ? (
  <DataTable
    rows={employeeRequests.map((item) => [
      item.title || 'Untitled request',
      item.type || '—',
      item.amount
        ? `Rs. ${Number(item.amount).toLocaleString()}`
        : '—',
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : '—',
      (item.status || 'pending').replace(/_/g, ' ')
    ])}
    columns={[
      'REQUEST',
      'TYPE',
      'AMOUNT',
      'DATE',
      'STATUS'
    ]}
  />
) : (
  <DataTable
    rows={recentActivity.map((item) => [
      item.description || '—',
      item.type || '—',
      `Rs. ${Number(item.amount || 0).toLocaleString()}`,
      item.date
        ? new Date(item.date).toLocaleDateString()
        : '—',
      (item.status || 'pending').replace(/_/g, ' ')
    ])}
    columns={[
      'DESCRIPTION',
      'TYPE',
      'AMOUNT',
      'DATE',
      'STATUS'
    ]}
  />
)}
</div>

          
          
{canSeeFinance && (
  <div className="workspace-panel">
    <h3>Department Spending Overview</h3>
    <p>Department expenses compared with allocated budgets.</p>

    {dashboardDepartmentData.map(({ department, spent, budget }) => (
      <div className="workspace-budget" key={department}>
        <div className="workspace-budget-info">
          <strong>{department}</strong>
          <span>
            {formatMoney(spent)}
            {budget > 0 ? ` / ${formatMoney(budget)}` : ''}
          </span>
        </div>

        <div className="workspace-budget-track">
          <span
            style={{
              width: `${budget > 0 ? Math.min((spent / budget) * 100, 100) : 0}%`
            }}
          />
        </div>
      </div>
    ))}
  </div>
)}


</>
)}

      {/* EMPLOYEE REQUEST SUBMISSION FORMS */}
      {canSubmit && ['expenses', 'invoices'].includes(section) && <RequestForm section={section} />}

      {/* EMPLOYEE REQUEST TRACKING */}
      {isEmployee && section === 'requests' && <MyRequests />}
      {/* COMPANY ADMIN EMPLOYEE MANAGEMENT */}

      {/* FINANCE MANAGER AND COMPANY ADMIN APPROVALS */}
      {section === 'approvals' && canSeeFinance && (
      <ApprovalsTable role={role} />
            )}
      
      {/* COMPANY TRANSACTIONS */}
      {section === 'transactions' && canSeeFinance && (
        <TransactionsManager />
      )}

      {/* FINANCE EXPENSE RECORDS */}
{section === 'expenses' && canSeeFinance && (
  <ExpenseRecordsTable
    expenses={expenseRecords}
    loading={loadingExpenses}
    canManage={canSeeFinance}
    onPaymentStatusChange={handleExpensePaymentStatus}
    updatingExpense={updatingExpense}
    onDeleteExpense={handleDeleteExpense}
    deletingExpense={deletingExpense}
  />
)}
      {section === 'projects' && <ProjectsManager />}
      {/* FINANCE INVOICE RECORDS */}
      {section === 'invoices' && canSeeFinance && (
        <InvoiceRecordsTable
          invoices={invoiceRecords}
          loading={loadingInvoices}
          onStatusChange={handleInvoiceStatus}
          updatingInvoice={updatingInvoice}
        />
      )}

      {/* ADMINISTRATION / OTHER TABLES */}

{rows && !canSubmit && ![
  'expenses',
  'invoices',
  'requests',
  'approvals',
  'transactions',
  'profile',
  'settings',
  'company',
  'dashboard'
].includes(section) && (

        <div className="workspace-panel">
          <div className="workspace-panel-heading">
            <div>
              <h3>{title} records</h3>
              <p>
                {['users', 'managers'].includes(section)
                  ? 'Accounts retrieved from your company database.'
                  : 'Example records for the BudgetWise frontend preview.'}
              </p>
            </div>
          </div>
          <DataTable
  rows={rows}
  columns={columns}
  employeeRecords={section === 'users' ? employeeUsers : []}
  onEditEmployee={section === 'users' ? handleEditEmployee : undefined}
  onToggleEmployee={section === 'users' ? handleToggleEmployee : undefined}
/>
        </div>
      )}

       {/* BUDGET MANAGEMENT */}
        {section === 'budgets' && canSeeFinance && (
         <BudgetManager />
        )}

      {/* DYNAMIC REPORTS */}
{section === 'reports' && canSeeFinance && (
  <ReportsManager />
)}
      {/* PROFILE */}
      {section === 'profile' && <ProfileForm />}

      {/* SETTINGS AND COMPANY DETAILS */}
      {['settings', 'company'].includes(section) && (
        <div className="workspace-panel">
          <h3>{section === 'company' ? 'Company information' : 'Workspace settings'}</h3>
          <form
            className="workspace-form"
            onSubmit={(event) => {
              event.preventDefault()
              setNotice('These settings will be connected to the backend separately.')
            }}
          >
            <label>
              {section === 'company' ? 'Company name' : 'Workspace name'}
              <input defaultValue="Acme Corporation" />
            </label>
            {section === 'company' && (
              <label>
                Company address
                <input defaultValue="Karachi, Pakistan" />
              </label>
            )}
            <button className="workspace-primary-button" type="submit">Save changes</button>
          </form>
        </div>
      )}

{editingEmployee && (
  <div className="workspace-modal-overlay">
    <div className="workspace-modal">
      <h3>Edit Employee</h3>

      <form onSubmit={handleSaveEmployee}>
        <label>
          Employee Name
          <input
            value={employeeEditForm.name}
            onChange={(e) =>
              setEmployeeEditForm({
                ...employeeEditForm,
                name: e.target.value
              })
            }
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={employeeEditForm.email}
            onChange={(e) =>
              setEmployeeEditForm({
                ...employeeEditForm,
                email: e.target.value
              })
            }
            required
          />
        </label>

        <label>
          Department
          <select
            value={employeeEditForm.department}
            onChange={(e) =>
              setEmployeeEditForm({
                ...employeeEditForm,
                department: e.target.value
              })
            }
            required
          >
            <option value="">Select Department</option>
            <option value="Marketing">Marketing</option>
            <option value="Development & IT">Development & IT</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <div className="workspace-form-actions">
          <button
            type="button"
            onClick={() => setEditingEmployee(null)}
          >
            Cancel
          </button>

          <button type="submit" disabled={savingEmployee}>
            {savingEmployee ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </>

  )
}

export default WorkspacePage
