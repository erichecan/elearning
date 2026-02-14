import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Hand, Timer } from 'lucide-react'

interface ScheduleFocusScreenProps {
  onBack: () => void
}

type FocusTask = {
  id: number
  title: string
  steps: string[]
  estMinutes: number
}

const ScheduleFocusScreen: React.FC<ScheduleFocusScreenProps> = ({ onBack }) => {
  const [completed, setCompleted] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [task, setTask] = useState<FocusTask | null>(null)
  const [loading, setLoading] = useState(true)
  const progress = useMemo(() => (completed ? 100 : 40), [completed])

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3001/api/focus/current-task')
        const data = await response.json()
        setTask(data)
      } catch (error) {
        console.error('Failed to load focus task', error)
        setTask(null)
      } finally {
        setLoading(false)
      }
    }
    loadTask()
  }, [])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#f6f4ef]">
        <div className="text-slate-500 font-semibold">Loading...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#f6f4ef]">
        <div className="text-slate-500 font-semibold">No task available</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-[#f6f4ef] text-slate-900 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#fde68a]/40 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#bfdbfe]/40 blur-3xl"></div>

      <div className="h-full w-full max-w-6xl mx-auto p-4 md:p-6 flex flex-col gap-4 relative z-10">
        <header className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-3 bg-white text-secondary-600 rounded-2xl shadow-soft hover:shadow-md transition-all border border-secondary-50"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Focus 模式</h1>
            <p className="text-sm font-semibold text-slate-500">当前任务</p>
          </div>
          <div className="w-12"></div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          {/* Task Card */}
          <div className="lg:col-span-2 bg-white/90 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-500">正在进行</div>
                <h2 className="text-3xl font-extrabold text-slate-900">{task.title}</h2>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-2 rounded-full text-sm font-semibold">
                <Timer size={16} />
                预计 {task.estMinutes} 分钟
              </div>
            </div>

            <div className="bg-slate-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-500">步骤进度</span>
                <span className="text-sm font-bold text-slate-700">{progress}%</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-[#10b981] transition-all" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {task.steps.map((step, index) => (
                <div key={step} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="text-xs font-semibold text-slate-500">步骤 {index + 1}</div>
                  <div className="text-lg font-extrabold text-slate-900">{step}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-col md:flex-row gap-3">
              <div
                draggable={!completed}
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', String(task.id))
                  event.dataTransfer.effectAllowed = 'move'
                }}
                className={`flex-1 bg-[#10b981] text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg text-center cursor-grab active:cursor-grabbing ${completed ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#059669]'}`}
              >
                拖动任务卡
              </div>
              <button
                onClick={() => setCompleted(true)}
                className="flex-1 bg-white border-2 border-[#10b981] text-[#047857] font-extrabold text-lg py-4 rounded-2xl"
              >
                点击完成
              </button>
            </div>
          </div>

          {/* Completion Zone + AAC */}
          <div className="bg-white/90 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] flex flex-col gap-4">
            <div className="text-sm font-semibold text-slate-500">完成箱</div>
            <div
              onDragOver={(event) => {
                event.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragOver(false)
                setCompleted(true)
              }}
              className={`flex-1 border-2 border-dashed rounded-3xl flex items-center justify-center font-semibold transition-all ${dragOver ? 'border-[#10b981] bg-[#dcfce7] text-[#166534]' : 'border-slate-300 text-slate-400'}`}
            >
              {completed ? '已完成' : '把任务卡拖到这里'}
            </div>
            <button className="w-full bg-[#f97316] text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg">
              +1 奖励
            </button>
            <button className="w-full bg-[#f43f5e] text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <Hand size={20} />
              紧急沟通
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ScheduleFocusScreen
