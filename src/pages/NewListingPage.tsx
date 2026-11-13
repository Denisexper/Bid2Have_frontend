import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '@categories/api'
import { useCreateListing } from '@listings/api'
import type { ListingCondition, SaleMode } from '@listings/types'
import { ApiError } from '@api/client'
import { formatPrice } from '@listings/format'
import { IconChevronDown, IconImage } from '@components/icons'

const labelClass = 'text-xs font-semibold text-base-content/45'
const fieldClass =
  'w-full border-0 border-b-2 border-base-300 bg-transparent px-0 py-2 text-[15px] text-base-content outline-none transition-colors placeholder:text-base-content/30 focus:border-base-content'

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
  const categoryName = categories.find((c) => c.id === categoryId)?.name
  const previewPhoto = photosText
    .split('\n')
    .map((url) => url.trim())
    .find(Boolean)

  const checklist = [
    { label: 'Título', done: title.trim().length > 0 },
    { label: 'Descripción', done: description.trim().length > 0 },
    { label: 'Categoría', done: categoryId.length > 0 },
    { label: 'Precio', done: Number(price) > 0 },
    ...(saleMode === 'AUCTION' ? [{ label: 'Cierre de subasta', done: auctionEndAt.length > 0 }] : []),
  ]
  const canPublish = checklist.every((item) => item.done) && coords !== null
  const missingLabels = [
    ...checklist.filter((item) => !item.done).map((item) => item.label),
    ...(coords === null ? ['Ubicación'] : []),
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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 xl:max-w-6xl">
      <h1 className="text-lg font-bold md:text-xl">Publicar</h1>

      <form
        onSubmit={handleSubmit}
        className="grid border-2 border-base-300 bg-base-100 lg:grid-cols-[1fr_320px]"
      >
        <div className="flex flex-col gap-5 p-4 md:p-6 lg:border-r-2 lg:border-base-300">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className={labelClass}>Título</span>
              <input
                type="text"
                className={fieldClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
              />
            </label>

            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className={labelClass}>Descripción</span>
              <textarea
                className={`${fieldClass} resize-none`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </label>
          </div>

          <div className="grid gap-5 border-t border-base-300 pt-5 md:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <span className={labelClass}>Categoría</span>
              <div className="relative">
                <select
                  className={`${fieldClass} appearance-none pr-6`}
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
                <span className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-base-content/40">
                  <IconChevronDown />
                </span>
              </div>
            </label>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>Condición</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`btn flex-1 ${condition === 'NEW' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCondition('NEW')}
                >
                  Nuevo
                </button>
                <button
                  type="button"
                  className={`btn flex-1 ${condition === 'USED' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCondition('USED')}
                >
                  Usado
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>Modo de venta</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`btn flex-1 ${saleMode === 'FREE_OFFER' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSaleMode('FREE_OFFER')}
                >
                  Oferta libre
                </button>
                <button
                  type="button"
                  className={`btn flex-1 ${saleMode === 'AUCTION' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSaleMode('AUCTION')}
                >
                  Subasta
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 border-t border-base-300 pt-5 sm:grid-cols-[1fr_7rem] lg:grid-cols-[1fr_7rem_1fr]">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Precio</span>
              <input
                type="number"
                className={fieldClass}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Moneda</span>
              <input
                type="text"
                className={`${fieldClass} uppercase`}
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
                required
              />
            </label>

            {saleMode === 'AUCTION' && (
              <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                <span className={labelClass}>Cierre de la subasta</span>
                <input
                  type="datetime-local"
                  className={fieldClass}
                  value={auctionEndAt}
                  onChange={(e) => setAuctionEndAt(e.target.value)}
                  required
                />
              </label>
            )}
          </div>

          <label className="flex flex-col gap-1.5 border-t border-base-300 pt-5">
            <span className={labelClass}>Fotos (una URL por línea, opcional)</span>
            <textarea
              className={`${fieldClass} resize-none`}
              value={photosText}
              onChange={(e) => setPhotosText(e.target.value)}
              rows={3}
              placeholder="https://..."
            />
          </label>
        </div>

        <aside className="flex flex-col gap-4 border-t-2 border-base-300 bg-base-200 p-4 md:p-6 lg:sticky lg:top-16 lg:self-start lg:border-t-0">
          <div>
            <h2 className="text-sm font-semibold text-base-content/70">Vista previa</h2>
            <p className="text-xs text-base-content/40">Así la va a ver quien navegue el feed.</p>
          </div>

          <div className="overflow-hidden border-2 border-base-300 bg-base-100">
            <div className="relative aspect-video border-b-2 border-base-300 bg-base-200">
              {previewPhoto ? (
                <img src={previewPhoto} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-base-content/25">
                  <span className="h-8 w-8">
                    <IconImage />
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-base-content/60">
                <span>{categoryName ?? (condition === 'NEW' ? 'Nuevo' : 'Usado')}</span>
                <span>{saleMode === 'AUCTION' ? 'Subasta' : 'Oferta libre'}</span>
              </div>
              <h3 className="line-clamp-2 text-sm font-bold leading-snug">{title || 'Tu título acá'}</h3>
              <span className="font-display text-2xl tabular-nums">{safeFormatPrice(price, currency)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-base-300 pt-3">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className={item.done ? 'text-base-content' : 'text-base-content/40'}>{item.label}</span>
                <span className={`h-3 w-3 border-2 border-base-300 ${item.done ? 'bg-base-content' : ''}`} />
              </div>
            ))}

            <div className="flex items-center justify-between text-sm">
              <span
                className={
                  coords
                    ? 'text-base-content'
                    : geoStatus === 'error'
                      ? 'text-error'
                      : 'text-base-content/40'
                }
              >
                Ubicación
              </span>
              {geoStatus === 'loading' && <span className="loading loading-spinner loading-xs" />}
              {geoStatus === 'success' && <span className="h-3 w-3 border-2 border-base-300 bg-base-content" />}
              {geoStatus === 'error' && (
                <button type="button" className="btn btn-xs" onClick={requestLocation}>
                  Reintentar
                </button>
              )}
            </div>
          </div>

          {missingLabels.length > 0 && (
            <p className="text-xs text-base-content/40">Falta: {missingLabels.join(', ')}</p>
          )}

          {formError && <p className="text-sm text-error">{formError}</p>}

          <button type="submit" className="btn btn-primary" disabled={createListing.isPending || !canPublish}>
            {createListing.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Publicar'}
          </button>
        </aside>
      </form>
    </div>
  )
}
