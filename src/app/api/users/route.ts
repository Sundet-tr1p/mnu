import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const role = request.nextUrl.searchParams.get('role')
  const where =
    role === 'TEACHER' || role === 'STUDENT' ? { role: role as 'TEACHER' | 'STUDENT' } : {}

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
      role: true,
      school: true,
      specialty: true,
    },
    orderBy: { surname: 'asc' },
    take: 200,
  })

  return successResponse({ users })
}
