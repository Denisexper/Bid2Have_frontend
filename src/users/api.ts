import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { AdminUser, UserStatus } from './types'

interface UsersResponse {
  users: AdminUser[]
}

interface UserResponse {
  user: AdminUser
}

export function useAdminUsers(status?: UserStatus) {
  return useQuery({
    queryKey: ['admin-users', status ?? 'all'],
    queryFn: () => apiFetch<UsersResponse>(`/users${status ? `?status=${status}` : ''}`),
  })
}

function useUserStatusAction(action: 'suspend' | 'reactivate') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiFetch<UserResponse>(`/users/${id}/${action}`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useSuspendUser() {
  return useUserStatusAction('suspend')
}

export function useReactivateUser() {
  return useUserStatusAction('reactivate')
}
