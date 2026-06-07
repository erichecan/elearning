import React, { useEffect, useState } from 'react'
import { apiFetch } from '../../services/api-client'

const AnalyticsManager: React.FC<{ childId?: string }> = ({ childId }) => {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<{ total: number; byType: Array<{ event_type: string; count: number }> }>({ total: 0, byType: [] })
  const [therapist, setTherapist] = useState<{
    aacClicks: number
    recommendationShown: number
    recommendationAccepted: number
    recommendationAcceptanceRate: number
    sentenceCompleted: number
    independentCommunicationRate: number
    taskDone: number
    emotionChecks: number
    mathSuccess: number
  } | null>(null)

  const loadSummary = async () => {
    setLoading(true)
    try {
      const [response, therapistResponse] = await Promise.all([
        apiFetch(`/api/analytics/summary${childId ? `?childId=${childId}` : ''}`),
        apiFetch(`/api/analytics/therapist-summary${childId ? `?childId=${childId}` : ''}`)
      ])
      const data = await response.json()
      const therapistData = await therapistResponse.json()
      setSummary(data)
      setTherapist(therapistData)
    } catch (error) {
      console.error('Failed to load analytics summary', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [childId])

  const metric = (name: string) => summary.byType.find((item) => item.event_type === name)?.count || 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">行为与分析</h3>
          <button onClick={loadSummary} className="text-sm text-blue-600">刷新</button>
        </div>
        <div className="mt-4 text-sm text-gray-600">总事件数：{summary.total}</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500">AAC 点击</div>
            <div className="text-xl font-extrabold">{metric('aac_click')}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500">推荐展示</div>
            <div className="text-xl font-extrabold">{metric('recommendation_shown')}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500">数学成功</div>
            <div className="text-xl font-extrabold">{metric('math_make10_success') + metric('math_carry_success')}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500">情绪选择</div>
            <div className="text-xl font-extrabold">{metric('emotion_zone_selected')}</div>
          </div>
        </div>
        {therapist && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-500">推荐接受率</div>
              <div className="text-xl font-extrabold">{Math.round(therapist.recommendationAcceptanceRate * 100)}%</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-500">独立沟通率</div>
              <div className="text-xl font-extrabold">{Math.round(therapist.independentCommunicationRate * 100)}%</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-500">任务完成数</div>
              <div className="text-xl font-extrabold">{therapist.taskDone}</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {summary.byType.map(item => (
              <div key={item.event_type} className="flex items-center justify-between border rounded-lg px-4 py-3">
                <div className="font-semibold">{item.event_type}</div>
                <div className="text-gray-600">{item.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsManager
