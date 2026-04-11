import { getCurrentUser } from '@/lib/jwt'
import prisma from '@/lib/db'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  const profile = await prisma.user.findUnique({
    where: { id: user!.userId },
    include: { _count: { select: { posts: true, likes: true } } },
  })

  if (!profile) return <div>Профиль не найден</div>

  const initials = `${profile.name[0]}${profile.surname[0]}`

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile</h1>
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
              {profile.role === 'STUDENT' ? '📚 Student' : '👨‍🏫 Teacher'}
            </span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{profile._count.posts}</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{profile._count.likes}</div>
            <div className="text-sm text-gray-500">Likes received</div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {profile.school && (
            <div className="flex gap-2">
              <span className="w-24 text-gray-400">School:</span>
              <span className="text-gray-900">{profile.school}</span>
            </div>
          )}
          {profile.specialty && (
            <div className="flex gap-2">
              <span className="w-24 text-gray-400">Specialty:</span>
              <span className="text-gray-900">{profile.specialty}</span>
            </div>
          )}
          {profile.bio && (
            <div className="flex gap-2">
              <span className="w-24 text-gray-400">Bio:</span>
              <span className="text-gray-900">{profile.bio}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="w-24 text-gray-400">Joined:</span>
            <span className="text-gray-900">
              {new Date(profile.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
