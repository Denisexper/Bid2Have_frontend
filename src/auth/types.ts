export type UserRole = 'USER' | 'SUPERADMIN'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  role: UserRole
}
