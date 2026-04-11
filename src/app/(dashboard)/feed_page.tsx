import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import FeedClient from './FeedClient'

export default async function FeedPage() {
  const user = await getCurrentUser()

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, surname: true, email: true, school: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: user!.userId }, select: { id: true } },
      comments: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { author: { select: { name: true, surname: true } } },
      },
    },
  })

  return <FeedClient posts={posts} currentUserId={user!.userId} />
}
