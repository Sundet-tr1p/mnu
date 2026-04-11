import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { profileUpdateSchema } from '@/lib/validators'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const profile = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
      role: true,
      school: true,
      specialty: true,
      bio: true,
      createdAt: true,
      _count: { select: { posts: true, likes: true } },
    },
  })

  if (!profile) return errorResponse('Профиль не найден', 404)
  return successResponse({ user: profile })
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const body = await request.json()
  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const data = parsed.data
  const updated = await prisma.user.update({
    where: { id: user.userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.surname !== undefined && { surname: data.surname }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.school !== undefined && { school: data.school }),
      ...(data.specialty !== undefined && { specialty: data.specialty }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
      role: true,
      school: true,
      specialty: true,
      bio: true,
    },
  })

  return successResponse({ user: updated })
}
