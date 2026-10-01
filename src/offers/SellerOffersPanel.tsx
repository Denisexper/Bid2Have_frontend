import { useState } from 'react'
import { ApiError } from '../api/client'
import { formatPrice, formatRelativeTime } from '../listings/format'
import { useAcceptOffer, useCounterOffer, useListingOffers, useRejectOffer } from './api'
import { offerStatusLabels } from './statusLabels'
import type { Offer } from './types'
import { RateOfferButton } from '../ratings/RateOfferButton'

interface SellerOffersPanelProps {
  listingId: string
  currency: string
}

export function SellerOffersPanel({ listingId, currency }: SellerOffersPanelProps) {
  const { data, isLoading, isError } = useListingOffers(listingId, true)

  return (
    <div className="rounded-2xl bg-base-100 p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-bold text-base-content/70">Ofertas recibidas</h2>

      {isLoading && (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm text-primary" />
        </div>
      )}

      {isError && <p className="text-sm text-error">No pudimos cargar las ofertas.</p>}

      {data && data.offers.length === 0 && (
        <p className="text-sm text-base-content/60">Todavía no recibiste ofertas.</p>
      )}

      {data && data.offers.length > 0 && (
        <ul className="flex flex-col gap-2">
          {data.offers.map((offer) => (
            <OfferRow key={offer.id} offer={offer} listingId={listingId} currency={currency} />
          ))}
        </ul>
      )}
    </div>
  )
}

function OfferRow({ offer, listingId, currency }: { offer: Offer; listingId: string; currency: string }) {
  const [isCountering, setIsCountering] = useState(false)
  const [counterAmount, setCounterAmount] = useState('')

  const accept = useAcceptOffer(listingId)
  const reject = useRejectOffer(listingId)
  const counter = useCounterOffer(listingId)

  const error = accept.error ?? reject.error ?? counter.error
  const isPending = accept.isPending || reject.isPending || counter.isPending

  function submitCounter(): void {
    const amount = Number(counterAmount)
    if (!amount || amount <= 0) return
    counter.mutate(
      { offerId: offer.id, amount },
      { onSuccess: () => setIsCountering(false) },
    )
  }

  return (
    <li className="rounded-lg bg-base-200 p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold">{formatPrice(offer.amount, currency)}</span>
        <span className="badge badge-ghost badge-sm">{offerStatusLabels[offer.status]}</span>
      </div>
      <div className="mt-0.5 text-[11px] text-base-content/50">
        Comprador #{offer.buyerId.slice(0, 8)} · {formatRelativeTime(offer.createdAt)}
      </div>

      {offer.status === 'PENDING' && (
        <div className="mt-2 flex flex-col gap-2">
          {!isCountering ? (
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-success btn-xs"
                disabled={isPending}
                onClick={() => accept.mutate({ offerId: offer.id })}
              >
                Aceptar
              </button>
              <button
                type="button"
                className="btn btn-error btn-xs"
                disabled={isPending}
                onClick={() => reject.mutate({ offerId: offer.id })}
              >
                Rechazar
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                disabled={isPending}
                onClick={() => setIsCountering(true)}
              >
                Contraofertar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                className="input input-bordered input-xs w-24"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                placeholder="Monto"
                min="0"
                step="0.01"
                autoFocus
              />
              <button type="button" className="btn btn-primary btn-xs" disabled={isPending} onClick={submitCounter}>
                Enviar
              </button>
              <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsCountering(false)}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      {offer.status === 'ACCEPTED' && (
        <div className="mt-2">
          <RateOfferButton offerId={offer.id} label="Calificar al comprador" />
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-error">
          {error instanceof ApiError ? error.message : 'No pudimos procesar la acción.'}
        </p>
      )}
    </li>
  )
}
