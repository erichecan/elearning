import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Gift, Coins, Clock3 } from 'lucide-react'
import { apiFetch } from '../services/api-client'
import { fetchChildren, getActiveChildId, setActiveChildId } from '../services/child-context'

interface RewardsScreenProps {
  onBack: () => void
}

type RewardRule = {
  id: number
  title: string
  cost: number
  is_active?: boolean
}

type RewardHistory = {
  id: number
  title?: string | null
  cost?: number | null
  status: string
  created_at: string
}

const RewardsScreen: React.FC<RewardsScreenProps> = ({ onBack }) => {
  const [childId, setChildId] = useState<string | null>(() => getActiveChildId())
  const [coins, setCoins] = useState(0)
  const [rules, setRules] = useState<RewardRule[]>([])
  const [history, setHistory] = useState<RewardHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async (targetChildId: string) => {
    setLoading(true)
    setError(null)
    try {
      const [summaryRes, rulesRes, historyRes] = await Promise.all([
        apiFetch(`/api/home/reward-summary?childId=${encodeURIComponent(targetChildId)}`),
        apiFetch(`/api/rewards?childId=${encodeURIComponent(targetChildId)}`),
        apiFetch(`/api/rewards/history?childId=${encodeURIComponent(targetChildId)}&limit=20`)
      ])
      const summary = await summaryRes.json()
      const rulesJson = await rulesRes.json()
      const historyJson = await historyRes.json()
      setCoins(Number(summary?.coins || 0))
      setRules(Array.isArray(rulesJson) ? rulesJson.filter((r) => r?.is_active !== false) : [])
      setHistory(Array.isArray(historyJson) ? historyJson : [])
    } catch (e) {
      setError('加载奖励数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const bootstrap = async () => {
      let id = childId
      if (!id) {
        try {
          const children = await fetchChildren()
          if (children.length > 0) {
            id = children[0].id
            setActiveChildId(id)
            setChildId(id)
          }
        } catch {
          id = null
        }
      }
      if (id) await loadData(id)
    }
    bootstrap()
  }, [])

  const sortedRules = useMemo(() => {
    return [...rules].sort((a, b) => Number(a.cost || 0) - Number(b.cost || 0))
  }, [rules])

  const redeem = async (rewardId: number) => {
    if (!childId) return
    try {
      const response = await apiFetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, rewardId })
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        setError(body?.error || '兑换失败')
        return
      }
      await loadData(childId)
    } catch {
      setError('兑换失败')
    }
  }

  return (
    <div className="h-full w-full max-w-6xl mx-auto p-4 md:p-6 bg-primary-50">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm">
          <ArrowLeft className="text-slate-700" />
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900">奖励兑换</h1>
        <div className="w-12" />
      </header>

      <section className="bg-white rounded-3xl p-4 shadow-card border border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Coins className="text-amber-600" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-semibold">当前金币</div>
            <div className="text-2xl font-extrabold text-slate-900">{coins}</div>
          </div>
        </div>
        {error ? <div className="mt-2 text-sm text-rose-600 font-semibold">{error}</div> : null}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-160px)]">
        <section className="bg-white rounded-3xl p-4 shadow-card border border-slate-100 overflow-y-auto">
          <div className="text-lg font-extrabold text-slate-900 mb-3">可兑换奖励</div>
          {!childId ? (
            <div className="text-sm text-slate-500 font-semibold">未找到孩子档案，请先在管理端创建孩子。</div>
          ) : loading ? (
            <div className="text-sm text-slate-500">Loading...</div>
          ) : sortedRules.length === 0 ? (
            <div className="text-sm text-slate-500 font-semibold">暂无奖励规则，请先在管理端添加。</div>
          ) : (
            <div className="space-y-3">
              {sortedRules.map((rule) => {
                const affordable = coins >= Number(rule.cost || 0)
                return (
                  <div key={rule.id} className="border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Gift size={18} className="text-emerald-700" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{rule.title}</div>
                        <div className="text-sm text-slate-500">{rule.cost} 金币</div>
                      </div>
                    </div>
                    <button
                      onClick={() => redeem(rule.id)}
                      disabled={!affordable}
                      className={`px-3 py-2 rounded-xl text-sm font-bold ${affordable ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      兑换
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl p-4 shadow-card border border-slate-100 overflow-y-auto">
          <div className="text-lg font-extrabold text-slate-900 mb-3">兑换历史</div>
          {history.length === 0 ? (
            <div className="text-sm text-slate-500 font-semibold">暂无历史记录</div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-800">{item.title || `奖励 #${item.id}`}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock3 size={12} />
                      {new Date(item.created_at).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">-{Number(item.cost || 0)} 金币</div>
                    <div className="text-xs text-emerald-600 font-semibold">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default RewardsScreen
