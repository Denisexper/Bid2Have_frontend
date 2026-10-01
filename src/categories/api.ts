import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Category } from './types'

interface CategoriesResponse {
  categories: Category[]
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch<CategoriesResponse>('/categories'),
  })
}
