import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'

export default async function HomePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  redirect('/feed')
}
