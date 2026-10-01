import type { ReportStatus, ReportTargetType } from './types'

export const reportStatusLabels: Record<ReportStatus, string> = {
  PENDING: 'Pendiente',
  REVIEWED: 'Revisado',
  DISMISSED: 'Descartado',
}

export const reportTargetTypeLabels: Record<ReportTargetType, string> = {
  LISTING: 'Publicación',
  USER: 'Usuario',
}
