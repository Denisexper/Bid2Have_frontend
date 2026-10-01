import { io, type Socket } from 'socket.io-client'
import { getToken } from '../api/client'

let socket: Socket | null = null

export function getChatSocket(): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: { token: getToken() },
      autoConnect: false,
    })
  }

  return socket
}

export function disconnectChatSocket(): void {
  socket?.disconnect()
  socket = null
}
