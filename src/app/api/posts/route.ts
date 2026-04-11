import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { postCreateSchema } from '@/lib/validators'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, name: true, surname: true, email: true, school: true },
      },
      _count: { select: { likes: true, comments: true } },
    },
    take: 100,
  })
  return successResponse({ posts })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const body = await request.json()
  const parsed = postCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Ошибка валидации', 400)
  }

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: user.userId,
    },
    include: {
      author: {
        select: { id: true, name: true, surname: true, email: true, school: true },
      },
      _count: { select: { likes: true, comments: true } },
    },
  })

  return successResponse({ post }, 201)
}
