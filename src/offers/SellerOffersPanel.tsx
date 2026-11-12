import { Link } from 'react-router-dom'
import { useChats } from '../chat/api'
import { formatPrice, formatRelativeTime } from '../listings/format'
import { useListingOffers } from './api'
import { OfferResponseActions } from './OfferResponseActions'
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
    <div className="border-2 border-base-300 bg-base-100 p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-bold text-base-content/70">Ofertas recibidas</h2>
        {data && data.offers.length > 0 && (
          <span className="text-xs text-base-content/40">{data.offers.length}</span>
        )}
      </div>

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
  const { data: chatsData } = useChats()
  const chat = chatsData?.chats.find((c) => c.offerId === offer.id)

  return (
    <li className="border border-base-300 bg-base-200 p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold">{formatPrice(offer.amount, currency)}</span>
        <span className="badge badge-ghost badge-sm">
          {offer.proposedBySeller && offer.status === 'PENDING' ? 'Esperando al comprador' : offerStatusLabels[offer.status]}
        </span>
      </div>
      <div className="mt-0.5 text-[11px] text-base-content/50">
        Comprador #{offer.buyerId.slice(0, 8)} · {formatRelativeTime(offer.createdAt)}
      </div>

      {offer.status === 'PENDING' && offer.proposedBySeller && (
        <p className="mt-2 text-xs text-base-content/50">
          Le mandaste una contraoferta al comprador. Te avisamos cuando responda.
        </p>
      )}

      {offer.status === 'PENDING' && !offer.proposedBySeller && (
        <div className="mt-2">
          <OfferResponseActions offerId={offer.id} listingId={listingId} />
        </div>
      )}

      {offer.status === 'ACCEPTED' && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {chat ? (
            <Link to={`/chats/${chat.id}`} className="btn btn-primary btn-xs">
              Chatear con el comprador
            </Link>
          ) : (
            <span className="text-xs text-base-content/50">El chat se está creando, revisá Chats en un momento.</span>
          )}
          <RateOfferButton offerId={offer.id} label="Calificar al comprador" />
        </div>
      )}
    </li>
  )
}
