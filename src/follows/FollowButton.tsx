import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/client'
import { useFollowing, useFollowUser, useUnfollowUser } from './api'

interface FollowButtonProps {
  sellerId: string
}

export function FollowButton({ sellerId }: FollowButtonProps) {
  const { user } = useAuth()
  const location = useLocation()
  const { data, isLoading } = useFollowing({ enabled: Boolean(user) })
  const follow = useFollowUser()
  const unfollow = useUnfollowUser()

  if (!user) {
    return (
      <Link to="/login" state={{ from: location }} className="btn btn-sm btn-outline">
        Iniciá sesión para seguir
      </Link>
    )
  }

  const existingFollow = data?.follows.find((f) => f.followingId === sellerId)
  const isPending = follow.isPending || unfollow.isPending
  const error = follow.error ?? unfollow.error

  function toggle(): void {
    if (existingFollow) {
      unfollow.mutate(sellerId)
    } else {
      follow.mutate(sellerId)
    }
  }

  return (
    <div>
      <button
        type="button"
        className={`btn btn-sm ${existingFollow ? 'btn-outline' : 'btn-primary'}`}
        disabled={isLoading || isPending}
        onClick={toggle}
      >
        {existingFollow ? 'Siguiendo ✓' : 'Seguir vendedor'}
      </button>
      {error && (
        <p className="mt-1 text-xs text-error">
          {error instanceof ApiError ? error.message : 'No pudimos actualizar el seguimiento.'}
        </p>
      )}
    </div>
  )
}
