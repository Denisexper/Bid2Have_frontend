import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Follow } from './types'

interface FollowingResponse {
  follows: Follow[]
}

export function useFollowing() {
  return useQuery({
    queryKey: ['follows'],
    queryFn: () => apiFetch<FollowingResponse>('/users/following'),
  })
}

export function useFollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => apiFetch(`/users/${userId}/follow`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] })
    },
  })
}

export function useUnfollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => apiFetch(`/users/${userId}/follow`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] })
    },
  })
}
