import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Rating } from './types'

interface UserRatingsResponse {
  average: number | null
  ratings: Rating[]
}

export function useUserRatings(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'ratings'],
    queryFn: () => apiFetch<UserRatingsResponse>(`/users/${userId}/ratings`),
    enabled: Boolean(userId),
  })
}
