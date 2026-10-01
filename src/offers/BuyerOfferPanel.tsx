import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/client'
import { useChats } from '../chat/api'
import { formatPrice } from '../listings/format'
import type { Listing } from '../listings/types'
import { useCreateOffer, useOffer } from './api'
import { getMyOfferId, setMyOfferId } from './myOfferStorage'
import { offerStatusLabels } from './statusLabels'
import { RateOfferButton } from '../ratings/RateOfferButton'

interface BuyerOfferPanelProps {
  listing: Listing
}

export function BuyerOfferPanel({ listing }: BuyerOfferPanelProps) {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return <BuyerOfferPanelInner key={listing.id} listing={listing} userId={user.id} />
}

function BuyerOfferPanelInner({ listing, userId }: { listing: Listing; userId: string }) {
  const [offerId, setOfferId] = useState(() => getMyOfferId(userId, listing.id))
  const [amount, setAmount] = useState('')

  const { data: offerData, isLoading: isLoadingOffer } = useOffer(offerId)
  const createOffer = useCreateOffer(listing.id)
  const { data: chatsData } = useChats()

  function handleSubmit(event: FormEvent): void {
    event.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return

    createOffer.mutate(value, {
      onSuccess: (res) => {
        setMyOfferId(userId, listing.id, res.offer.id)
        setOfferId(res.offer.id)
      },
    })
  }

  if (offerId) {
    if (isLoadingOffer) {
      return (
        <div className="flex justify-center rounded-2xl bg-base-100 p-4 shadow-sm">
          <span className="loading loading-spinner loading-sm text-primary" />
        </div>
      )
    }

    const offer = offerData?.offer

    if (offer) {
      const chat = chatsData?.chats.find((c) => c.listingId === listing.id && c.buyerId === userId)

      return (
        <div className="rounded-2xl bg-base-100 p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-bold text-base-content/70">Tu oferta</h2>
          <p className="text-sm">
            {formatPrice(offer.amount, listing.currency)} · {offerStatusLabels[offer.status]}
          </p>

          {offer.status === 'ACCEPTED' && (
            <>
              <p className="mt-2 text-sm text-success">
                ¡Tu oferta fue aceptada!{' '}
                {chat ? (
                  <Link to={`/chats/${chat.id}`} className="link link-primary">
                    Ir al chat
                  </Link>
                ) : (
                  'El chat se está creando, revisá la sección Chats en un momento.'
                )}
              </p>
              <div className="mt-2">
                <RateOfferButton offerId={offer.id} label="Calificar al vendedor" />
              </div>
            </>
          )}

          {offer.status === 'REJECTED' && <p className="mt-2 text-sm text-error">El vendedor rechazó tu oferta.</p>}

          {offer.status === 'COUNTERED' && (
            <p className="mt-2 text-sm text-warning">
              El vendedor te hizo una contraoferta. Todavía no podemos mostrártela acá — fijate en tus
              notificaciones cuando esa sección esté disponible.
            </p>
          )}
        </div>
      )
    }
  }

  if (listing.status !== 'ACTIVE') {
    return (
      <div className="rounded-2xl bg-base-100 p-4 text-sm text-base-content/60 shadow-sm">
        Esta publicación ya no está disponible para ofertas.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-base-100 p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-bold text-base-content/70">Hacer una oferta</h2>
      <div className="flex gap-2">
        <input
          type="number"
          className="input input-bordered flex-1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Monto en ${listing.currency}`}
          min="0"
          step="0.01"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={createOffer.isPending}>
          {createOffer.isPending ? <span className="loading loading-spinner loading-sm" /> : 'Ofertar'}
        </button>
      </div>
      {createOffer.isError && (
        <p className="mt-2 text-sm text-error">
          {createOffer.error instanceof ApiError ? createOffer.error.message : 'No pudimos enviar tu oferta.'}
        </p>
      )}
    </form>
  )
}
