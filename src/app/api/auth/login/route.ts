import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { loginSchema } from '@/lib/validators'
import { createToken, getAuthCookieOptions } from '@/lib/jwt'
import { errorResponse } from '@/lib/api-response'
import { assertServerAuthConfig } from '@/lib/auth-env'
import { prismaErrorUserHint } from '@/lib/prisma-errors'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const cfg = assertServerAuthConfig()
  if (cfg) return cfg

  try {
    const body = await request.json()
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse('Неправильный email или пароль', 401)
    }
    const { email, password } = validation.data
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return errorResponse('Неправильный email или пароль', 401)
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return errorResponse('Неправильный email или пароль', 401)
    }
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const res = NextResponse.json(
      {
        message: 'Логин успешен',
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 200 },
    )
    res.cookies.set('token', token, getAuthCookieOptions())
    return res
  } catch (error) {
    console.error('Login error:', error)
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
    if (msg.includes('Can\'t reach database') || msg.includes('P1001') || msg.includes('P1017')) {
      return errorResponse(
        'Не удаётся подключиться к базе данных. Проверьте DATABASE_URL и доступность MySQL с сервера (Vercel).',
        503,
      )
    }
    return errorResponse('Ошибка сервера', 500)
  }
}
