import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '../categories/api'
import { useCreateListing } from '../listings/api'
import type { ListingCondition, SaleMode } from '../listings/types'
import { ApiError } from '../api/client'
import { IconPin } from '../components/icons'
import { formatPrice } from '../listings/format'

function safeFormatPrice(price: string, currency: string): string {
  if (!price || currency.length !== 3) {
    return '—'
  }
  try {
    return formatPrice(price, currency)
  } catch {
    return '—'
  }
}

type GeoStatus = 'loading' | 'success' | 'error'

export function NewListingPage() {
  const navigate = useNavigate()
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories()
  const createListing = useCreateListing()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [condition, setCondition] = useState<ListingCondition>('USED')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [saleMode, setSaleMode] = useState<SaleMode>('FREE_OFFER')
  const [auctionEndAt, setAuctionEndAt] = useState('')
  const [photosText, setPhotosText] = useState('')

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('loading')
  const [formError, setFormError] = useState<string | null>(null)

  const categories = categoriesData?.categories ?? []

  const checklist = [
    { label: 'Título', done: title.trim().length > 0 },
    { label: 'Descripción', done: description.trim().length > 0 },
    { label: 'Categoría', done: categoryId.length > 0 },
    { label: 'Precio', done: Number(price) > 0 },
  ]

  useEffect(() => {
    requestLocation()
  }, [])

  function requestLocation(): void {
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setGeoStatus('success')
      },
      () => {
        setGeoStatus('error')
      },
    )
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault()
    setFormError(null)

    if (!coords) {
      setFormError('Necesitamos tu ubicación para publicar.')
      return
    }

    if (saleMode === 'AUCTION' && !auctionEndAt) {
      setFormError('Elegí cuándo cierra la subasta.')
      return
    }

    const photos = photosText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)

    try {
      await createListing.mutateAsync({
        title,
        description,
        categoryId,
        condition,
        price: Number(price),
        currency,
        photos,
        lat: coords.lat,
        lng: coords.lng,
        saleMode,
        auctionEndAt: saleMode === 'AUCTION' ? new Date(auctionEndAt).toISOString() : undefined,
      })
      navigate('/', { replace: true })
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'No pudimos publicar tu aviso.')
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      <h1 className="text-lg font-bold">Publicar</h1>

      <form
        onSubmit={handleSubmit}
        className="grid border-2 border-base-300 bg-base-100 lg:grid-cols-[1fr_280px]"
      >
        <div className="flex flex-col gap-3 p-4 lg:border-r-2 lg:border-base-300">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-base-content/70">Título</span>
          <input
            type="text"
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-base-content/70">Descripción</span>
          <textarea
            className="textarea textarea-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-base-content/70">Categoría</span>
          <select
            className="select select-bordered"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            disabled={isLoadingCategories}
          >
            <option value="" disabled>
              {isLoadingCategories ? 'Cargando...' : 'Elegí una categoría'}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-semibold text-base-content/70">Condición</span>
            <select
              className="select select-bordered"
              value={condition}
              onChange={(e) => setCondition(e.target.value as ListingCondition)}
            >
              <option value="NEW">Nuevo</option>
              <option value="USED">Usado</option>
            </select>
          </label>

          <label className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-semibold text-base-content/70">Modo de venta</span>
            <select
              className="select select-bordered"
              value={saleMode}
              onChange={(e) => setSaleMode(e.target.value as SaleMode)}
            >
              <option value="FREE_OFFER">Oferta libre</option>
              <option value="AUCTION">Subasta</option>
            </select>
          </label>
        </div>

        {saleMode === 'AUCTION' && (
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-base-content/70">Cierre de la subasta</span>
            <input
              type="datetime-local"
              className="input input-bordered"
              value={auctionEndAt}
              onChange={(e) => setAuctionEndAt(e.target.value)}
              required
            />
          </label>
        )}

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-semibold text-base-content/70">Precio</span>
            <input
              type="number"
              className="input input-bordered"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </label>

          <label className="flex w-28 flex-col gap-1">
            <span className="text-sm font-semibold text-base-content/70">Moneda</span>
            <input
              type="text"
              className="input input-bordered uppercase"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              maxLength={3}
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-base-content/70">Fotos (una URL por línea, opcional)</span>
          <textarea
            className="textarea textarea-bordered"
            value={photosText}
            onChange={(e) => setPhotosText(e.target.value)}
            rows={3}
            placeholder="https://..."
          />
        </label>

        <div className="border border-base-300 bg-base-200 p-3 text-sm">
          {geoStatus === 'loading' && (
            <span className="inline-flex items-center gap-1.5 text-base-content/60">
              <span className="h-3.5 w-3.5">
                <IconPin />
              </span>
              Obteniendo tu ubicación...
            </span>
          )}
          {geoStatus === 'success' && (
            <span className="inline-flex items-center gap-1.5 text-success">
              <span className="h-3.5 w-3.5">
                <IconPin />
              </span>
              Ubicación lista
            </span>
          )}
          {geoStatus === 'error' && (
            <div className="flex items-center justify-between">
              <span className="text-error">No pudimos obtener tu ubicación.</span>
              <button type="button" className="btn btn-xs" onClick={requestLocation}>
                Reintentar
              </button>
            </div>
          )}
        </div>

        {formError && <p className="text-sm text-error">{formError}</p>}

        <button type="submit" className="btn btn-primary" disabled={createListing.isPending || !coords}>
          {createListing.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Publicar'}
        </button>
        </div>

        <aside className="flex flex-col gap-2 border-t-2 border-base-300 bg-base-200 p-4 lg:border-t-0">
          <h2 className="text-sm font-semibold text-base-content/70">Resumen de publicación</h2>
          <span className="font-display text-2xl tabular-nums">{safeFormatPrice(price, currency)}</span>

          <div className="flex flex-col gap-1.5 border-t border-base-300 pt-3">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className={item.done ? 'text-base-content' : 'text-base-content/40'}>{item.label}</span>
                <span className={`h-3 w-3 border-2 border-base-300 ${item.done ? 'bg-base-content' : ''}`} />
              </div>
            ))}
          </div>
        </aside>
      </form>
    </div>
  )
}
