import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { NotificationsBell } from '../notifications/NotificationsBell'
import { useTheme } from '../theme/useTheme'

export function TopBar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3">
      <span className="text-base font-extrabold text-primary">Bid2Have</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm text-base"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
        >
          {theme === 'bid2have-dark' ? '☀️' : '🌙'}
        </button>
        <NotificationsBell />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
              {initial}
            </div>
          </div>
          <ul tabIndex={0} className="menu dropdown-content menu-sm z-30 mt-2 w-48 rounded-box bg-base-100 p-2 shadow-lg">
            <li className="px-3 py-1 text-xs text-base-content/50">{user?.email}</li>
            {user?.role === 'SUPERADMIN' && (
              <li>
                <Link to="/admin/reports">Reportes (admin)</Link>
              </li>
            )}
            <li>
              <button type="button" onClick={logout}>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
