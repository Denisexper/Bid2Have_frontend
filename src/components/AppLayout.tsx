import { Link, Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { IconPlus } from './icons'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <TopBar />
      <main className="mx-auto w-full max-w-2xl px-3 py-3 pb-24 md:max-w-3xl md:px-4 lg:max-w-5xl lg:px-6 xl:max-w-6xl">
        <Outlet />
      </main>
      <Link
        to="/listings/new"
        aria-label="Publicar"
        className="btn btn-circle btn-primary fixed right-4 bottom-20 md:right-8"
      >
        <span className="h-5 w-5">
          <IconPlus />
        </span>
      </Link>
      <BottomNav />
    </div>
  )
}
