import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth-api'
import { successResponse, errorResponse } from '@/lib/api-response'
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) return errorResponse('Не авторизован', 401)

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { id: true, authorId: true },
  })
  if (!post) return errorResponse('Пост не найден', 404)

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: post.id, userId: user.userId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return successResponse({ liked: false })
  }

  await prisma.like.create({
    data: { postId: post.id, userId: user.userId },
  })

  return successResponse({ liked: true })
}
