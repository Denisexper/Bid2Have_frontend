import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Notification } from './types'

interface NotificationsResponse {
  notifications: Notification[]
}

interface NotificationResponse {
  notification: Notification
}

const UNREAD_POLL_INTERVAL = 20_000

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiFetch<NotificationsResponse>('/notifications'),
    refetchInterval: UNREAD_POLL_INTERVAL,
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
