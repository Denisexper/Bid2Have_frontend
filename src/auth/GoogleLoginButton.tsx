import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from './AuthContext'

interface GoogleLoginButtonProps {
  onError: (message: string) => void
}

export function GoogleLoginButton({ onError }: GoogleLoginButtonProps) {
  const { loginWithGoogle } = useAuth()

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (!credentialResponse.credential) {
          onError('No se recibió credencial de Google')
          return
        }
        loginWithGoogle(credentialResponse.credential).catch(() => {
          onError('No se pudo iniciar sesión')
        })
      }}
      onError={() => onError('No se pudo iniciar sesión con Google')}
    />
  )
}
