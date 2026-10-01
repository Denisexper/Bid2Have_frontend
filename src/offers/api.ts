import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Offer } from './types'

interface OfferResponse {
  offer: Offer
}

interface ListingOffersResponse {
  offers: Offer[]
}

export function useListingOffers(listingId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['listings', listingId, 'offers'],
    queryFn: () => apiFetch<ListingOffersResponse>(`/listings/${listingId}/offers`),
    enabled,
  })
}

export function useOffer(offerId: string | null) {
  return useQuery({
    queryKey: ['offers', offerId],
    queryFn: () => apiFetch<OfferResponse>(`/offers/${offerId}`),
    enabled: Boolean(offerId),
  })
}

export function useCreateOffer(listingId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (amount: number) =>
      apiFetch<OfferResponse>('/offers', { method: 'POST', body: { listingId, amount } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'offers'] })
    },
  })
}

function useOfferAction(action: 'accept' | 'reject' | 'counter', listingId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ offerId, amount }: { offerId: string; amount?: number }) =>
      apiFetch<OfferResponse>(`/offers/${offerId}/${action}`, {
        method: 'POST',
        body: amount !== undefined ? { amount } : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings', listingId, 'offers'] })
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export function useAcceptOffer(listingId: string) {
  return useOfferAction('accept', listingId)
}

export function useRejectOffer(listingId: string) {
  return useOfferAction('reject', listingId)
}

export function useCounterOffer(listingId: string) {
  return useOfferAction('counter', listingId)
}
