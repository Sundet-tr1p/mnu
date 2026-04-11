import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { messageCreateSchema } from '@/lib/validators'
import { successResponse, errorResponse } from '@/lib/api-response'
export async function GET(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const chatId = request.nextUrl.searchParams.get('chatId')
  if (!chatId) return errorResponse('Нужен chatId', 400)

  const member = await prisma.chatMember.findUnique({
    where: { chatId_userId: { chatId, userId: user.userId } },
  })
  if (!member) return errorResponse('Нет доступа к чату', 403)

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
    include: {
      author: { select: { id: true, name: true, surname: true } },
    },
    take: 200,
  })

  return successResponse({ messages })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const body = await request.json()
  const parsed = messageCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const { chatId, text } = parsed.data

  const member = await prisma.chatMember.findUnique({
    where: { chatId_userId: { chatId, userId: user.userId } },
  })
  if (!member) return errorResponse('Нет доступа к чату', 403)

  const message = await prisma.message.create({
    data: { chatId, authorId: user.userId, text },
    include: {
      author: { select: { id: true, name: true, surname: true } },
    },
  })

  return successResponse({ message }, 201)
}
