export type ListingCondition = 'NEW' | 'USED'
export type SaleMode = 'FREE_OFFER' | 'AUCTION'
export type ListingStatus = 'ACTIVE' | 'RESERVED' | 'SOLD' | 'CANCELLED'

export interface Listing {
  id: string
  sellerId: string
  title: string
  description: string
  categoryId: string
  condition: ListingCondition
  price: string
  currency: string
  photos: string[]
  lat: number
  lng: number
  saleMode: SaleMode
  auctionEndAt: string | null
  status: ListingStatus
  createdAt: string
  updatedAt: string
}
