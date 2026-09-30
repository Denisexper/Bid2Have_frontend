import { useListings } from '../listings/api'
import { ListingCard } from '../listings/ListingCard'

export function HomePage() {
  const { data, isLoading, isError } = useListings()

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-base-content/60">
        No pudimos cargar las publicaciones. Probá de nuevo más tarde.
      </div>
    )
  }

  const listings = data?.listings ?? []

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <span className="text-4xl">📭</span>
        <h2 className="font-bold">Todavía no hay publicaciones</h2>
        <p className="text-sm text-base-content/60">Sé el primero en publicar algo.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
