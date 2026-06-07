import React, { useEffect, useState } from 'react'
import { apiFetch } from '../../services/api-client'

interface RewardRule {
  id: number
  child_id: string
  title: string
  cost: number
  reward_payload?: any
  is_active: boolean
}

const RewardsManager: React.FC<{ childId?: string }> = ({ childId }) => {
  const [items, setItems] = useState<RewardRule[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', cost: 5 })

  const loadRewards = async () => {
    setLoading(true)
    try {
      const response = await apiFetch(`/api/rewards${childId ? `?childId=${childId}` : ''}`)
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load rewards', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRewards()
  }, [childId])

  const createReward = async () => {
    if (!childId || !form.title) return
    try {
      await apiFetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, title: form.title, cost: form.cost, reward_payload: {} })
      })
      setForm({ title: '', cost: 5 })
      loadRewards()
    } catch (error) {
      console.error('Failed to create reward', error)
    }
  }

  const updateReward = async (id: number, updates: Partial<RewardRule>) => {
    try {
      await apiFetch(`/api/rewards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      loadRewards()
    } catch (error) {
      console.error('Failed to update reward', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">奖励规则</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="奖励名称"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          />
          <input
            className="border rounded-lg px-3 py-2"
            type="number"
            min={1}
            value={form.cost}
            onChange={(e) => setForm(prev => ({ ...prev, cost: Number(e.target.value) }))}
          />
          <button
            onClick={createReward}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold"
            disabled={!childId}
          >
            新建奖励
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center border rounded-lg p-3">
                <input
                  className="border rounded px-2 py-1"
                  value={item.title}
                  onChange={(e) => setItems(prev => prev.map(r => r.id === item.id ? { ...r, title: e.target.value } : r))}
                  onBlur={() => updateReward(item.id, { title: item.title })}
                />
                <input
                  className="border rounded px-2 py-1"
                  type="number"
                  value={item.cost}
                  onChange={(e) => setItems(prev => prev.map(r => r.id === item.id ? { ...r, cost: Number(e.target.value) } : r))}
                  onBlur={() => updateReward(item.id, { cost: item.cost })}
                />
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.is_active}
                    onChange={(e) => updateReward(item.id, { is_active: e.target.checked })}
                  />
                  启用
                </label>
                <button
                  onClick={async () => {
                    if (!childId) return
                    await apiFetch('/api/rewards/redeem', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ childId, rewardId: item.id })
                    })
                  }}
                  className="bg-amber-500 text-white rounded-lg px-3 py-2 text-sm"
                >
                  兑换测试
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RewardsManager
