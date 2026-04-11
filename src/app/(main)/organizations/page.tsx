import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import OrganizationsClient from '@/components/organizations/OrganizationsClient'

export default async function OrganizationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <OrganizationsClient organizations={orgs} />
}
