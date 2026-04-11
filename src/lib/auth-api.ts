import { cookies } from 'next/headers'
import { verifyToken, type JWTPayload } from '@/lib/jwt'

export async function getAuthUser(): Promise<JWTPayload | null> {
  const store = await cookies()
  const token = store.get('token')?.value
  if (!token) return null
  return await verifyToken(token)
}
