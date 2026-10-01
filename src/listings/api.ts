import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Listing, ListingCondition, SaleMode } from './types'

interface ListingsResponse {
  listings: Listing[]
}

interface ListingResponse {
  listing: Listing
}

export interface CreateListingInput {
  title: string
  description: string
  categoryId: string
  condition: ListingCondition
  price: number
  currency?: string
  photos?: string[]
  lat: number
  lng: number
  saleMode: SaleMode
  auctionEndAt?: string
}

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: () => apiFetch<ListingsResponse>('/listings'),
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateListingInput) =>
      apiFetch<ListingResponse>('/listings', { method: 'POST', body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
