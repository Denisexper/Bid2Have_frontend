import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteListing, useUpdateListing } from './api'
import type { Listing, ListingCondition } from './types'

interface SellerListingActionsProps {
  listing: Listing
}

export function SellerListingActions({ listing }: SellerListingActionsProps) {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const [title, setTitle] = useState(listing.title)
  const [description, setDescription] = useState(listing.description)
  const [price, setPrice] = useState(listing.price)
  const [currency, setCurrency] = useState(listing.currency)
  const [condition, setCondition] = useState<ListingCondition>(listing.condition)
  const [photosText, setPhotosText] = useState(listing.photos.join('\n'))

  const update = useUpdateListing(listing.id)
  const remove = useDeleteListing(listing.id)

  function handleSave(event: FormEvent): void {
    event.preventDefault()
    const photos = photosText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)

    update.mutate(
      {
        title,
        description,
        price: Number(price),
        currency,
        condition,
        photos,
      },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  function handleDelete(): void {
    remove.mutate(undefined, { onSuccess: () => navigate('/profile', { replace: true }) })
  }

  function handleCancelListing(): void {
    update.mutate({ status: 'CANCELLED' }, { onSuccess: () => setConfirmingCancel(false) })
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="mt-3 flex flex-col gap-2 border-t border-base-200 pt-3">
        <input
          type="text"
          className="input input-bordered input-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="textarea textarea-bordered textarea-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
        <div className="flex gap-2">
          <input
            type="number"
            className="input input-bordered input-sm flex-1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            required
          />
          <input
            type="text"
            className="input input-bordered input-sm w-20 uppercase"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={3}
            required
          />
          <select
            className="select select-bordered select-sm"
            value={condition}
            onChange={(e) => setCondition(e.target.value as ListingCondition)}
          >
            <option value="NEW">Nuevo</option>
            <option value="USED">Usado</option>
          </select>
        </div>
        <textarea
          className="textarea textarea-bordered textarea-sm"
          value={photosText}
          onChange={(e) => setPhotosText(e.target.value)}
          rows={2}
          placeholder="URLs de fotos, una por línea"
        />
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary btn-sm" disabled={update.isPending}>
            {update.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Guardar'}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
            Cancelar
          </button>
        </div>
        {update.isError && <p className="text-sm text-error">{update.error.message}</p>}
      </form>
    )
  }

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-base-200 pt-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsEditing(true)}>
          Editar
        </button>

        {listing.status === 'ACTIVE' &&
          (confirmingCancel ? (
            <button
              type="button"
              className="btn btn-warning btn-sm"
              disabled={update.isPending}
              onClick={handleCancelListing}
            >
              ¿Confirmar cancelación?
            </button>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmingCancel(true)}>
              Cancelar publicación
            </button>
          ))}

        {confirmingDelete ? (
          <button
            type="button"
            className="btn btn-error btn-sm"
            disabled={remove.isPending}
            onClick={handleDelete}
          >
            ¿Confirmar eliminación?
          </button>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmingDelete(true)}>
            Eliminar
          </button>
        )}
      </div>

      {(update.error ?? remove.error) && <p className="text-sm text-error">{(update.error ?? remove.error)?.message}</p>}
    </div>
  )
}
