// === src/app/(dashboard)/surveys/page.tsx ===
import prisma from '@/lib/db'

export default async function SurveysPage() {
  const surveys = await prisma.survey.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Surveys</h1>
      {surveys.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <div className="mb-2 text-4xl">📋</div>
          <p>Опросов пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {surveys.map((survey) => (
            <a
              key={survey.id}
              href={survey.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <div>
                <h2 className="font-semibold text-gray-900">{survey.title}</h2>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(survey.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <span className="text-blue-500">→</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
