import { Link } from 'react-router-dom'
import { useCategories } from '../categories/api'
import type { Listing } from './types'
import { formatCountdown, formatPrice, formatRelativeTime } from './format'
import { IconClock, IconImage } from '../components/icons'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const { data: categoriesData } = useCategories()
  const countdown = listing.saleMode === 'AUCTION' ? formatCountdown(listing.auctionEndAt) : null
  const photo = listing.photos[0]
  const categoryName = categoriesData?.categories.find((c) => c.id === listing.categoryId)?.name

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="block overflow-hidden border-2 border-base-300 bg-base-100 active:scale-[0.99]"
    >
      <div className="relative aspect-video border-b-2 border-base-300 bg-base-200">
        {photo ? (
          <img src={photo} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-base-content/25">
            <span className="h-10 w-10">
              <IconImage />
            </span>
          </div>
        )}
        {countdown && (
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            <span className="h-3 w-3">
              <IconClock />
            </span>
            {countdown}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between text-[11px] font-semibold text-base-content/60">
          <span>{categoryName ?? (listing.condition === 'NEW' ? 'Nuevo' : 'Usado')}</span>
          <span>{listing.saleMode === 'AUCTION' ? 'Subasta' : 'Oferta libre'}</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">{listing.title}</h3>
        <span className="font-display text-xl tabular-nums">{formatPrice(listing.price, listing.currency)}</span>
        <div className="flex items-center justify-between border-t border-base-300 pt-1.5 text-[11px] text-base-content/50">
          <span>{listing.condition === 'NEW' ? 'Nuevo' : 'Usado'}</span>
          <span>{formatRelativeTime(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
