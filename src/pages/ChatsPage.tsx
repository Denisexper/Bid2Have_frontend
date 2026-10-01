import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useChats } from '../chat/api'
import type { Chat } from '../chat/types'
import { useListing } from '../listings/api'
import { formatRelativeTime } from '../listings/format'

export function ChatsPage() {
  const { data, isLoading, isError } = useChats()

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-base-content/60">
        No pudimos cargar tus chats. Probá de nuevo más tarde.
      </div>
    )
  }

  const chats = data?.chats ?? []

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <span className="text-4xl">💬</span>
        <h2 className="font-bold">Todavía no tenés chats</h2>
        <p className="text-sm text-base-content/60">
          Se crean automáticamente cuando se acepta una oferta.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  )
}

function ChatListItem({ chat }: { chat: Chat }) {
  const { user } = useAuth()
  const { data } = useListing(chat.listingId)

  const role = user?.id === chat.sellerId ? 'Vendés' : 'Comprás'
  const title = data?.listing.title ?? 'Publicación'

  return (
    <Link
      to={`/chats/${chat.id}`}
      className="flex items-center gap-3 rounded-2xl bg-base-100 p-3 shadow-sm active:scale-[0.99]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
        💬
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">{title}</h3>
        <span className="text-xs text-base-content/50">{role}</span>
      </div>
      <span className="shrink-0 text-[11px] text-base-content/40">{formatRelativeTime(chat.createdAt)}</span>
    </Link>
  )
}
