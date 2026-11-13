import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@api/client'
import type { Notification } from './types'

interface NotificationsResponse {
  notifications: Notification[]
}

interface NotificationResponse {
  notification: Notification
}

const UNREAD_POLL_INTERVAL = 20_000

export function useNotifications(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiFetch<NotificationsResponse>('/notifications'),
    refetchInterval: UNREAD_POLL_INTERVAL,
    enabled: options?.enabled ?? true,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiFetch<NotificationResponse>(`/notifications/${id}/read`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => apiFetch<NotificationResponse>(`/notifications/${id}/read`, { method: 'PATCH' }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useClearNotifications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiFetch<void>('/notifications', { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
