export type NotificationType =
  | 'NEW_OFFER'
  | 'OFFER_ACCEPTED'
  | 'OFFER_REJECTED'
  | 'OFFER_COUNTERED'
  | 'NEW_MESSAGE'
  | 'FOLLOWED_SELLER_NEW_LISTING'

export interface NotificationPayload {
  listingId?: string
  offerId?: string
  chatId?: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  payload: NotificationPayload | null
  read: boolean
  createdAt: string
}
