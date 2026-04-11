// === src/app/(dashboard)/faq/page.tsx ===
import prisma from '@/lib/db'

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">FAQ</h1>
      {faqs.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <div className="mb-2 text-4xl">❓</div>
          <p>Вопросов пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5"
            >
              <summary className="flex list-none items-center justify-between font-semibold text-gray-900">
                {faq.question}
                <span className="text-gray-400 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
