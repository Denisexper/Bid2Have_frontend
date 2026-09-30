import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { GoogleLoginButton } from '../auth/GoogleLoginButton'

export function LoginPage() {
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-2xl">Bid2Have</h1>
          <p className="text-base-content/70">Iniciá sesión para continuar</p>
          <div className="mt-4">
            <GoogleLoginButton onError={setError} />
          </div>
          {error && <p className="mt-2 text-sm text-error">{error}</p>}
        </div>
      </div>
    </div>
  )
}
