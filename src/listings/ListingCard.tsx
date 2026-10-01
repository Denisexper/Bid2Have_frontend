import { Link } from 'react-router-dom'
import type { Listing } from './types'
import { formatCountdown, formatPrice, formatRelativeTime } from './format'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const countdown = listing.saleMode === 'AUCTION' ? formatCountdown(listing.auctionEndAt) : null
  const photo = listing.photos[0]

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="block overflow-hidden rounded-2xl bg-base-100 shadow-sm active:scale-[0.99]"
    >
      <div className="relative aspect-video bg-base-200">
        {photo ? (
          <img src={photo} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-base-content/25">📷</div>
        )}
        {countdown && (
          <span className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
            🔴 {countdown}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">{listing.title}</h3>
        <span className="font-mono text-base font-extrabold tabular-nums">
          {formatPrice(listing.price, listing.currency)}
        </span>
        <div className="flex items-center justify-between text-[11px] text-base-content/50">
          <div className="flex gap-1.5">
            <span className="badge badge-ghost badge-xs">{listing.condition === 'NEW' ? 'Nuevo' : 'Usado'}</span>
            <span className="badge badge-ghost badge-xs">
              {listing.saleMode === 'AUCTION' ? 'Subasta' : 'Oferta libre'}
            </span>
          </div>
          <span>{formatRelativeTime(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
