import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Play } from 'lucide-react'
import { apiFetch } from '../services/api-client'
import { speechService } from '../services/speech'
import { getActiveChildId } from '../services/child-context'

interface StorybooksScreenProps {
  onBack: () => void
}

type Storybook = {
  id: number
  title: string
  pages: any
}

const StorybooksScreen: React.FC<StorybooksScreenProps> = ({ onBack }) => {
  const [items, setItems] = useState<Storybook[]>([])
  const [activeBook, setActiveBook] = useState<Storybook | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [playingAll, setPlayingAll] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())

  const getDeviceId = () => {
    const key = 'deviceId'
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const id = `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(key, id)
    return id
  }

  useEffect(() => {
    const childId = getActiveChildId()
    apiFetch(`/api/public/storybooks${childId ? `?childId=${encodeURIComponent(childId)}` : ''}`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))

    const userId = getDeviceId()
    apiFetch(`/api/storybooks/favorites?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFavoriteIds(new Set(data.map((id) => Number(id))))
      })
      .catch(() => undefined)
  }, [])

  const pages = useMemo(() => {
    if (!activeBook) return []
    if (Array.isArray(activeBook.pages)) return activeBook.pages
    return []
  }, [activeBook])

  const currentPage = pages[pageIndex] || null
  const currentText = typeof currentPage === 'string'
    ? currentPage
    : currentPage?.text || currentPage?.content || ''
  const currentImage = typeof currentPage === 'object'
    ? currentPage?.image_url || currentPage?.image || ''
    : ''

  const playAllPages = async () => {
    if (!pages.length || playingAll) return
    setPlayingAll(true)
    try {
      for (let i = pageIndex; i < pages.length; i += 1) {
        setPageIndex(i)
        const page = pages[i]
        const text = typeof page === 'string' ? page : page?.text || page?.content || ''
        if (!text) continue
        await speechService.speakWord(text)
      }
    } finally {
      setPlayingAll(false)
    }
  }

  const toggleFavorite = async (storybookId: number) => {
    const userId = getDeviceId()
    const isFav = favoriteIds.has(storybookId)
    if (isFav) {
      await apiFetch('/api/storybooks/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, storybookId })
      }).catch(() => undefined)
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        next.delete(storybookId)
        return next
      })
      return
    }
    await apiFetch('/api/storybooks/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, storybookId })
    }).catch(() => undefined)
    setFavoriteIds((prev) => new Set([...prev, storybookId]))
  }

  if (!activeBook) {
    return (
      <div className="h-full w-full max-w-6xl mx-auto p-4 md:p-6">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-3 bg-white text-secondary-600 rounded-2xl shadow-soft border border-secondary-50"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">绘本阅读</h1>
          <div className="w-12" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((book) => (
            <button
              key={book.id}
              onClick={() => {
                setActiveBook(book)
                setPageIndex(0)
              }}
              className="bg-white rounded-2xl p-4 border border-slate-200 text-left shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-slate-900">{book.title || `Story #${book.id}`}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(book.id)
                  }}
                  className={`px-2 py-1 text-xs rounded-full ${favoriteIds.has(book.id) ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}
                >
                  {favoriteIds.has(book.id) ? '已收藏' : '收藏'}
                </button>
              </div>
              <div className="text-sm text-slate-500 mt-1">共 {Array.isArray(book.pages) ? book.pages.length : 0} 页</div>
            </button>
          ))}
          {items.length === 0 && (
            <div className="text-slate-500 font-semibold">暂无绘本，请先在管理端生成并发布。</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full max-w-6xl mx-auto p-4 md:p-6">
      <header className="flex items-center justify-between mb-5">
        <button
          onClick={() => setActiveBook(null)}
          className="p-3 bg-white text-secondary-600 rounded-2xl shadow-soft border border-secondary-50"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-extrabold text-slate-900">{activeBook.title}</h1>
        <button
          onClick={() => speechService.speakWord(currentText || activeBook.title || '').catch(() => undefined)}
          className="p-3 bg-white text-slate-700 rounded-2xl shadow-soft border border-slate-200"
        >
          <Volume2 size={20} />
        </button>
      </header>

      <section className="bg-white rounded-3xl p-4 shadow-card border border-slate-200 h-[calc(100%-84px)] flex flex-col">
        <div className="text-sm font-semibold text-slate-500 mb-2">第 {pageIndex + 1} / {Math.max(1, pages.length)} 页</div>
        <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col gap-3">
          {currentImage ? (
            <img src={currentImage} alt="storybook-page" className="w-full h-64 object-cover rounded-2xl" />
          ) : null}
          <div className="text-lg leading-relaxed font-semibold text-slate-800">{currentText || '本页暂无文本内容'}</div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            disabled={pageIndex <= 0}
            onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 disabled:opacity-40 flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            上一页
          </button>
          <button
            onClick={playAllPages}
            disabled={playingAll || pages.length === 0}
            className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 disabled:opacity-40 flex items-center gap-2"
          >
            <Play size={18} />
            {playingAll ? '播放中' : '逐页朗读'}
          </button>
          <button
            disabled={pageIndex >= pages.length - 1}
            onClick={() => setPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 disabled:opacity-40 flex items-center gap-2"
          >
            下一页
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default StorybooksScreen
