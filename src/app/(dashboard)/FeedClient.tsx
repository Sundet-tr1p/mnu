'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SCHOOL_OPTIONS } from '@/lib/schools'

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

export default function FeedClient({
  posts,
  currentUserId,
}: {
  posts: Post[]
  currentUserId: string
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const schools = ['ALL', ...SCHOOL_OPTIONS] as const

  const filtered = filter === 'ALL' ? posts : posts.filter((p) => p.author.school === filter)

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
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">News Feed</h1>
        <button
          onClick={() => router.refresh()}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm transition hover:bg-gray-50"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Create post */}
      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-xl bg-gray-50 px-4 py-3 text-left text-sm text-gray-400 transition hover:bg-gray-100"
          >
            ✏️ Написать пост...
          </button>
        ) : (
          <form onSubmit={handlePost} className="space-y-3">
            <input
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Что у вас нового?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isPosting}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isPosting ? 'Публикую...' : 'Опубликовать'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {schools.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'ALL' ? 'Все' : s}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <div className="mb-2 text-4xl">📭</div>
            <p>Постов пока нет</p>
          </div>
        )}
        {filtered.map((post) => (
          <div key={post.id} className="rounded-2xl border border-gray-200 bg-white p-5">
            {/* Author */}
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                {post.author.name[0]}
                {post.author.surname[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {post.author.name} {post.author.surname}
                </div>
                <div className="text-xs text-gray-400">
                  {post.author.school || 'Студент'} ·{' '}
                  {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>

            {/* Content */}
            <h2 className="mb-1 font-semibold text-gray-900">{post.title}</h2>
            <p className="mb-4 text-sm text-gray-600">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-sm transition ${
                  post.likes.length > 0 ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                {post.likes.length > 0 ? '❤️' : '🤍'} {post._count.likes}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-blue-500">
                💬 {post._count.comments}
              </button>
            </div>

            {/* Comments preview */}
            {post.comments.length > 0 && (
              <div className="mt-3 space-y-2">
                {post.comments.map((c, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                    <span className="font-semibold">{c.author.name}:</span> {c.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
