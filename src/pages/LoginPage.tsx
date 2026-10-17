import { useState } from 'react'
import { Navigate, useLocation, type Location } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { GoogleLoginButton } from '../auth/GoogleLoginButton'
import { consumeSessionExpiredFlag } from '../api/client'

export function LoginPage() {
  const { user } = useAuth()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const [showExpiredNotice] = useState(() => consumeSessionExpiredFlag())

  if (user) {
    const from = (location.state as { from?: Location })?.from
    return <Navigate to={from ?? '/'} replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-2xl">Bid2Have</h1>
          <p className="text-base-content/70">Iniciá sesión para continuar</p>
          {showExpiredNotice && (
            <p className="mt-2 text-sm text-warning">Tu sesión expiró. Volvé a iniciar sesión.</p>
          )}
          <div className="mt-4">
            <GoogleLoginButton onError={setError} />
          </div>
          {error && <p className="mt-2 text-sm text-error">{error}</p>}
        </div>
      </div>
    </div>
  )
}
