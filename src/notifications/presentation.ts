import {
  IconCheckCircle,
  IconChat,
  IconFeed,
  IconOffer,
  IconRefresh,
  IconXCircle,
  type IconComponent,
} from '../components/icons'
import type { Notification, NotificationType } from './types'

export const notificationLabels: Record<NotificationType, string> = {
  NEW_OFFER: 'Recibiste una nueva oferta',
  OFFER_ACCEPTED: 'Tu oferta fue aceptada',
  OFFER_REJECTED: 'Tu oferta fue rechazada',
  OFFER_COUNTERED: 'El vendedor te hizo una contraoferta',
  NEW_MESSAGE: 'Tenés un mensaje nuevo',
  FOLLOWED_SELLER_NEW_LISTING: 'Un vendedor que seguís publicó algo nuevo',
}

export const notificationIcons: Record<NotificationType, IconComponent> = {
  NEW_OFFER: IconOffer,
  OFFER_ACCEPTED: IconCheckCircle,
  OFFER_REJECTED: IconXCircle,
  OFFER_COUNTERED: IconRefresh,
  NEW_MESSAGE: IconChat,
  FOLLOWED_SELLER_NEW_LISTING: IconFeed,
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
