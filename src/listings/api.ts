import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Listing } from './types'

interface ListingsResponse {
  listings: Listing[]
}

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: () => apiFetch<ListingsResponse>('/listings'),
  })
}
