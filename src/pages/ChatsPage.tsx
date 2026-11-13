import { Link } from 'react-router-dom'
import { useAuth } from '@auth/AuthContext'
import { useChats } from '@chat/api'
import type { Chat } from '@chat/types'
import { useListing } from '@listings/api'
import { formatRelativeTime } from '@listings/format'
import { useNotifications } from '@notifications/api'
import { IconChat } from '@components/icons'

export function ChatsPage() {
  const { data, isLoading, isError } = useChats()
  const { data: notifData } = useNotifications()

  const unreadChatIds = new Set(
    (notifData?.notifications ?? [])
      .filter((n) => n.type === 'NEW_MESSAGE' && !n.read && n.payload?.chatId)
      .map((n) => n.payload!.chatId as string),
  )

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
        <span className="h-10 w-10 text-base-content/25">
          <IconChat />
        </span>
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
        <ChatListItem key={chat.id} chat={chat} hasUnread={unreadChatIds.has(chat.id)} />
      ))}
    </div>
  )
}

function ChatListItem({ chat, hasUnread }: { chat: Chat; hasUnread: boolean }) {
  const { user } = useAuth()
  const { data } = useListing(chat.listingId)

  const role = user?.id === chat.sellerId ? 'Vendés' : 'Comprás'
  const title = data?.listing.title ?? 'Publicación'

  return (
    <Link
      to={`/chats/${chat.id}`}
      className="flex items-center gap-3 border-2 border-base-300 bg-base-100 p-3 active:scale-[0.99]"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 p-2.5">
        <IconChat />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-base-100" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className={`truncate text-sm ${hasUnread ? 'font-extrabold' : 'font-bold'}`}>{title}</h3>
        <span className={`text-xs ${hasUnread ? 'font-semibold text-base-content/80' : 'text-base-content/50'}`}>
          {role}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[11px] text-base-content/40">{formatRelativeTime(chat.createdAt)}</span>
        {hasUnread && <span className="h-2 w-2 rounded-full bg-primary" />}
      </div>
    </Link>
  )
}
