import { Link } from 'react-router-dom'
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from './api'
import { notificationIcons, notificationLabels, notificationLink } from './presentation'
import type { Notification } from './types'
import { formatRelativeTime } from '../listings/format'

export function NotificationsBell() {
  const { data } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = data?.notifications ?? []
  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="indicator btn btn-circle btn-ghost btn-sm text-base">
        🔔
        {unreadIds.length > 0 && (
          <span className="indicator-item badge badge-primary badge-xs">{unreadIds.length}</span>
        )}
      </div>
      <div tabIndex={0} className="dropdown-content z-30 mt-2 w-80 rounded-box bg-base-100 p-2 shadow-lg">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-bold text-base-content/60">Notificaciones</span>
          {unreadIds.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate(unreadIds)}
            >
              Marcar todas
            </button>
          )}
        </div>

        <ul className="menu menu-sm max-h-96 flex-nowrap overflow-y-auto">
          {notifications.length === 0 && (
            <li className="px-2 py-3 text-center text-xs text-base-content/50">No tenés notificaciones.</li>
          )}
          {notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onRead={() => {
                if (!notification.read) markRead.mutate(notification.id)
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

function NotificationRow({ notification, onRead }: { notification: Notification; onRead: () => void }) {
  const link = notificationLink(notification)
  const content = (
    <div className={`flex gap-2 ${notification.read ? 'opacity-60' : ''}`}>
      <span className="text-base">{notificationIcons[notification.type]}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate">{notificationLabels[notification.type]}</p>
        <span className="text-[10px] text-base-content/50">{formatRelativeTime(notification.createdAt)}</span>
      </div>
      {!notification.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
    </div>
  )

  return (
    <li>
      {link ? (
        <Link to={link} onClick={onRead}>
          {content}
        </Link>
      ) : (
        <button type="button" onClick={onRead}>
          {content}
        </button>
      )}
    </li>
  )
}
