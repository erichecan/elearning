import React, { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../../services/api-client'

interface StorybookItem {
  id: number
  title?: string | null
  source?: string | null
  status?: string | null
  created_at?: string
  pages?: any
}

const statusOptions = ['all', 'draft', 'approved', 'rejected', 'published']

const StorybooksManager: React.FC<{ childId?: string }> = ({ childId }) => {
  const [items, setItems] = useState<StorybookItem[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [topic, setTopic] = useState('First day at school')
  const [pages, setPages] = useState(6)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const loadItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (childId) params.set('childId', childId)
      const query = params.toString()
      const response = await apiFetch(`/api/storybooks${query ? `?${query}` : ''}`)
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load storybooks', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [statusFilter, childId])

  const summary = useMemo(() => {
    const totals: Record<string, number> = {}
    items.forEach(item => {
      const key = item.status || 'draft'
      totals[key] = (totals[key] || 0) + 1
    })
    return totals
  }, [items])

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiFetch(`/api/storybooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      loadItems()
    } catch (error) {
      console.error('Failed to update storybook', error)
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map(item => item.id)))
    }
  }

  const bulkUpdate = async (status: string) => {
    try {
      await apiFetch('/api/storybooks/bulk-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), status })
      })
      setSelectedIds(new Set())
      loadItems()
    } catch (error) {
      console.error('Bulk update failed', error)
    }
  }

  const getPageCount = (pages: any) => {
    if (!pages) return 0
    if (Array.isArray(pages)) return pages.length
    if (typeof pages === 'object' && Array.isArray(pages.pages)) return pages.pages.length
    return 0
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">绘本审核</h3>
          <button onClick={loadItems} className="text-sm text-blue-600">刷新</button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="border rounded-lg px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="text-sm text-gray-500">
            {Object.entries(summary).map(([key, value]) => (
              <span key={key} className="mr-3">{key}: {value}</span>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => bulkUpdate('approved')}
            className="bg-green-500 text-white rounded-lg px-3 py-2 text-sm"
            disabled={selectedIds.size === 0}
          >
            批量通过
          </button>
          <button
            onClick={() => bulkUpdate('rejected')}
            className="bg-red-500 text-white rounded-lg px-3 py-2 text-sm"
            disabled={selectedIds.size === 0}
          >
            批量驳回
          </button>
          <button
            onClick={() => bulkUpdate('published')}
            className="bg-indigo-500 text-white rounded-lg px-3 py-2 text-sm"
            disabled={selectedIds.size === 0}
          >
            批量发布
          </button>
          <button
            onClick={toggleSelectAll}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {selectedIds.size === items.length ? '取消全选' : '全选'}
          </button>
          <span className="text-sm text-gray-500">已选 {selectedIds.size}</span>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="故事主题"
          />
          <input
            className="border rounded-lg px-3 py-2"
            type="number"
            min={1}
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
            placeholder="页数"
          />
          <button
            onClick={async () => {
              setLoading(true)
              try {
                await apiFetch('/api/storybooks/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ topic, pages, childId })
                })
                loadItems()
              } catch (error) {
                console.error('Failed to generate storybook', error)
              } finally {
                setLoading(false)
              }
            }}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold"
          >
            AI 生成草稿
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center border rounded-lg p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
                <div>
                  <div className="font-semibold">{item.title || 'Untitled'}</div>
                  <div className="text-sm text-gray-500">页数: {getPageCount(item.pages)}</div>
                </div>
                <div className="text-sm text-gray-500">{item.source || '-'}</div>
                <div className="text-sm text-gray-500">{item.status || 'draft'}</div>
                <div className="text-sm text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleDateString('zh-CN') : '-'}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(item.id, 'approved')}
                    className="bg-green-500 text-white rounded-lg px-3 py-2 text-sm"
                  >
                    通过
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'rejected')}
                    className="bg-red-500 text-white rounded-lg px-3 py-2 text-sm"
                  >
                    驳回
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'published')}
                    className="bg-indigo-500 text-white rounded-lg px-3 py-2 text-sm"
                  >
                    发布
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StorybooksManager
