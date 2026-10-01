import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/client'
import { formatRelativeTime } from '../listings/format'
import { useAdminUsers, useReactivateUser, useSuspendUser } from '../users/api'
import type { AdminUser, UserStatus } from '../users/types'

const statusFilters: Array<{ value: UserStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'SUSPENDED', label: 'Suspendidos' },
]

export function AdminUsersPage() {
  const [filter, setFilter] = useState<UserStatus | 'ALL'>('ALL')
  const { data, isLoading, isError } = useAdminUsers(filter === 'ALL' ? undefined : filter)

  const users = data?.users ?? []

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">Usuarios</h1>

      <div className="flex gap-1.5">
        {statusFilters.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`btn btn-xs ${filter === option.value ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      )}

      {isError && <p className="py-8 text-center text-sm text-error">No pudimos cargar los usuarios.</p>}

      {!isLoading && !isError && users.length === 0 && (
        <p className="py-8 text-center text-sm text-base-content/60">No hay usuarios en esta categoría.</p>
      )}

      <ul className="flex flex-col gap-2">
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </ul>
    </div>
  )
}

function UserRow({ user }: { user: AdminUser }) {
  const { user: me } = useAuth()
  const suspend = useSuspendUser()
  const reactivate = useReactivateUser()

  const error = suspend.error ?? reactivate.error
  const isPending = suspend.isPending || reactivate.isPending
  const isSelf = me?.id === user.id
  const initial = user.name.charAt(0).toUpperCase()

  return (
    <li className="flex flex-col gap-1 rounded-2xl bg-base-100 p-3 shadow-sm">
      <div className="flex items-center gap-3">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
            {initial}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-bold">{user.name}</h3>
            {user.role === 'SUPERADMIN' && <span className="badge badge-ghost badge-xs">Admin</span>}
          </div>
          <p className="truncate text-xs text-base-content/50">{user.email}</p>
          <p className="text-[11px] text-base-content/40">Desde {formatRelativeTime(user.createdAt)}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`badge badge-sm ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-error'}`}>
            {user.status === 'ACTIVE' ? 'Activo' : 'Suspendido'}
          </span>
          {!isSelf && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              disabled={isPending}
              onClick={() => (user.status === 'ACTIVE' ? suspend.mutate(user.id) : reactivate.mutate(user.id))}
            >
              {user.status === 'ACTIVE' ? 'Suspender' : 'Reactivar'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-error">
          {error instanceof ApiError ? error.message : 'No pudimos actualizar el usuario.'}
        </p>
      )}
    </li>
  )
}
