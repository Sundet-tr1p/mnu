import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { errorResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function sse(data: unknown, event?: string) {
  const payload = `data: ${JSON.stringify(data)}\n\n`
  return event ? `event: ${event}\n${payload}` : payload
}

function safeEnqueue(
  controller: ReadableStreamDefaultController<Uint8Array>,
  enc: TextEncoder,
  chunk: string,
): boolean {
  try {
    controller.enqueue(enc.encode(chunk))
    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const chatId = request.nextUrl.searchParams.get('chatId')
  if (!chatId) return errorResponse('Нужен chatId', 400)

  const member = await prisma.chatMember.findUnique({
    where: { chatId_userId: { chatId, userId: user.userId } },
  })
  if (!member) return errorResponse('Нет доступа к чату', 403)

  let lastCreatedAt = new Date(0)
  let interval: ReturnType<typeof setInterval> | undefined
  let stopped = false

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder()

      if (!safeEnqueue(controller, enc, `retry: 1500\n`) || !safeEnqueue(controller, enc, `: connected\n\n`)) {
        stopped = true
        return
      }

      interval = setInterval(async () => {
        if (stopped) return
        try {
          const newMessages = await prisma.message.findMany({
            where: {
              chatId,
              createdAt: { gt: lastCreatedAt },
            },
            orderBy: { createdAt: 'asc' },
            include: {
              author: { select: { id: true, name: true, surname: true } },
            },
            take: 50,
          })

          if (stopped) return

          if (newMessages.length > 0) {
            lastCreatedAt = newMessages[newMessages.length - 1].createdAt
            if (!safeEnqueue(controller, enc, sse({ messages: newMessages }, 'messages'))) {
              stopped = true
              if (interval) clearInterval(interval)
            }
          } else {
            if (!safeEnqueue(controller, enc, `: keep-alive\n\n`)) {
              stopped = true
              if (interval) clearInterval(interval)
            }
          }
        } catch {
          if (!stopped) {
            safeEnqueue(controller, enc, sse({ error: 'stream_error' }, 'error'))
          }
        }
      }, 1000)

      const cleanup = () => {
        stopped = true
        if (interval) {
          clearInterval(interval)
          interval = undefined
        }
        try {
          controller.close()
        } catch {
          // already closed
        }
      }

      request.signal.addEventListener('abort', cleanup)
    },
    cancel() {
      stopped = true
      if (interval) {
        clearInterval(interval)
        interval = undefined
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
