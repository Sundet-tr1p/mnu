import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { registerSchema } from '@/lib/validators'
import { createToken, getAuthCookieOptions } from '@/lib/jwt'
import { errorResponse } from '@/lib/api-response'
import { ChatType } from '@prisma/client'

export async function POST(request: NextRequest) {
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
    return errorResponse('Ошибка сервера', 500)
  }
}
