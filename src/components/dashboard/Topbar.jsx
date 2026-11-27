
import { useEffect, useState, useCallback } from 'react'
import {
  Menu,
  Search,
  Bell,
  X,
  CheckCheck,
  RefreshCw
} from 'lucide-react'

import { apiRequest } from '../../services/api'

function Topbar({ role, onMenuClick }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const titles = {
    employee: 'Employee Workspace',
    finance_manager: 'Finance Management',
    company_admin: 'Company Administration'
  }

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiRequest('/notifications')

      setNotifications(
        Array.isArray(response?.notifications)
          ? response.notifications
          : []
      )

      setUnreadCount(Number(response?.unreadCount) || 0)

    } catch (err) {
      console.error('Notification error:', err)
      setError(err.message || 'Could not load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()

    const interval = setInterval(fetchNotifications, 10000)

    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, {
        method: 'PATCH'
      })

      await fetchNotifications()

    } catch (err) {
      console.error('Mark notification error:', err)
      setError('Could not mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await apiRequest('/notifications/read-all', {
        method: 'PATCH'
      })

      await fetchNotifications()

    } catch (err) {
      console.error('Mark all notifications error:', err)
      setError('Could not mark all as read')
    }
  }

  return (
    <header className="dashboard-topbar">

      <button
        type="button"
        className="dashboard-menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={23} />
      </button>

      <div className="topbar-heading">
        <h2>{titles[role] || 'Dashboard'}</h2>
        <p>Manage your company workspace.</p>
      </div>

      <div className="topbar-actions">

        <div className="dashboard-search">
          <Search size={18} />
          <input placeholder="Search..." />
        </div>

        {/* NOTIFICATION BUTTON */}
        <div className="notification-wrapper">

          <button
            type="button"
            className={`notification-button ${dropdownOpen ? 'active' : ''}`}
            aria-label="Toggle notifications"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}
          {dropdownOpen && (
            <div className="notification-dropdown">

              <div className="notification-dropdown-header">
                <div>
                  <h3>Notifications</h3>
                  <p>{unreadCount} unread notifications</p>
                </div>

                <div className="notification-header-actions">

                  <button
                    type="button"
                    onClick={fetchNotifications}
                    aria-label="Refresh notifications"
                    title="Refresh"
                  >
                    <RefreshCw size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDropdownOpen(false)}
                    aria-label="Close notifications"
                  >
                    <X size={18} />
                  </button>

                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  <CheckCheck size={15} />
                  Mark all as read
                </button>
              )}

              {error && (
                <p className="notification-error">{error}</p>
              )}

              <div className="notification-list">

                {loading && notifications.length === 0 ? (
                  <p className="notification-empty">
                    Loading notifications...
                  </p>
                ) : notifications.length === 0 ? (
                  <p className="notification-empty">
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map(notification => (
                    <button
                      type="button"
                      key={notification._id}
                      className={`notification-item ${
                        !notification.isRead ? 'unread' : ''
                      }`}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <div className="notification-item-content">
                        <strong>
                          {notification.title || 'Notification'}
                        </strong>

                        <p>{notification.message || ''}</p>

                        <small>
                          {notification.createdAt &&
                          !Number.isNaN(new Date(notification.createdAt).getTime())
                            ? new Date(notification.createdAt).toLocaleString()
                            : 'Recently'}
                        </small>
                      </div>

                      {!notification.isRead && (
                        <span className="notification-unread-dot" />
                      )}
                    </button>
                  ))
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  )
}

export default Topbar
