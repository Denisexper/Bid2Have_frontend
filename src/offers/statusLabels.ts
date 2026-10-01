import type { OfferStatus } from './types'

export const offerStatusLabels: Record<OfferStatus, string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  COUNTERED: 'Contraofertada',
}
