export interface Chat {
  id: string
  listingId: string
  offerId: string
  buyerId: string
  sellerId: string
  createdAt: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  createdAt: string
}
