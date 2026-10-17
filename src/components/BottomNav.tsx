import { NavLink } from 'react-router-dom'
import { IconChat, IconFeed, IconProfile } from './icons'

const tabs = [
  { to: '/', label: 'Canal', Icon: IconFeed },
  { to: '/chats', label: 'Chats', Icon: IconChat },
  { to: '/profile', label: 'Perfil', Icon: IconProfile },
]

export function BottomNav() {
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
          <span className="h-5 w-5">
            <Icon />
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
