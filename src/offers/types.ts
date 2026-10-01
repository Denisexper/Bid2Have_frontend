export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED'

export interface Offer {
  id: string
  listingId: string
  buyerId: string
  amount: string
  status: OfferStatus
  parentOfferId: string | null
  createdAt: string
  updatedAt: string
}
