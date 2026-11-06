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
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex flex-1 flex-col justify-center bg-black px-8 py-16 text-white md:px-16">
        <h1 className="font-display text-7xl leading-[0.85] sm:text-8xl md:text-[6.5rem]">
          BID
          <br />
          2HAVE
        </h1>
        <p className="mt-6 max-w-xs text-white/70">Comprá a tu precio. Vendé a la mejor oferta.</p>
      </div>

      <div className="flex flex-1 flex-col justify-center border-t-2 border-base-300 bg-base-100 px-8 py-16 md:border-l-2 md:border-t-0 md:px-16">
        <div className="w-full max-w-xs">
          <h2 className="text-2xl font-semibold">Entrá con tu cuenta de Google</h2>

          {showExpiredNotice && (
            <p className="mt-4 border-l-4 border-warning pl-3 text-sm text-base-content/70">
              Tu sesión expiró. Volvé a iniciar sesión.
            </p>
          )}

          <div className="mt-6">
            <GoogleLoginButton onError={setError} />
          </div>

          {error && <p className="mt-4 border-l-4 border-error pl-3 text-sm text-base-content/70">{error}</p>}
        </div>
      </div>
    </div>
  )
}
