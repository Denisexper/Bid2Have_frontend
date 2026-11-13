import { NavLink } from 'react-router-dom'
import { useAuth } from '@auth/AuthContext'
import { useNotifications } from '@notifications/api'
import { IconChat, IconFeed, IconProfile } from './icons'

const tabs = [
  { to: '/', label: 'Canal', Icon: IconFeed },
  { to: '/chats', label: 'Chats', Icon: IconChat },
  { to: '/profile', label: 'Perfil', Icon: IconProfile },
]

export function BottomNav() {
  const { user } = useAuth()
  const { data } = useNotifications({ enabled: !!user })

  const hasUnreadMessage = (data?.notifications ?? []).some(
    (n) => n.type === 'NEW_MESSAGE' && !n.read,
  )

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t-2 border-base-300 bg-base-100 py-2">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[11px] font-semibold ${
              isActive ? 'text-primary' : 'text-base-content/50'
            }`
          }
        >
          <span className="relative inline-block h-5 w-5">
            <Icon />
            {to === '/chats' && hasUnreadMessage && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-base-100" />
            )}
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
