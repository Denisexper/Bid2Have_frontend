import { useAuth } from '../auth/AuthContext'
import { useUserRatings } from '../ratings/api'
import { formatRelativeTime } from '../listings/format'
import { useListings } from '../listings/api'
import { ListingCard } from '../listings/ListingCard'
import { useFollowing, useUnfollowUser } from '../follows/api'
import { ApiError } from '../api/client'

export function ProfilePage() {
  const { user } = useAuth()
  const { data: ratingsData, isLoading: isLoadingRatings } = useUserRatings(user?.id ?? '')
  const { data: listingsData, isLoading: isLoadingListings } = useListings()
  const { data: followingData, isLoading: isLoadingFollowing } = useFollowing()
  const unfollow = useUnfollowUser()

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?'
  const myListings = listingsData?.listings.filter((listing) => listing.sellerId === user?.id) ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-2xl bg-base-100 p-4 shadow-sm">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content">
            {initial}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-bold">{user?.name}</h1>
          <p className="truncate text-sm text-base-content/60">{user?.email}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-base-100 p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-bold text-base-content/70">Reputación</h2>
        {isLoadingRatings ? (
          <span className="loading loading-spinner loading-sm text-primary" />
        ) : (
          <RatingsSummary average={ratingsData?.average ?? null} count={ratingsData?.ratings.length ?? 0} />
        )}

        {ratingsData && ratingsData.ratings.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {ratingsData.ratings.map((rating) => (
              <li key={rating.id} className="rounded-lg bg-base-200 p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{'⭐'.repeat(rating.score)}</span>
                  <span className="text-[11px] text-base-content/50">{formatRelativeTime(rating.createdAt)}</span>
                </div>
                {rating.comment && <p className="mt-1 text-base-content/70">{rating.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl bg-base-100 p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-bold text-base-content/70">Vendedores que sigo</h2>
        {isLoadingFollowing ? (
          <span className="loading loading-spinner loading-sm text-primary" />
        ) : followingData && followingData.follows.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {followingData.follows.map((follow) => (
              <li key={follow.id} className="flex items-center justify-between rounded-lg bg-base-200 p-2 text-sm">
                <span>Vendedor #{follow.followingId.slice(0, 8)}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  disabled={unfollow.isPending}
                  onClick={() => unfollow.mutate(follow.followingId)}
                >
                  Dejar de seguir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-base-content/60">Todavía no seguís a ningún vendedor.</p>
        )}
        {unfollow.isError && (
          <p className="mt-1 text-xs text-error">
            {unfollow.error instanceof ApiError ? unfollow.error.message : 'No pudimos dejar de seguir.'}
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-bold text-base-content/70">Mis publicaciones</h2>
        {isLoadingListings ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : myListings.length === 0 ? (
          <p className="py-6 text-center text-sm text-base-content/60">Todavía no publicaste nada.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {myListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RatingsSummary({ average, count }: { average: number | null; count: number }) {
  if (average === null || count === 0) {
    return <p className="text-sm text-base-content/60">Todavía no tenés calificaciones.</p>
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-extrabold tabular-nums">{average.toFixed(1)}</span>
      <span className="text-sm text-base-content/60">
        ⭐ ({count} {count === 1 ? 'calificación' : 'calificaciones'})
      </span>
    </div>
  )
}
