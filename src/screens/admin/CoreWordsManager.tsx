import React, { useEffect, useState } from 'react'

interface CoreWordItem {
  id: number
  word_en: string
  word_zh: string | null
  image_url: string | null
  is_active: boolean
}

const emptyForm = {
  word_en: '',
  word_zh: '',
  image_url: ''
}

const CoreWordsManager: React.FC = () => {
  const [items, setItems] = useState<CoreWordItem[]>([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const loadItems = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/vocabulary-items?type=core')
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load core words', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleCreate = async () => {
    if (!form.word_en.trim()) return
    try {
      const response = await fetch('http://localhost:3001/api/vocabulary-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'core',
          word_en: form.word_en.trim(),
          word_zh: form.word_zh.trim() || null,
          image_url: form.image_url.trim() || null,
          is_active: true
        })
      })
      const created = await response.json()
      setItems(prev => [created, ...prev])
      setForm({ ...emptyForm })
    } catch (error) {
      console.error('Failed to create core word', error)
    }
  }

  const handleUpdate = async (item: CoreWordItem) => {
    setSavingId(item.id)
    try {
      const response = await fetch(`http://localhost:3001/api/vocabulary-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word_en: item.word_en,
          word_zh: item.word_zh,
          image_url: item.image_url,
          is_active: item.is_active
        })
      })
      const updated = await response.json()
      setItems(prev => prev.map(row => row.id === updated.id ? updated : row))
    } catch (error) {
      console.error('Failed to update core word', error)
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/vocabulary-items/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(row => row.id !== id))
    } catch (error) {
      console.error('Failed to delete core word', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">新增 Core Word</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="English"
            value={form.word_en}
            onChange={(e) => setForm(prev => ({ ...prev, word_en: e.target.value }))}
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="中文"
            value={form.word_zh}
            onChange={(e) => setForm(prev => ({ ...prev, word_zh: e.target.value }))}
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="图片 URL"
            value={form.image_url}
            onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold"
          >
            新增
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Core Words 列表</h3>
          <button
            onClick={loadItems}
            className="text-sm text-blue-600"
          >
            刷新
          </button>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center border rounded-lg p-3">
                <input
                  className="border rounded px-2 py-1"
                  value={item.word_en}
                  onChange={(e) => setItems(prev => prev.map(row => row.id === item.id ? { ...row, word_en: e.target.value } : row))}
                />
                <input
                  className="border rounded px-2 py-1"
                  value={item.word_zh || ''}
                  onChange={(e) => setItems(prev => prev.map(row => row.id === item.id ? { ...row, word_zh: e.target.value } : row))}
                />
                <input
                  className="border rounded px-2 py-1"
                  value={item.image_url || ''}
                  onChange={(e) => setItems(prev => prev.map(row => row.id === item.id ? { ...row, image_url: e.target.value } : row))}
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">启用</label>
                  <input
                    type="checkbox"
                    checked={item.is_active}
                    onChange={(e) => setItems(prev => prev.map(row => row.id === item.id ? { ...row, is_active: e.target.checked } : row))}
                  />
                </div>
                <button
                  onClick={() => handleUpdate(item)}
                  className="bg-green-500 text-white rounded-lg px-3 py-2 text-sm"
                >
                  {savingId === item.id ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white rounded-lg px-3 py-2 text-sm"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CoreWordsManager
