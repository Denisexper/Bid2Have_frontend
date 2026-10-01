import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { Chat, Message } from './types'

interface ChatsResponse {
  chats: Chat[]
}

interface ChatResponse {
  chat: Chat
}

interface MessagesResponse {
  messages: Message[]
}

export function useChats() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => apiFetch<ChatsResponse>('/chats'),
  })
}

export function useChat(id: string) {
  return useQuery({
    queryKey: ['chats', id],
    queryFn: () => apiFetch<ChatResponse>(`/chats/${id}`),
  })
}

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: ['chats', chatId, 'messages'],
    queryFn: () => apiFetch<MessagesResponse>(`/chats/${chatId}/messages`),
  })
}
