'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/components/layout/LocaleProvider'
import { dateLocaleTag } from '@/lib/i18n'
import { SCHOOL_OPTIONS, getSchoolLabel } from '@/lib/schools'

type Post = {
  id: string
  title: string
  content: string
  createdAt: Date
  author: { id: string; name: string; surname: string; email: string; school: string | null }
  _count: { likes: number; comments: number }
  likes: { id: string }[]
  comments: { content: string; author: { name: string; surname: string } }[]
}

export default function FeedClient({ posts }: { posts: Post[] }) {
  const { locale, t } = useLocale()
  const router = useRouter()
  const [filter, setFilter] = useState<string>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const schools = ['ALL', ...SCHOOL_OPTIONS] as const

  const filtered = filter === 'ALL' ? posts : posts.filter((p) => p.author.school === filter)
  const dateTag = dateLocaleTag(locale)

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setIsPosting(true)
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    setTitle('')
    setContent('')
    setShowForm(false)
    setIsPosting(false)
    router.refresh()
  }

  async function handleLike(postId: string) {
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('feedTitle')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {posts.length} • {t('filterAll')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-950/60"
        >
          <span aria-hidden="true">⟲</span> {t('refresh')}
        </button>
      </div>

      <div className="fx-border mb-4 rounded-2xl">
        <div className="fx-card rounded-2xl p-4">
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full rounded-xl bg-gray-50/80 px-4 py-3 text-left text-sm text-gray-500 transition hover:bg-gray-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/8"
          >
            {t('writePost')}
          </button>
        ) : (
          <form onSubmit={handlePost} className="space-y-3">
            <input
              type="text"
              placeholder={t('postTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200/70 bg-white/70 px-4 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
              required
            />
            <textarea
              placeholder={t('postBody')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200/70 bg-white/70 px-4 py-2 text-sm shadow-sm backdrop-blur transition focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-100"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/5"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isPosting}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 dark:from-indigo-600 dark:to-blue-600"
              >
                {isPosting ? t('publishing') : t('publish')}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>

      <div className="subtle-scrollbar -mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
        {schools.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === s
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/15'
                : 'border border-gray-200/70 bg-white/70 text-gray-700 shadow-sm backdrop-blur hover:bg-white dark:border-slate-700/50 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-950/60'
            }`}
          >
            {s === 'ALL' ? t('filterAll') : getSchoolLabel(s, locale)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 dark:text-slate-500">
            <p>{t('noPostsYet')}</p>
          </div>
        )}
        {filtered.map((post) => (
          <div key={post.id} className="fx-border rounded-2xl">
            <div className="fx-card rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                {post.author.name[0]}
                {post.author.surname[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {post.author.name} {post.author.surname}
                </div>
                <div className="text-xs text-gray-400 dark:text-slate-500">
                  {getSchoolLabel(post.author.school, locale)} ·{' '}
                  {new Date(post.createdAt).toLocaleDateString(dateTag)}
                </div>
              </div>
            </div>

            <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-slate-100 sm:text-[15px]">
              {post.title}
            </h2>
            <p className="mb-4 whitespace-pre-wrap text-sm text-gray-600 dark:text-slate-300">
              {post.content}
            </p>

            <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-sm transition ${
                  post.likes.length > 0 ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                {post.likes.length > 0 ? '❤️' : '🤍'} {post._count.likes}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-slate-500">
                💬 {post._count.comments}
              </span>
            </div>

            {post.comments.length > 0 && (
              <div className="mt-3 space-y-2">
                {post.comments.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-gray-50/80 px-3 py-2 text-xs text-gray-600 shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10"
                  >
                    <span className="font-semibold">{c.author.name}:</span> {c.content}
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
