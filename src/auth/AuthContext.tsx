import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiFetch, getToken, setToken } from '../api/client'
import type { AuthUser } from './types'

interface GoogleLoginResponse {
  token: string
  user: AuthUser
}

interface MeResponse {
  user: AuthUser
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setIsLoading(false)
      return
    }

    apiFetch<MeResponse>('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => setToken(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function loginWithGoogle(idToken: string): Promise<void> {
    const res = await apiFetch<GoogleLoginResponse>('/auth/google', {
      method: 'POST',
      body: { idToken },
    })
    setToken(res.token)
    setUser(res.user)
  }

  function logout(): void {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
