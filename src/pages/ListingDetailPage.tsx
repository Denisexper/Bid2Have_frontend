import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/client'
import { useListing } from '../listings/api'
import { formatCountdown, formatPrice, formatRelativeTime } from '../listings/format'
import { BuyerOfferPanel } from '../offers/BuyerOfferPanel'
import { SellerOffersPanel } from '../offers/SellerOffersPanel'
import { FollowButton } from '../follows/FollowButton'
import { ReportButton } from '../reports/ReportButton'
import { SellerListingActions } from '../listings/SellerListingActions'

const statusLabels: Record<string, string> = {
  ACTIVE: 'Activa',
  RESERVED: 'Reservada',
  SOLD: 'Vendida',
  CANCELLED: 'Cancelada',
}

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data, isLoading, error } = useListing(id ?? '')

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (error) {
    const isNotFound = error instanceof ApiError && error.status === 404

    return (
      <div className="py-16 text-center text-base-content/60">
        {isNotFound ? 'Esta publicación no existe.' : 'No pudimos cargar esta publicación.'}
      </div>
    )
  }

  const listing = data!.listing
  const countdown = listing.saleMode === 'AUCTION' ? formatCountdown(listing.auctionEndAt) : null
  const isOwner = user?.id === listing.sellerId

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto rounded-2xl bg-base-200">
        {listing.photos.length > 0 ? (
          listing.photos.map((photo) => (
            <img
              key={photo}
              src={photo}
              alt={listing.title}
              className="aspect-video w-full shrink-0 snap-start object-cover"
            />
          ))
        ) : (
          <div className="flex aspect-video w-full items-center justify-center text-5xl text-base-content/25">
            📷
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-base-100 p-4 shadow-sm">
        <h1 className="text-lg font-bold">{listing.title}</h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-mono text-xl font-extrabold tabular-nums">
            {formatPrice(listing.price, listing.currency)}
          </span>
          {countdown && <span className="badge badge-error badge-sm">🔴 {countdown}</span>}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="badge badge-ghost badge-sm">{listing.condition === 'NEW' ? 'Nuevo' : 'Usado'}</span>
          <span className="badge badge-ghost badge-sm">
            {listing.saleMode === 'AUCTION' ? 'Subasta' : 'Oferta libre'}
          </span>
          {listing.status !== 'ACTIVE' && (
            <span className="badge badge-outline badge-sm">{statusLabels[listing.status]}</span>
          )}
          <span className="badge badge-ghost badge-sm">{formatRelativeTime(listing.createdAt)}</span>
        </div>

        <p className="mt-3 whitespace-pre-wrap text-sm text-base-content/80">{listing.description}</p>

        {!isOwner && (
          <div className="mt-3 flex flex-col gap-2 border-t border-base-200 pt-3">
            <div className="flex items-center gap-2">
              <FollowButton sellerId={listing.sellerId} />
              <ReportButton label="Reportar vendedor" targetType="USER" targetUserId={listing.sellerId} />
            </div>
            <ReportButton label="Reportar publicación" targetType="LISTING" listingId={listing.id} />
          </div>
        )}

        {isOwner && <SellerListingActions listing={listing} />}
      </div>

      {isOwner ? (
        <SellerOffersPanel listingId={listing.id} currency={listing.currency} />
      ) : (
        <BuyerOfferPanel listing={listing} />
      )}
    </div>
  )
}
