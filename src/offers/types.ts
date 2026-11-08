export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED'

export interface Offer {
  id: string
  listingId: string
  buyerId: string
  amount: string
  status: OfferStatus
  proposedBySeller: boolean
  parentOfferId: string | null
  createdAt: string
  updatedAt: string
}
