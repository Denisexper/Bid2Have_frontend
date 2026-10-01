import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function SuperAdminRoute() {
  const { user } = useAuth()

  if (user?.role !== 'SUPERADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
