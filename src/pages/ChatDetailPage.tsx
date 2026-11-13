import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@auth/AuthContext'
import { useChat, useChatMessages } from '@chat/api'
import { formatDateDivider, formatMessageTime, isSameCalendarDay } from '@chat/format'
import { getChatSocket } from '@chat/socket'
import type { Message } from '@chat/types'
import { useListing } from '@listings/api'
import { IconArrowLeft, IconChat, IconSend } from '@components/icons'

const FIVE_MINUTES_MS = 5 * 60 * 1000

export function ChatDetailPage() {
  const { id: chatId } = useParams<{ id: string }>()

  if (!chatId) {
    return null
  }

  return <ChatThread key={chatId} chatId={chatId} />
}

function ChatThread({ chatId }: { chatId: string }) {
  const { user } = useAuth()
  const { data: chatData } = useChat(chatId)
  const { data: messagesData, isLoading, isError } = useChatMessages(chatId)
  const { data: listingData } = useListing(chatData?.chat.listingId ?? '')

  const [liveMessages, setLiveMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchedMessages = messagesData?.messages ?? []
  const messages = [
    ...fetchedMessages,
    ...liveMessages.filter((live) => !fetchedMessages.some((fetched) => fetched.id === live.id)),
  ]

  useEffect(() => {
    const socket = getChatSocket()
    socket.connect()
    socket.emit('join_chat', { chatId })

    function handleNewMessage(message: Message): void {
      if (message.chatId !== chatId) return
      setLiveMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]))
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.disconnect()
    }
  }, [chatId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  function handleSend(event: FormEvent): void {
    event.preventDefault()
    const content = draft.trim()
    if (!content) return

    getChatSocket().emit('send_message', { chatId, content })
    setDraft('')
  }

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
        No pudimos cargar este chat. Probá de nuevo más tarde.
      </div>
    )
  }

  const chat = chatData?.chat
  const listing = listingData?.listing
  const counterpart = chat && user ? (user.id === chat.sellerId ? chat.buyer : chat.seller) : null
  const initial = counterpart?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="flex h-[calc(100vh-9.5rem)] flex-col border-2 border-base-300 bg-base-100">
      <div className="flex shrink-0 items-center gap-3 border-b-2 border-base-300 bg-base-100 p-2.5">
        <Link
          to="/chats"
          aria-label="Volver a chats"
          className="btn btn-circle btn-ghost btn-sm shrink-0"
        >
          <span className="h-5 w-5">
            <IconArrowLeft />
          </span>
        </Link>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
          {initial}
        </div>

        <Link to={listing ? `/listings/${listing.id}` : '#'} className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold">{counterpart?.name ?? 'Chat'}</h1>
          <p className="truncate text-xs text-base-content/50">
            {counterpart?.email}
            {counterpart && listing ? ' · ' : ''}
            {listing?.title}
          </p>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto bg-base-200 p-3">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="h-9 w-9 text-base-content/25">
              <IconChat />
            </span>
            <p className="max-w-[220px] text-sm text-base-content/50">
              Escribile para coordinar dónde encontrarse y cerrar la compra.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message, index) => {
              const previous = messages[index - 1]
              const next = messages[index + 1]
              const isMine = message.senderId === user?.id

              const sameSenderAsPrevious = previous?.senderId === message.senderId
              const closeToPrevious =
                sameSenderAsPrevious &&
                new Date(message.createdAt).getTime() - new Date(previous.createdAt).getTime() < FIVE_MINUTES_MS &&
                isSameCalendarDay(previous.createdAt, message.createdAt)

              const sameSenderAsNext = next?.senderId === message.senderId
              const closeToNext =
                sameSenderAsNext &&
                new Date(next.createdAt).getTime() - new Date(message.createdAt).getTime() < FIVE_MINUTES_MS &&
                isSameCalendarDay(message.createdAt, next.createdAt)

              const isFirstInGroup = !closeToPrevious
              const isLastInGroup = !closeToNext
              const showDateDivider = !previous || !isSameCalendarDay(previous.createdAt, message.createdAt)

              const bubbleCorners = isMine
                ? `rounded-2xl ${!isFirstInGroup ? 'rounded-tr-md' : ''} ${!isLastInGroup ? 'rounded-br-md' : ''}`
                : `rounded-2xl ${!isFirstInGroup ? 'rounded-tl-md' : ''} ${!isLastInGroup ? 'rounded-bl-md' : ''}`

              const tail = isLastInGroup
                ? isMine
                  ? "after:absolute after:bottom-0 after:-right-[5px] after:h-3 after:w-3 after:bg-neutral after:[clip-path:polygon(0_0,0_100%,100%_100%)]"
                  : "after:absolute after:bottom-0 after:-left-[5px] after:h-3 after:w-3 after:border after:border-base-300 after:bg-base-100 after:[clip-path:polygon(100%_0,0_100%,100%_100%)]"
                : ''

              return (
                <div key={message.id}>
                  {showDateDivider && (
                    <div className="my-4 flex justify-center">
                      <span className="rounded-full bg-base-300/70 px-2.5 py-0.5 text-[11px] font-semibold text-base-content/60">
                        {formatDateDivider(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-2.5' : 'mt-0.5'}`}>
                    <div
                      className={`relative max-w-[78%] px-3.5 py-2 text-sm shadow-sm ${bubbleCorners} ${tail} ${
                        isMine ? 'bg-neutral text-neutral-content' : 'border border-base-300 bg-base-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words leading-snug">{message.content}</p>
                      <span
                        className={`mt-1 block text-right text-[10px] ${
                          isMine ? 'text-neutral-content/60' : 'text-base-content/40'
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex shrink-0 items-center gap-2 border-t-2 border-base-300 bg-base-100 p-2.5">
        <input
          type="text"
          className="input input-bordered flex-1 rounded-full"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribí un mensaje..."
        />
        <button
          type="submit"
          aria-label="Enviar mensaje"
          className="btn btn-circle btn-neutral shrink-0"
          disabled={!draft.trim()}
        >
          <span className="h-5 w-5">
            <IconSend />
          </span>
        </button>
      </form>
    </div>
  )
}
