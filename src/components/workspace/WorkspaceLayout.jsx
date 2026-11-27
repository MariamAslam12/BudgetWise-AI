
import AIChatbot from '../dashboard/AIChatbot'
import '../../pages/Dashboard.css'
import { useState, useEffect, useCallback } from 'react'
import {
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  Navigate,
} from 'react-router-dom'

import {
  BarChart3,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
} from 'lucide-react'

import { roleMenus, roleNames } from '../../data/navigation'
import { apiRequest } from '../../services/api'

const allowedRoles = [
  'employee',
  'finance_manager',
  'company_admin',
]

function WorkspaceLayout() {
  const { role } = useParams()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsLoading, setNotificationsLoading] = useState(false)

  // Read logged-in user
  let user = null

  try {
    user = JSON.parse(
      localStorage.getItem('budgetwiseUser') || 'null'
    )
  } catch {
    user = null
  }

  // Check login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check valid role
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  // Check saved account role
  if (!allowedRoles.includes(user.role)) {
    localStorage.removeItem('budgetwiseUser')
    return <Navigate to="/login" replace />
  }

  // Prevent users from opening another role's workspace
  if (user.role !== role) {
    return (
      <Navigate
        to={`/${user.role}/dashboard`}
        replace
      />
    )
  }

  const menuItems = roleMenus[role] || []
  const roleName = roleNames[role] || 'Workspace User'
  const companyName = user.companyName || 'Acme Corporation'
  const userName = user.name || 'Workspace User'

  // Generate initials
  const getInitials = (name) => {
    return String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setNotificationsLoading(true)

      const data = await apiRequest('/notifications')

      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Notifications error:', error)
    } finally {
      setNotificationsLoading(false)
    }
  }, [])

  // Load notifications and refresh every 10 seconds
  useEffect(() => {
    fetchNotifications()

    const interval = setInterval(fetchNotifications, 10000)

    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Mark one notification as read
  const markNotificationRead = async (notification) => {
  try {
    if (!notification.isRead) {
      await apiRequest(`/notifications/${notification._id}/read`, {
        method: 'PATCH',
      })

      await fetchNotifications()
    }

    setDropdownOpen(false)

    // Open Approvals for finance managers and company admins
    if (
      ['finance_manager', 'company_admin'].includes(role) &&
      notification.request
    ) {
      navigate(`/${role}/approvals`)
    }
  } catch (error) {
    console.error('Notification click error:', error)
  }
}

  // Sign out
  const logout = () => {
    localStorage.removeItem('budgetwiseUser')
    navigate('/login', { replace: true })
  }

  return (
    <div className="workspace">

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <div
          className="workspace-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`workspace-sidebar ${menuOpen ? 'open' : ''}`}
      >
        <div className="workspace-brand">

          <div className="workspace-logo">
            <BarChart3 size={23} />
          </div>

          <span>
            Budget<span>Wise</span>
          </span>

          <button
            type="button"
            className="workspace-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>

        </div>

        {/* Company information */}
        <div className="workspace-company">

          <div className="workspace-company-avatar">
            {getInitials(companyName)}
          </div>

          <div>
            <strong>{companyName}</strong>
            <small>{roleName}</small>
          </div>

        </div>

        <p className="workspace-label">
          WORKSPACE
        </p>

        {/* Role-based navigation */}
        <nav className="workspace-nav">

          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.section}
                to={`/${role}/${item.section}`}
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `workspace-nav-link ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}

        </nav>

        {/* Sidebar bottom */}
        <div className="workspace-sidebar-bottom">

          <button
            type="button"
            className="workspace-logout"
            onClick={logout}
          >
            <LogOut size={18} />
            Sign out
          </button>

        </div>
      </aside>

      {/* Main workspace */}
      <main className="workspace-main">

        <header className="workspace-topbar">

          <button
            type="button"
            className="workspace-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={23} />
          </button>

          {/* Search */}
          <div className="workspace-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search..."
            />
          </div>

          {/* Topbar right */}
          <div className="workspace-topbar-right">

            <div className="workspace-notification-wrapper">

              <button
                type="button"
                className="workspace-notification"
                aria-label="Notifications"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {dropdownOpen && (
                <div className="workspace-notification-dropdown">

                  <div className="workspace-notification-header">
                    <strong>Notifications</strong>

                    <span>{unreadCount} unread</span>
                  </div>

                  {unreadCount > 0 && (
  <button
    type="button"
    className="workspace-mark-all"
    onClick={async () => {
      try {
        await apiRequest('/notifications/read-all', {
          method: 'PATCH'
        })

        setNotifications(prev =>
          prev.map(notification => ({
            ...notification,
            isRead: true
          }))
        )

        setUnreadCount(0)
      } catch (error) {
        console.error('Could not mark all notifications as read:', error)
      }
    }}
  >
    Mark all as read
  </button>
)}

                  <div className="workspace-notification-list">

                    {notificationsLoading && notifications.length === 0 ? (
                      <p className="workspace-notification-empty">
                        Loading notifications...
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="workspace-notification-empty">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          type="button"
                          key={notification._id}
                          className={`workspace-notification-item ${
                            notification.isRead ? '' : 'unread'
                          }`}
                          onClick={() =>
                            markNotificationRead(notification)
                          }
                        >
                          <strong>{notification.title}</strong>

                          <p>{notification.message}</p>

                          <small>
                            {notification.createdAt
                              ? new Date(notification.createdAt).toLocaleString()
                              : ''}
                          </small>
                        </button>
                      ))
                    )}

                  </div>
                </div>
              )}

            </div>

            {/* User profile */}
            <div className="workspace-profile">

              <div className="workspace-profile-avatar">
                {getInitials(userName)}
              </div>

              <div>
                <strong>{userName}</strong>
                <small>{roleName}</small>
              </div>

            </div>

          </div>

        </header>

        {/* Page content */}
        <div className="workspace-page">
          <Outlet />
        </div>

        <AIChatbot />

      </main>
    </div>
  )
}

export default WorkspaceLayout
