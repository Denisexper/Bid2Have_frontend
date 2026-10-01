import { useState } from 'react'
import { useCategories } from '../categories/api'
import { useListings } from '../listings/api'
import { ListingCard } from '../listings/ListingCard'

type GeoStatus = 'idle' | 'loading' | 'error'

const radiusOptions = [5, 10, 25, 50, 100]

export function HomePage() {
  const [nearbyEnabled, setNearbyEnabled] = useState(false)
  const [radiusKm, setRadiusKm] = useState(25)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle')

  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const { data, isLoading, isError } = useListings(
    nearbyEnabled && coords ? { lat: coords.lat, lng: coords.lng, radiusKm } : undefined,
  )
  const { data: categoriesData } = useCategories()

  function enableNearby(): void {
    setNearbyEnabled(true)
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setGeoStatus('idle')
      },
      () => setGeoStatus('error'),
    )
  }

  function disableNearby(): void {
    setNearbyEnabled(false)
    setCoords(null)
    setGeoStatus('idle')
  }

  const allListings = data?.listings ?? []
  const hasFilters = Boolean(search.trim()) || Boolean(categoryId)
  const listings = allListings.filter((listing) => {
    const matchesCategory = !categoryId || listing.categoryId === categoryId
    const matchesSearch = !search.trim() || listing.title.toLowerCase().includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 rounded-2xl bg-base-100 p-3 shadow-sm">
        <input
          type="text"
          className="input input-bordered input-sm"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="select select-bordered select-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categoriesData?.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={`btn btn-sm ${nearbyEnabled ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => (nearbyEnabled ? disableNearby() : enableNearby())}
          >
            📍 Cerca mío
          </button>

          {nearbyEnabled && (
            <select
              className="select select-bordered select-sm"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
            >
              {radiusOptions.map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {nearbyEnabled && geoStatus === 'loading' && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      )}

      {nearbyEnabled && geoStatus === 'error' && (
        <div className="flex items-center justify-between rounded-2xl bg-base-100 p-3 text-sm shadow-sm">
          <span className="text-error">No pudimos obtener tu ubicación.</span>
          <button type="button" className="btn btn-xs" onClick={enableNearby}>
            Reintentar
          </button>
        </div>
      )}

      {(!nearbyEnabled || (geoStatus === 'idle' && coords)) && (
        <>
          {isLoading && (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          )}

          {isError && (
            <div className="py-16 text-center text-base-content/60">
              No pudimos cargar las publicaciones. Probá de nuevo más tarde.
            </div>
          )}

          {!isLoading && !isError && listings.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <span className="text-4xl">📭</span>
              <h2 className="font-bold">
                {hasFilters
                  ? 'No encontramos publicaciones con esos filtros'
                  : nearbyEnabled
                    ? 'No hay publicaciones cerca tuyo'
                    : 'Todavía no hay publicaciones'}
              </h2>
              <p className="text-sm text-base-content/60">
                {hasFilters
                  ? 'Probá cambiando la búsqueda o la categoría.'
                  : nearbyEnabled
                    ? 'Probá con un radio más amplio.'
                    : 'Sé el primero en publicar algo.'}
              </p>
            </div>
          )}

          {!isLoading && !isError && listings.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
