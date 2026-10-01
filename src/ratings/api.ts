import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Rating } from './types'

interface UserRatingsResponse {
  average: number | null
  ratings: Rating[]
}

interface RatingResponse {
  rating: Rating
}

export interface CreateRatingInput {
  score: number
  comment?: string
}

export function useUserRatings(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'ratings'],
    queryFn: () => apiFetch<UserRatingsResponse>(`/users/${userId}/ratings`),
    enabled: Boolean(userId),
  })
}

export function useCreateRating(offerId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateRatingInput) =>
      apiFetch<RatingResponse>(`/offers/${offerId}/ratings`, { method: 'POST', body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
