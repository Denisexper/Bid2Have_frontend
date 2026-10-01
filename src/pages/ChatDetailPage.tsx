import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useChat, useChatMessages } from '../chat/api'
import { formatMessageTime } from '../chat/format'
import { getChatSocket } from '../chat/socket'
import type { Message } from '../chat/types'
import { useListing } from '../listings/api'

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

  return (
    <div className="flex h-[calc(100vh-9.5rem)] flex-col">
      {listingData && <h1 className="mb-2 truncate text-sm font-bold">{listingData.listing.title}</h1>}

      <div className="flex-1 overflow-y-auto rounded-2xl bg-base-100 p-3">
        <div className="flex flex-col gap-2">
          {messages.map((message) => {
            const isMine = message.senderId === user?.id
            return (
              <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    isMine ? 'bg-primary text-primary-content' : 'bg-base-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <span className="mt-0.5 block text-right text-[10px] opacity-60">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSend} className="mt-2 flex gap-2">
        <input
          type="text"
          className="input input-bordered flex-1"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribí un mensaje..."
        />
        <button type="submit" className="btn btn-primary" disabled={!draft.trim()}>
          Enviar
        </button>
      </form>
    </div>
  )
}
