import { useAuth } from '../auth/AuthContext'

export function HomePage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200">
      <h1 className="text-3xl font-bold">Hola, {user?.name}</h1>
      <p className="text-base-content/70">
        {user?.email} · {user?.role}
      </p>
      <button type="button" className="btn btn-outline" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}
