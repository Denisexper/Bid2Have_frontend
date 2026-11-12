import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/client'
import { useChats } from '../chat/api'
import { formatPrice } from '../listings/format'
import type { Listing } from '../listings/types'
import { useCreateOffer, useOffer } from './api'
import { getMyOfferId, setMyOfferId } from './myOfferStorage'
import { OfferResponseActions } from './OfferResponseActions'
import { offerStatusLabels } from './statusLabels'
import { fieldClass } from './styles'
import { RateOfferButton } from '../ratings/RateOfferButton'

interface BuyerOfferPanelProps {
  listing: Listing
}

export function BuyerOfferPanel({ listing }: BuyerOfferPanelProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <div className="flex items-center justify-between border-2 border-base-300 bg-base-100 p-4">
        <span className="text-sm text-base-content/70">Iniciá sesión para hacer una oferta.</span>
        <Link to="/login" state={{ from: location }} className="btn btn-primary btn-sm">
          Iniciar sesión
        </Link>
      </div>
    )
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
        <div className="flex justify-center border-2 border-base-300 bg-base-100 p-4">
          <span className="loading loading-spinner loading-sm text-primary" />
        </div>
      )
    }

    const offer = offerData?.offer

    if (offer) {
      const chat = chatsData?.chats.find((c) => c.listingId === listing.id && c.buyerId === userId)

      return (
        <div className="border-2 border-base-300 bg-base-100 p-4">
          <h2 className="mb-1 text-sm font-bold text-base-content/70">
            {offer.status === 'PENDING' && offer.proposedBySeller ? 'Contraoferta del vendedor' : 'Tu oferta'}
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-extrabold tabular-nums">
              {formatPrice(offer.amount, listing.currency)}
            </span>
            <span className="text-xs text-base-content/50">{offerStatusLabels[offer.status]}</span>
          </div>

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

          {offer.status === 'PENDING' && offer.proposedBySeller && (
            <div className="mt-2">
              <p className="mb-2 text-sm text-warning">El vendedor te hizo una contraoferta.</p>
              <OfferResponseActions offerId={offer.id} listingId={listing.id} />
            </div>
          )}

          {offer.status === 'PENDING' && !offer.proposedBySeller && (
            <p className="mt-2 text-xs text-base-content/50">Esperando respuesta del vendedor.</p>
          )}
        </div>
      )
    }
  }

  if (listing.status !== 'ACTIVE') {
    return (
      <div className="border-2 border-base-300 bg-base-100 p-4 text-sm text-base-content/60">
        Esta publicación ya no está disponible para ofertas.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-base-300 bg-base-100 p-4">
      <h2 className="mb-2 text-sm font-bold text-base-content/70">Hacer una oferta</h2>
      <div className="flex items-end gap-2">
        <input
          type="number"
          className={`${fieldClass} flex-1`}
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
