export type ReportTargetType = 'LISTING' | 'USER'
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'DISMISSED'

export interface Report {
  id: string
  reporterId: string
  targetType: ReportTargetType
  listingId: string | null
  targetUserId: string | null
  reason: string
  description: string | null
  status: ReportStatus
  createdAt: string
}
