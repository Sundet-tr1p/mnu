import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, school: true },
  })
  if (!dbUser) return errorResponse('Пользователь не найден', 404)

  // Ensure membership in global + own faculty chat
  const globalChat = await prisma.chat.upsert({
    where: { id: 'seed-chat-global' },
    update: {},
    create: { id: 'seed-chat-global', name: 'Общий чат', type: 'GLOBAL' },
  })
  await prisma.chatMember.upsert({
    where: { chatId_userId: { chatId: globalChat.id, userId: dbUser.id } },
    update: {},
    create: { chatId: globalChat.id, userId: dbUser.id },
  })

  if (dbUser.school) {
    const schoolChat = await prisma.chat.upsert({
      where: { id: `school-chat-${dbUser.school}` },
      update: {},
      create: {
        id: `school-chat-${dbUser.school}`,
        name: `Факультет ${dbUser.school}`,
        type: 'GLOBAL',
      },
    })
    await prisma.chatMember.upsert({
      where: { chatId_userId: { chatId: schoolChat.id, userId: dbUser.id } },
      update: {},
      create: { chatId: schoolChat.id, userId: dbUser.id },
    })
  }

  const chats = await prisma.chat.findMany({
    where: { members: { some: { userId: user.userId } } },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, surname: true, email: true } },
        },
      },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'asc' },
  })

  return successResponse({ chats })
}
