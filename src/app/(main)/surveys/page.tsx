import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import SurveysClient from '@/components/surveys/SurveysClient'

export default async function SurveysPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const surveys = await prisma.survey.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <SurveysClient initialSurveys={surveys} canEdit={user.role === 'ADMIN'} />
}
