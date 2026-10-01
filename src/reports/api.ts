import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Report, ReportStatus } from './types'

interface ReportsResponse {
  reports: Report[]
}

interface ReportResponse {
  report: Report
}

export function useReports(status?: ReportStatus) {
  return useQuery({
    queryKey: ['reports', status ?? 'all'],
    queryFn: () => apiFetch<ReportsResponse>(`/reports${status ? `?status=${status}` : ''}`),
  })
}

function useReportAction(action: 'review' | 'dismiss') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiFetch<ReportResponse>(`/reports/${id}/${action}`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export function useReviewReport() {
  return useReportAction('review')
}

export function useDismissReport() {
  return useReportAction('dismiss')
}
