'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Msg = {
  id: string
  text: string
  createdAt: string
  author: { id: string; name: string; surname: string }
}

type Chat = {
  id: string
  name: string
  type: string
  messages: { text: string; createdAt: string }[]
}

export default function ChatsClient() {
  const [chats, setChats] = useState<Chat[]>([])
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const listRef = useRef<HTMLDivElement | null>(null)

  // (future) could be used for dedupe stats/optimizations
  const _messageIds = useMemo(() => new Set(messages.map((m) => m.id)), [messages])

  useEffect(() => {
    fetch('/api/chats')
      .then((r) => r.json())
      .then((d) => {
        setChats(d.chats || [])
        if (d.chats?.length) {
          setChatId((prev) => prev ?? d.chats[0].id)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!chatId) return
    fetch(`/api/messages?chatId=${chatId}`)
      .then((r) => r.json())
      .then((d) => {
        const raw = d.messages || []
        setMessages(
          raw.map((m: Msg & { createdAt: string | Date }) => ({
            ...m,
            createdAt:
              typeof m.createdAt === 'string' ? m.createdAt : new Date(m.createdAt).toISOString(),
          })),
        )
      })
  }, [chatId])

  useEffect(() => {
    if (!chatId) return
    const es = new EventSource(`/api/messages/stream?chatId=${encodeURIComponent(chatId)}`)

    const onMessages = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { messages?: Array<Msg & { createdAt: string | Date }> }
        const incoming = data.messages || []
        if (incoming.length === 0) return

        setMessages((prev) => {
          const existing = new Set(prev.map((m) => m.id))
          const merged = [...prev]
          for (const m of incoming) {
            if (existing.has(m.id)) continue
            merged.push({
              ...m,
              createdAt:
                typeof m.createdAt === 'string' ? m.createdAt : new Date(m.createdAt).toISOString(),
            })
          }
          return merged
        })
      } catch {
        // ignore
      }
    }

    es.addEventListener('messages', onMessages)

    return () => {
      es.removeEventListener('messages', onMessages)
      es.close()
    }
  }, [chatId])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, chatId])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!chatId || !text.trim()) return
    const optimisticText = text.trim()
    setText('')

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, text: optimisticText }),
    })
    if (res.ok) {
      // new message will arrive via SSE
      return
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Загрузка…</div>
  }

  if (chats.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Чаты</h1>
        <p className="text-gray-500">
          У вас пока нет чатов. Запустите сид базы данных, чтобы появился общий чат.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-4xl flex-col gap-4 px-4 py-6 md:h-[calc(100vh-4rem)] md:flex-row md:py-8">
      <div className="flex w-full shrink-0 gap-2 overflow-x-auto md:w-56 md:flex-col md:space-y-1 md:gap-0">
        <h1 className="mb-3 text-lg font-bold text-gray-900">Чаты</h1>
        {chats.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setChatId(c.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm md:w-full ${
              chatId === c.id ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-gray-200 bg-white">
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <span className="font-semibold text-gray-800">
                {m.author.name} {m.author.surname}
              </span>
              <span className="ml-2 text-xs text-gray-400">
                {new Date(m.createdAt).toLocaleString('ru-RU')}
              </span>
              <p className="mt-1 text-gray-700">{m.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            placeholder="Сообщение…"
          />
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
            Отправить
          </button>
        </form>
      </div>
    </div>
  )
}
