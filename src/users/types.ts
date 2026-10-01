import type { UserRole } from '../auth/types'

export type UserStatus = 'ACTIVE' | 'SUSPENDED'

export interface AdminUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}
