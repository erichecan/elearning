import React, { useRef, useState, useEffect } from 'react'
import { Award, Bell, BookOpen, Home, School, Settings, Sparkles, Star, Trophy } from 'lucide-react'
import { speechService } from '../services/speech'

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'settings' | 'category' | 'admin' | 'math' | 'flashcards' | 'focus', category?: string) => void
}

type SceneType = 'home' | 'school'

type CoreWord = {
  id: number
  en: string
  zh: string
  image: string
}

type TaskReminder = {
  title: string
  time: string
  status?: string
  taskId: number
}

type RewardSummary = {
  coins: number
  level: number
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [scene, setScene] = useState<SceneType>('home')
  const [sentence, setSentence] = useState<string[]>([])
  const [coreWords, setCoreWords] = useState<CoreWord[]>([])
  const [recommendedIds, setRecommendedIds] = useState<Set<number>>(new Set())
  const [recommendedSentence, setRecommendedSentence] = useState<string>('')
  const [taskReminder, setTaskReminder] = useState<TaskReminder | null>(null)
  const [rewardSummary, setRewardSummary] = useState<RewardSummary | null>(null)
  const lastAnnouncement = useRef<string>('')

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [wordsRes, taskRes, rewardRes] = await Promise.all([
          fetch(`http://localhost:3001/api/home/core-words?scene=${scene}`),
          fetch('http://localhost:3001/api/home/task-reminder'),
          fetch('http://localhost:3001/api/home/reward-summary'),
        ])

        const wordsJson = await wordsRes.json()
        const taskJson = await taskRes.json()
        const rewardJson = await rewardRes.json()

        setCoreWords(wordsJson.items || [])
        setTaskReminder(taskJson)
        setRewardSummary(rewardJson)
      } catch (error) {
        console.error('Failed to load home data', error)
      }
    }

    loadHomeData()
  }, [scene])

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/home/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scene,
            taskTitle: taskReminder?.title || '',
            recentWords: sentence.slice(-6)
          })
        })
        const recJson = await response.json()
        setRecommendedIds(new Set(recJson.recommendedIds || []))
        setRecommendedSentence(recJson.sentence || '')
      } catch (error) {
        console.error('Failed to load recommendations', error)
      }
    }

    loadRecommendations()
  }, [scene, sentence, taskReminder])

  useEffect(() => {
    const toAnnounce = recommendedSentence
    if (lastAnnouncement.current === toAnnounce) return
    lastAnnouncement.current = toAnnounce
    if (!speechService.isSupported()) return
    speechService.speakWord(toAnnounce, { rate: 0.85 }).catch(() => undefined)
  }, [recommendedSentence])

  const handleWordTap = (word: string) => {
    setSentence(prev => [...prev, word])
    if (speechService.isSupported()) {
      speechService.speakWord(word, { rate: 0.85 }).catch(() => undefined)
    }
  }

  const handleClear = () => setSentence([])

  return (
    <div className="h-full w-full bg-[#f6f4ef] text-slate-900 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#f4d06f]/40 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#a0ced9]/40 blur-3xl"></div>

      <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-4 relative z-10">
        {/* Top Bar */}
        <header className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="col-span-2 md:col-span-2 bg-white/90 rounded-3xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="h-12 w-12 rounded-2xl bg-[#f59e0b]/20 flex items-center justify-center">
              <Trophy className="text-[#b45309]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">奖励系统</div>
              <div className="text-lg font-extrabold text-slate-900">{rewardSummary ? `${rewardSummary.coins} 金币` : '--'}</div>
            </div>
          </div>

          <button
            className="bg-white/90 rounded-3xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
            onClick={() => onNavigate('settings')}
          >
            <div className="h-12 w-12 rounded-2xl bg-[#fb7185]/20 flex items-center justify-center">
              <Sparkles className="text-[#be123c]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-500">情绪控制室</div>
              <div className="text-lg font-extrabold">今天情绪</div>
            </div>
          </button>

          <button
            className={`rounded-3xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all ${scene === 'school' ? 'bg-[#0ea5e9] text-white' : 'bg-white/90'}`}
            onClick={() => setScene('school')}
          >
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${scene === 'school' ? 'bg-white/20' : 'bg-[#0ea5e9]/20'}`}>
              <School className={scene === 'school' ? 'text-white' : 'text-[#0369a1]'} />
            </div>
            <div className="text-left">
              <div className={`text-sm font-semibold ${scene === 'school' ? 'text-white/80' : 'text-slate-500'}`}>at school</div>
              <div className="text-lg font-extrabold">学校场景</div>
            </div>
          </button>

          <button
            className={`rounded-3xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all ${scene === 'home' ? 'bg-[#10b981] text-white' : 'bg-white/90'}`}
            onClick={() => setScene('home')}
          >
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${scene === 'home' ? 'bg-white/20' : 'bg-[#10b981]/20'}`}>
              <Home className={scene === 'home' ? 'text-white' : 'text-[#047857]'} />
            </div>
            <div className="text-left">
              <div className={`text-sm font-semibold ${scene === 'home' ? 'text-white/80' : 'text-slate-500'}`}>at home</div>
              <div className="text-lg font-extrabold">家庭场景</div>
            </div>
          </button>

          <div className="col-span-2 md:col-span-1 bg-white/90 rounded-3xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="h-12 w-12 rounded-2xl bg-[#6366f1]/20 flex items-center justify-center">
              <Bell className="text-[#4338ca]" />
            </div>
            <div className="cursor-pointer" onClick={() => onNavigate('focus')}>
              <div className="text-sm font-semibold text-slate-500">任务提醒</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-extrabold">{taskReminder ? taskReminder.title : '--'}</div>
                {taskReminder?.status && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${taskReminder.status === 'done'
                      ? 'bg-emerald-100 text-emerald-700'
                      : taskReminder.status === 'now'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                    {taskReminder.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="col-span-2 md:col-span-1 bg-white/90 rounded-3xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
          >
            <div className="h-12 w-12 rounded-2xl bg-[#94a3b8]/20 flex items-center justify-center">
              <Settings className="text-[#475569]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">设置</div>
              <div className="text-lg font-extrabold">Config</div>
            </div>
          </button>
        </header>

        {/* Sentence Strip */}
        <section className="bg-white/90 rounded-[28px] p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-slate-500">选中 Core Words 形成一句话</div>
            <button
              onClick={handleClear}
              className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
            >
              清空
            </button>
          </div>
          <div className="min-h-[64px] bg-[#f8fafc] rounded-2xl p-3 flex flex-wrap gap-2 items-center">
            {sentence.length === 0 ? (
              <span className="text-slate-400 font-semibold">点击下方核心词开始沟通</span>
            ) : (
              sentence.map((word, index) => (
                <span key={`${word}-${index}`} className="px-3 py-2 rounded-xl bg-[#0ea5e9]/15 text-[#0f172a] font-extrabold">
                  {word}
                </span>
              ))
            )}
          </div>
        </section>

        {/* Core Words Grid */}
        <section className="flex-1 bg-white/90 rounded-[32px] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-extrabold text-slate-800">Core Words</h2>
            <div className="text-sm text-slate-500">AI 推荐已高亮</div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 flex-1 overflow-y-auto pb-2">
            {coreWords.map((item) => {
              const isRecommended = recommendedIds.has(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => handleWordTap(item.en)}
                  className={`relative rounded-3xl p-3 text-left shadow-sm border transition-all active:scale-[0.98] ${isRecommended ? 'border-[#0ea5e9] ring-2 ring-[#0ea5e9]/40' : 'border-slate-100'}`}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-2 bg-slate-100">
                    <img src={item.image} alt={item.en} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-base font-extrabold text-slate-900 leading-tight">{item.en}</div>
                  <div className="text-xs font-semibold text-slate-500">{item.zh}</div>
                  {isRecommended && (
                    <div className="absolute top-2 right-2 bg-[#0ea5e9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      AI
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Bottom Modules */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('math')}
            className="bg-white/90 rounded-3xl p-4 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
          >
            <div className="h-12 w-12 rounded-2xl bg-[#38bdf8]/20 flex items-center justify-center">
              <Star className="text-[#0284c7]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">math</div>
              <div className="text-lg font-extrabold">数学</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('flashcards')}
            className="bg-white/90 rounded-3xl p-4 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
          >
            <div className="h-12 w-12 rounded-2xl bg-[#f472b6]/20 flex items-center justify-center">
              <Award className="text-[#be185d]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">flashcards</div>
              <div className="text-lg font-extrabold">闪卡</div>
            </div>
          </button>

          <button
            className="bg-white/90 rounded-3xl p-4 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
          >
            <div className="h-12 w-12 rounded-2xl bg-[#a78bfa]/20 flex items-center justify-center">
              <BookOpen className="text-[#6d28d9]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">绘本</div>
              <div className="text-lg font-extrabold">阅读</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="bg-white/90 rounded-3xl p-4 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
          >
            <div className="h-12 w-12 rounded-2xl bg-[#94a3b8]/20 flex items-center justify-center">
              <Settings className="text-[#475569]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">settings</div>
              <div className="text-lg font-extrabold">设置</div>
            </div>
          </button>
        </section>
      </div>
    </div>
  )
}

export default HomeScreen
