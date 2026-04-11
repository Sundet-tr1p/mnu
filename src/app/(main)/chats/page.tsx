import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import ChatsClient from '@/components/chats/ChatsClient'

export default async function ChatsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return <ChatsClient />
}
