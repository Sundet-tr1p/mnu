import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import FaqClient from '@/components/faq/FaqClient'

export default async function FaqPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } })

  return <FaqClient initialFaqs={faqs} canEdit={user.role === 'ADMIN'} />
}
