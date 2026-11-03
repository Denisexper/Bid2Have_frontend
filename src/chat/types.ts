export interface ChatParticipant {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export interface Chat {
  id: string
  listingId: string
  offerId: string
  buyerId: string
  sellerId: string
  createdAt: string
}

export interface ChatWithParticipants extends Chat {
  buyer: ChatParticipant
  seller: ChatParticipant
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  createdAt: string
}
