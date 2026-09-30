import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Canal', icon: '📣' },
  { to: '/chats', label: 'Chats', icon: '💬' },
  { to: '/profile', label: 'Perfil', icon: '👤' },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-base-300 bg-base-100 py-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[11px] font-semibold ${
              isActive ? 'text-primary' : 'text-base-content/50'
            }`
          }
        >
          <span className="text-base">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
