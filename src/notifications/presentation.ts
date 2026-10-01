import type { Notification, NotificationType } from './types'

export const notificationLabels: Record<NotificationType, string> = {
  NEW_OFFER: 'Recibiste una nueva oferta',
  OFFER_ACCEPTED: 'Tu oferta fue aceptada',
  OFFER_REJECTED: 'Tu oferta fue rechazada',
  OFFER_COUNTERED: 'El vendedor te hizo una contraoferta',
  NEW_MESSAGE: 'Tenés un mensaje nuevo',
  FOLLOWED_SELLER_NEW_LISTING: 'Un vendedor que seguís publicó algo nuevo',
}

export const notificationIcons: Record<NotificationType, string> = {
  NEW_OFFER: '💰',
  OFFER_ACCEPTED: '✅',
  OFFER_REJECTED: '❌',
  OFFER_COUNTERED: '🔁',
  NEW_MESSAGE: '💬',
  FOLLOWED_SELLER_NEW_LISTING: '📣',
}

export function notificationLink(notification: Notification): string | null {
  const payload = notification.payload

  if (!payload) {
    return null
  }

  if (payload.chatId) {
    return `/chats/${payload.chatId}`
  }

  if (payload.listingId) {
    return `/listings/${payload.listingId}`
  }

  return null
}
