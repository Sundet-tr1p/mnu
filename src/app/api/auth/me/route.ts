import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  const jwtUser = await getAuthUser()
  if (!jwtUser) return errorResponse('Не авторизован', 401)

  const user = await prisma.user.findUnique({
    where: { id: jwtUser.userId },
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

  if (!user) return errorResponse('Пользователь не найден', 404)

  return successResponse({
    user: {
      ...user,
      role: jwtUser.role,
    },
  })
}
