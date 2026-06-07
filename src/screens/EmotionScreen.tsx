import React, { useMemo, useState } from 'react'
import { ArrowLeft, HeartPulse } from 'lucide-react'
import { apiFetch } from '../services/api-client'
import { EmotionZone, getEmotionZone, setEmotionZone } from '../services/app-settings'

interface EmotionScreenProps {
  onBack: () => void
}

type Zone = EmotionZone

const zoneMeta: Record<Zone, { title: string; subtitle: string; color: string; tips: string[] }> = {
  blue: {
    title: 'Blue Zone',
    subtitle: '低能量 / 难过 / 疲惫',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    tips: ['喝水', '深呼吸 3 次', '告诉家长“我累了”']
  },
  green: {
    title: 'Green Zone',
    subtitle: '平静 / 专注 / 准备好学习',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    tips: ['继续当前任务', '保持节奏', '完成后领取奖励']
  },
  yellow: {
    title: 'Yellow Zone',
    subtitle: '紧张 / 兴奋 / 焦虑',
    color: 'bg-amber-100 border-amber-300 text-amber-800',
    tips: ['慢慢数到 10', '挤压减压球', '短暂休息 2 分钟']
  },
  red: {
    title: 'Red Zone',
    subtitle: '生气 / 失控 / 崩溃边缘',
    color: 'bg-rose-100 border-rose-300 text-rose-800',
    tips: ['先停下来', '到安静角落', '请求帮助：I need help please']
  }
}

const EmotionScreen: React.FC<EmotionScreenProps> = ({ onBack }) => {
  const [selectedZone, setSelectedZone] = useState<Zone>(() => getEmotionZone())

  const selected = useMemo(() => zoneMeta[selectedZone], [selectedZone])

  const handleSelectZone = async (zone: Zone) => {
    setSelectedZone(zone)
    setEmotionZone(zone)
    try {
      await apiFetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: null,
          event_type: 'emotion_zone_selected',
          event_payload: { zone }
        })
      })
    } catch {
      // non-blocking
    }
  }

  return (
    <div className="h-full w-full bg-[#f6f4ef] p-4 md:p-6">
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        <header className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="p-3 bg-white text-secondary-600 rounded-2xl shadow-soft border border-secondary-50"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">情绪控制室</h1>
            <p className="text-sm text-slate-500 font-semibold">Zones of Regulation</p>
          </div>
          <div className="w-12" />
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {(Object.keys(zoneMeta) as Zone[]).map((zone) => (
            <button
              key={zone}
              onClick={() => handleSelectZone(zone)}
              className={`border-2 rounded-2xl p-4 text-left transition-all ${zoneMeta[zone].color} ${selectedZone === zone ? 'ring-2 ring-slate-500/40' : ''}`}
            >
              <div className="font-extrabold">{zoneMeta[zone].title}</div>
              <div className="text-xs font-semibold opacity-80 mt-1">{zoneMeta[zone].subtitle}</div>
            </button>
          ))}
        </section>

        <section className="flex-1 bg-white rounded-3xl p-5 shadow-card border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <HeartPulse className="text-slate-600" size={20} />
            <h2 className="text-lg font-extrabold text-slate-900">当前建议：{selected.title}</h2>
          </div>
          <div className="space-y-3">
            {selected.tips.map((tip, idx) => (
              <div key={tip} className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <div className="text-xs font-bold text-slate-500">步骤 {idx + 1}</div>
                <div className="font-bold text-slate-900">{tip}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default EmotionScreen
