// === src/app/(dashboard)/organizations/page.tsx ===
import prisma from '@/lib/db'

export default async function OrganizationsPage() {
  const orgs = await prisma.organization.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Organizations</h1>
      {orgs.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <div className="mb-2 text-4xl">🏛️</div>
          <p>Организаций пока нет</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orgs.map((org) => (
            <div key={org.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-2xl">{org.icon || '🏛️'}</span>
                <h2 className="font-semibold text-gray-900">{org.name}</h2>
              </div>
              <p className="text-sm text-gray-500">{org.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
