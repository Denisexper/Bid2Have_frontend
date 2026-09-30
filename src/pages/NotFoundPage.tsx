import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-base-200 px-4 text-center">
      <span className="text-5xl">🧭</span>
      <h1 className="text-xl font-bold">Página no encontrada</h1>
      <p className="text-base-content/60">La página que buscás no existe o se movió.</p>
      <Link to="/" className="btn btn-primary btn-sm">
        Volver al inicio
      </Link>
    </div>
  )
}
