import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { registerSchema } from '@/lib/validators'
import { createToken, getAuthCookieOptions } from '@/lib/jwt'
import { errorResponse } from '@/lib/api-response'
import { assertServerAuthConfig } from '@/lib/auth-env'
import { prismaErrorUserHint } from '@/lib/prisma-errors'
import { ChatType, Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const cfg = assertServerAuthConfig()
  if (cfg) return cfg

  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message
      return errorResponse(firstError || 'Ошибка валидации', 400)
    }
    const { email, password, name, surname, role, school } = validation.data
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return errorResponse('Пользователь с таким email уже существует', 409)
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, surname, role, school },
    })

    // Auto-enroll user to common chat and faculty chat
    const globalChat = await prisma.chat.upsert({
      where: { id: 'seed-chat-global' },
      update: {},
      create: {
        id: 'seed-chat-global',
        name: 'Общий чат',
        type: ChatType.GLOBAL,
      },
    })

    const facultyChat = await prisma.chat.upsert({
      where: { id: `school-chat-${school}` },
      update: {},
      create: {
        id: `school-chat-${school}`,
        name: `Факультет ${school}`,
        type: ChatType.GLOBAL,
      },
    })

    await prisma.chatMember.createMany({
      data: [
        { chatId: globalChat.id, userId: user.id },
        { chatId: facultyChat.id, userId: user.id },
      ],
      skipDuplicates: true,
    })

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const res = NextResponse.json(
      {
        message: 'Регистрация успешна',
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 },
    )
    res.cookies.set('token', token, getAuthCookieOptions())
    return res
  } catch (error) {
    console.error('Register error:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return errorResponse('Пользователь с таким email уже существует', 409)
      }
    }
    const prismaHint = prismaErrorUserHint(error)
    if (prismaHint) {
      return errorResponse(prismaHint, 503)
    }
    const msg = error instanceof Error ? error.message : ''
    if (msg.includes('JWT_SECRET')) {
      return errorResponse(
        'Сервер не настроен: задайте JWT_SECRET в переменных окружения хостинга.',
        503,
      )
    }
    if (
      msg.includes('Invalid value for argument') ||
      msg.includes('not found in enum') ||
      msg.includes('School')
    ) {
      return errorResponse(
        'Схема базы устарела: выполните на сервере npx prisma migrate deploy и перезапустите деплой.',
        503,
      )
    }
    if (msg.includes('Can\'t reach database') || msg.includes('P1001') || msg.includes('P1017')) {
      return errorResponse(
        'Не удаётся подключиться к базе данных. Проверьте DATABASE_URL и что MySQL доступен из интернета для Vercel.',
        503,
      )
    }
    return errorResponse('Ошибка сервера', 500)
  }
}
