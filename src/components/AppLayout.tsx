import { Link, Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <TopBar />
      <main className="mx-auto w-full max-w-2xl px-3 py-3 pb-24">
        <Outlet />
      </main>
      <Link
        to="/listings/new"
        aria-label="Publicar"
        className="btn btn-circle btn-primary fixed right-4 bottom-20 shadow-lg md:right-8"
      >
        <span className="text-xl">＋</span>
      </Link>
      <BottomNav />
    </div>
  )
}
