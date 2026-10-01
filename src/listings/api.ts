import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Listing, ListingCondition, ListingStatus, SaleMode } from './types'

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

export interface NearbyParams {
  lat: number
  lng: number
  radiusKm?: number
}

export function useListings(nearby?: NearbyParams) {
  return useQuery({
    queryKey: ['listings', nearby ?? 'all'],
    queryFn: () => {
      if (!nearby) {
        return apiFetch<ListingsResponse>('/listings')
      }

      const params = new URLSearchParams({ lat: String(nearby.lat), lng: String(nearby.lng) })
      if (nearby.radiusKm !== undefined) {
        params.set('radiusKm', String(nearby.radiusKm))
      }

      return apiFetch<ListingsResponse>(`/listings?${params.toString()}`)
    },
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listings', id],
    queryFn: () => apiFetch<ListingResponse>(`/listings/${id}`),
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

export interface UpdateListingInput {
  title?: string
  description?: string
  price?: number
  currency?: string
  condition?: ListingCondition
  photos?: string[]
  status?: ListingStatus
}

export function useUpdateListing(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateListingInput) =>
      apiFetch<ListingResponse>(`/listings/${id}`, { method: 'PATCH', body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useDeleteListing(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiFetch<void>(`/listings/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
