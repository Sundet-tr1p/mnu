import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'
import { formatSchoolTrilingual } from '@/lib/schools'
import { dateLocaleTag } from '@/lib/i18n'
import { getServerLocale, st } from '@/lib/i18n-server'

export default async function ProfilePage() {
  const locale = getServerLocale()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const profile = await prisma.user.findUnique({
    where: { id: user.userId },
    include: { _count: { select: { posts: true, likes: true } } },
  })

  if (!profile) return <div className="p-8">{st(locale, 'profileNotFound')}</div>

  const initials = `${profile.name[0]}${profile.surname[0]}`

  const dateTag = dateLocaleTag(locale)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{st(locale, 'profilePageTitle')}</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {profile.name} {profile.surname}
            </h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {profile.role === 'STUDENT'
                ? st(locale, 'student')
                : profile.role === 'ADMIN'
                  ? st(locale, 'administrator')
                  : st(locale, 'teacher')}
            </span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{profile._count.posts}</div>
            <div className="text-sm text-gray-500">{st(locale, 'postsStat')}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{profile._count.likes}</div>
            <div className="text-sm text-gray-500">{st(locale, 'likesStat')}</div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {profile.school && (
            <div className="flex gap-2">
              <span className="w-28 text-gray-400">{st(locale, 'schoolShort')}</span>
              <span className="text-gray-900">{formatSchoolTrilingual(profile.school)}</span>
            </div>
          )}
          {profile.specialty && (
            <div className="flex gap-2">
              <span className="w-28 text-gray-400">{st(locale, 'specialtyShort')}</span>
              <span className="text-gray-900">{profile.specialty}</span>
            </div>
          )}
          {profile.bio && (
            <div className="flex gap-2">
              <span className="w-28 text-gray-400">{st(locale, 'bioShort')}</span>
              <span className="text-gray-900">{profile.bio}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="w-28 text-gray-400">{st(locale, 'registeredShort')}</span>
            <span className="text-gray-900">
              {new Date(profile.createdAt).toLocaleDateString(dateTag)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
