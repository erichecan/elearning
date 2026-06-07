import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Award, Bell, BookOpen, Home, Pin, School, Settings, Sparkles, Star, Trophy, Volume2, Undo2 } from 'lucide-react'
import { speechService } from '../services/speech'
import { apiFetch } from '../services/api-client'
import { CoreGridDensity, getCoreGridDensity, getEmotionZone, getFixedLongPressGuardEnabled } from '../services/app-settings'
import { getActiveChildId } from '../services/child-context'

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'settings' | 'category' | 'admin' | 'math' | 'flashcards' | 'focus' | 'emotion' | 'storybooks' | 'rewards', category?: string) => void
}

type SceneType = 'home' | 'school'

type CoreWord = {
  id: number
  en: string
  zh: string
  image: string
}

type WordRole = 'pronoun' | 'verb' | 'object' | 'descriptor' | 'question' | 'social' | 'preposition' | 'other'

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
  const [sentenceVocabIds, setSentenceVocabIds] = useState<number[]>([])
  const [coreWords, setCoreWords] = useState<CoreWord[]>([])
  const [recommendedIds, setRecommendedIds] = useState<Set<number>>(new Set())
  const [recommendedSentence, setRecommendedSentence] = useState<string>('')
  const [taskReminder, setTaskReminder] = useState<TaskReminder | null>(null)
  const [rewardSummary, setRewardSummary] = useState<RewardSummary | null>(null)
  const activeChildId = getActiveChildId()
  const [sceneImage, setSceneImage] = useState<string | null>(null)
  const [sceneId, setSceneId] = useState<number | null>(null)
  const [hotspots, setHotspots] = useState<Array<{ id: number; label: string; x: number; y: number; width: number; height: number; utterance: string }>>([])
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [fixedLongPressGuardEnabled] = useState<boolean>(() => getFixedLongPressGuardEnabled())
  const [gridDensity] = useState<CoreGridDensity>(() => getCoreGridDensity())
  const lastAnnouncement = useRef<string>('')
  const pressStartRef = useRef<Record<number, number>>({})
  const longPressTimersRef = useRef<Record<number, number>>({})
  const longPressedRef = useRef<Set<number>>(new Set())
  

  const logEvent = async (eventType: string, payload: Record<string, any>) => {
    try {
      await apiFetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: activeChildId,
          event_type: eventType,
          event_payload: payload
        })
      })
    } catch (error) {
      // non-blocking
    }
  }

  // 循证修订（A2）：核心词与场景解耦 —— 切换 at home / at school 时
  // 核心词网格不重载、位置不变；场景只影响 VSD 背景与 AI 推荐高亮。
  useEffect(() => {
    const loadCoreAndStatus = async () => {
      try {
        const [wordsRes, taskRes, rewardRes] = await Promise.all([
          apiFetch(`/api/home/core-words${activeChildId ? `?childId=${activeChildId}` : ''}`),
          apiFetch(`/api/home/task-reminder${activeChildId ? `?childId=${activeChildId}` : ''}`),
          apiFetch(`/api/home/reward-summary${activeChildId ? `?childId=${activeChildId}` : ''}`),
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

    loadCoreAndStatus()
    // 仅在挂载/儿童切换时加载一次，绝不随 scene 变化重载核心词
  }, [activeChildId])

  useEffect(() => {
    const loadScene = async () => {
      try {
        const response = await apiFetch(`/api/public/vsd/scenes?context=${scene}${activeChildId ? `&childId=${activeChildId}` : ''}`)
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setSceneImage(data[0].image_url || null)
          setSceneId(data[0].id)
        } else {
          setSceneImage(null)
          setSceneId(null)
        }
      } catch (error) {
        setSceneImage(null)
        setSceneId(null)
      }
    }
    loadScene()
  }, [scene])

  useEffect(() => {
    const loadHotspots = async () => {
      if (!sceneId) {
        setHotspots([])
        return
      }
      try {
        const response = await apiFetch(`/api/public/vsd/scenes/${sceneId}/hotspots`)
        const data = await response.json()
        setHotspots(Array.isArray(data) ? data : [])
      } catch (error) {
        setHotspots([])
      }
    }
    loadHotspots()
  }, [sceneId])

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await apiFetch('/api/home/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scene,
            childId: activeChildId,
            taskTitle: taskReminder?.title || '',
            recentWords: sentence.slice(-6),
            emotionZone: getEmotionZone()
          })
        })
        const recJson = await response.json()
        const nextRecommendedIds = Array.isArray(recJson.recommendedIds) ? recJson.recommendedIds : []
        setRecommendedIds(new Set(nextRecommendedIds))
        setRecommendedSentence(recJson.sentence || '')
        await apiFetch('/api/recommendations/shown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childId: activeChildId,
            scene,
            taskTitle: taskReminder?.title || '',
            recentWords: sentence.slice(-6),
            recommendedIds: nextRecommendedIds
          })
        })
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
    if (toAnnounce) {
      logEvent('recommendation_shown', { sentence: toAnnounce, ids: Array.from(recommendedIds) })
    }
  }, [recommendedSentence, recommendedIds])

  const handleWordTap = async (item: CoreWord) => {
    const nextSentence = [...sentence, item.en]
    const nextSentenceIds = [...sentenceVocabIds, item.id]
    setSentence(nextSentence)
    setSentenceVocabIds(nextSentenceIds)
    if (speechService.isSupported()) {
      speechService.speakWord(item.en, { rate: 0.85 }).catch(() => undefined)
    }
    logEvent('aac_click', { word: item.en, vocabId: item.id })
    if (recommendedIds.has(item.id)) {
      try {
        await apiFetch('/api/recommendations/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childId: activeChildId,
            scene,
            recommendedIds: Array.from(recommendedIds),
            acceptedId: item.id,
            recentWords: nextSentence.slice(-6)
          })
        })
      } catch (error) {
        // non-blocking
      }
    }
  }

  const handleFixedPointerDown = (wordId: number) => {
    if (!fixedLongPressGuardEnabled) return
    pressStartRef.current[wordId] = Date.now()
    longPressTimersRef.current[wordId] = window.setTimeout(() => {
      longPressedRef.current.add(wordId)
    }, 320)
  }

  const clearFixedPointerState = (wordId: number) => {
    const timer = longPressTimersRef.current[wordId]
    if (timer) {
      window.clearTimeout(timer)
      delete longPressTimersRef.current[wordId]
    }
    delete pressStartRef.current[wordId]
  }

  const handleFixedWordTap = async (item: CoreWord) => {
    if (fixedLongPressGuardEnabled && longPressedRef.current.has(item.id)) {
      longPressedRef.current.delete(item.id)
      clearFixedPointerState(item.id)
      return
    }
    clearFixedPointerState(item.id)
    await handleWordTap(item)
  }

  const classifyRole = (word: string): WordRole => {
    const key = word.toLowerCase().trim()
    const pronouns = new Set(['i', 'me', 'my', 'mine', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'we', 'us', 'our', 'they', 'them'])
    const verbs = new Set(['want', 'need', 'like', 'love', 'go', 'come', 'get', 'give', 'take', 'put', 'make', 'do', 'have', 'be', 'see', 'look', 'hear', 'listen', 'feel', 'think', 'know', 'say', 'tell', 'ask', 'help', 'stop', 'start', 'finish', 'wait', 'play', 'work', 'eat', 'drink', 'sleep', 'wake', 'wash', 'clean', 'open', 'close', 'turn'])
    const descriptors = new Set(['good', 'bad', 'more', 'different', 'same', 'big', 'small', 'fast', 'slow', 'hot', 'cold', 'loud', 'quiet'])
    const question = new Set(['what', 'where', 'why', 'who', 'when', 'how', 'which'])
    const social = new Set(['please', 'thank you', 'sorry', 'all done', 'yes', 'no'])
    const prepositions = new Set(['in', 'on', 'up', 'down', 'here', 'there', 'under', 'over', 'with', 'into', 'out', 'off', 'away'])

    if (pronouns.has(key)) return 'pronoun'
    if (verbs.has(key)) return 'verb'
    if (descriptors.has(key)) return 'descriptor'
    if (question.has(key)) return 'question'
    if (social.has(key)) return 'social'
    if (prepositions.has(key)) return 'preposition'
    return 'object'
  }

  const getRoleTheme = (role: WordRole) => {
    switch (role) {
      case 'pronoun':
        return { bg: 'bg-rose-50', border: 'border-rose-200', tag: 'bg-rose-100 text-rose-700' }
      case 'verb':
        return { bg: 'bg-emerald-50', border: 'border-emerald-200', tag: 'bg-emerald-100 text-emerald-700' }
      case 'object':
        return { bg: 'bg-amber-50', border: 'border-amber-200', tag: 'bg-amber-100 text-amber-700' }
      case 'descriptor':
        return { bg: 'bg-violet-50', border: 'border-violet-200', tag: 'bg-violet-100 text-violet-700' }
      case 'question':
        return { bg: 'bg-cyan-50', border: 'border-cyan-200', tag: 'bg-cyan-100 text-cyan-700' }
      case 'social':
        return { bg: 'bg-sky-50', border: 'border-sky-200', tag: 'bg-sky-100 text-sky-700' }
      case 'preposition':
        return { bg: 'bg-teal-50', border: 'border-teal-200', tag: 'bg-teal-100 text-teal-700' }
      default:
        return { bg: 'bg-slate-50', border: 'border-slate-200', tag: 'bg-slate-100 text-slate-600' }
    }
  }

  const gridState = useMemo(() => {
    const densityProfile: Record<CoreGridDensity, { totalSlots: number; fixedSlots: number; cols: number }> = {
      '4x4': { totalSlots: 16, fixedSlots: 8, cols: 4 },
      '6x6': { totalSlots: 36, fixedSlots: 18, cols: 6 },
      '8x8': { totalSlots: 64, fixedSlots: 24, cols: 8 }
    }
    const fixedAnchorOrder = [
      'i', 'want', 'need', 'help', 'more', 'not', 'stop', 'go', 'eat', 'drink',
      'play', 'all done', 'please', 'yes', 'no', 'here', 'there', 'what'
    ]
    const profile = densityProfile[gridDensity]
    const totalSlots = profile.totalSlots
    const fixedSlots = profile.fixedSlots
    const dynamicSlots = totalSlots - fixedSlots
    const wordByKey = new Map(coreWords.map(w => [w.en.toLowerCase().trim(), w]))

    const fixedAnchorWords = fixedAnchorOrder
      .map(key => wordByKey.get(key))
      .filter((w): w is CoreWord => Boolean(w))
      .slice(0, fixedSlots)

    const fixedIds = new Set(fixedAnchorWords.map(w => w.id))
    const pool = coreWords.filter(w => !fixedIds.has(w.id))
    const fixedWords = [...fixedAnchorWords]
    const fixedFillPriority: WordRole[] = ['verb', 'social', 'object', 'descriptor', 'question', 'preposition', 'other', 'pronoun']
    const poolByRole: Record<WordRole, CoreWord[]> = {
      pronoun: pool.filter(w => classifyRole(w.en) === 'pronoun'),
      verb: pool.filter(w => classifyRole(w.en) === 'verb'),
      object: pool.filter(w => classifyRole(w.en) === 'object'),
      descriptor: pool.filter(w => classifyRole(w.en) === 'descriptor'),
      question: pool.filter(w => classifyRole(w.en) === 'question'),
      social: pool.filter(w => classifyRole(w.en) === 'social'),
      preposition: pool.filter(w => classifyRole(w.en) === 'preposition'),
      other: pool.filter(w => classifyRole(w.en) === 'other')
    }
    fixedFillPriority.forEach(role => {
      poolByRole[role].forEach(candidate => {
        if (fixedWords.length >= fixedSlots) return
        fixedWords.push(candidate)
        fixedIds.add(candidate.id)
      })
    })
    for (const candidate of pool) {
      if (fixedWords.length >= fixedSlots) break
      if (fixedIds.has(candidate.id)) continue
      fixedWords.push(candidate)
      fixedIds.add(candidate.id)
    }

    // 循证修订（方案①全固定）：扩展词区采用稳定、确定性的排序
    // （按词性顺序 + 词 id 升序），不依赖 sentence —— 词的位置永不随
    // 交互改变，以保护运动规划记忆（🟢 Thistle 2018 / LAMP）。
    const remaining = coreWords.filter(w => !fixedIds.has(w.id))
    const stableRoleOrder: WordRole[] = ['pronoun', 'verb', 'object', 'descriptor', 'preposition', 'question', 'social', 'other']
    const dynamic: CoreWord[] = []
    const used = new Set<number>(fixedIds)
    stableRoleOrder.forEach(role => {
      remaining
        .filter(w => classifyRole(w.en) === role)
        .sort((a, b) => a.id - b.id)
        .forEach(word => {
          if (dynamic.length >= dynamicSlots || used.has(word.id)) return
          dynamic.push(word)
          used.add(word.id)
        })
    })
    if (dynamic.length < dynamicSlots) {
      remaining
        .slice()
        .sort((a, b) => a.id - b.id)
        .forEach(word => {
          if (dynamic.length >= dynamicSlots || used.has(word.id)) return
          dynamic.push(word)
          used.add(word.id)
        })
    }

    return {
      cols: profile.cols,
      density: gridDensity,
      fixedWords: fixedWords.slice(0, fixedSlots),
      dynamicWords: dynamic.slice(0, dynamicSlots)
    }
  }, [coreWords, gridDensity])

  const gridClassName = useMemo(() => {
    if (gridState.cols === 4) return 'grid grid-cols-4 gap-2 md:gap-2.5'
    if (gridState.cols === 8) return 'grid grid-cols-8 gap-1 md:gap-1.5'
    return 'grid grid-cols-6 gap-1.5 md:gap-2'
  }, [gridState.cols])

  const cardTextClassName = useMemo(() => {
    if (gridState.density === '4x4') {
      return {
        en: 'text-[13px] md:text-sm font-extrabold text-slate-900 leading-tight line-clamp-1',
        zh: 'text-[11px] md:text-xs font-semibold text-slate-500 line-clamp-1',
        icon: 'text-lg md:text-xl font-extrabold text-slate-500'
      }
    }
    if (gridState.density === '8x8') {
      return {
        en: 'text-[10px] md:text-[11px] font-extrabold text-slate-900 leading-tight line-clamp-1',
        zh: 'text-[9px] md:text-[10px] font-semibold text-slate-500 line-clamp-1',
        icon: 'text-sm md:text-base font-extrabold text-slate-500'
      }
    }
    return {
      en: 'text-[12px] md:text-sm font-extrabold text-slate-900 leading-tight line-clamp-1',
      zh: 'text-[10px] md:text-xs font-semibold text-slate-500 line-clamp-1',
      icon: 'text-lg md:text-xl font-extrabold text-slate-500'
    }
  }, [gridState.density])

  const sentenceHint = useMemo(() => {
    const last = sentence[sentence.length - 1]
    if (!last) return '先选主语（如 I），再选动作词'
    const role = classifyRole(last)
    if (role === 'pronoun') return `已选 "${last}"，下一步推荐动作词`
    if (role === 'verb') return `已选 "${last}"，下一步推荐对象词`
    if (role === 'object') return `已选 "${last}"，下一步可补充动作或修饰词`
    return `已选 "${last}"，继续选词造句`
  }, [sentence])

  const handleClear = async () => {
    if (sentence.length >= 2) {
      try {
        await apiFetch('/api/recommendations/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childId: activeChildId,
            scene,
            sentenceWords: sentence,
            sentenceVocabIds
          })
        })
      } catch {
        // non-blocking
      }
    }
    setSentence([])
    setSentenceVocabIds([])
  }

  const handleUndoLastWord = () => {
    setSentence(prev => prev.slice(0, -1))
    setSentenceVocabIds(prev => prev.slice(0, -1))
  }

  const handleSpeakSentence = async () => {
    const text = sentence.join(' ').trim()
    if (!text) return
    if (!speechService.isSupported()) return
    try {
      await speechService.speakWord(text, { rate: 0.85 })
      logEvent('sentence_spoken', { sentence: text, count: sentence.length })
    } catch {
      // non-blocking
    }
  }

  return (
    <div className="h-full w-full bg-[#f6f4ef] text-slate-900 relative overflow-hidden">
      {sceneImage && (
        <div className="absolute inset-0">
          <img src={sceneImage} alt="scene" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-white/60"></div>
        </div>
      )}
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#f4d06f]/40 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#a0ced9]/40 blur-3xl"></div>

      <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-4 relative z-10">
        {/* Top Bar */}
        <header className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <button
            className="col-span-2 md:col-span-2 bg-white/90 rounded-3xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] text-left"
            onClick={() => onNavigate('rewards')}
          >
            <div className="h-12 w-12 rounded-2xl bg-[#f59e0b]/20 flex items-center justify-center">
              <Trophy className="text-[#b45309]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500">奖励系统</div>
              <div className="text-lg font-extrabold text-slate-900">{rewardSummary ? `${rewardSummary.coins} 金币` : '--'}</div>
            </div>
          </button>

          <button
            className="bg-white/90 rounded-3xl p-3 flex items-center gap-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
            onClick={() => onNavigate('emotion')}
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

          <div className="col-span-2 md:col-span-1"></div>
        </header>

        {/* Scene Interaction */}
        {sceneImage && (
          <section className="bg-white/90 rounded-[28px] p-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="text-sm font-semibold text-slate-500 mb-2">场景互动</div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
              <img src={sceneImage} alt="scene" className="absolute inset-0 h-full w-full object-cover" />
              {hotspots.map(h => (
                <button
                  key={h.id}
                  onClick={() => {
                    if (speechService.isSupported()) {
                      speechService.speakWord(h.utterance, { rate: 0.85 }).catch(() => undefined)
                    }
                    logEvent('vsd_hotspot', { hotspotId: h.id, label: h.label })
                  }}
                  className="absolute border-2 border-amber-400 bg-amber-200/30 rounded-xl"
                  style={{
                    left: `${h.x * 100}%`,
                    top: `${h.y * 100}%`,
                    width: `${h.width * 100}%`,
                    height: `${h.height * 100}%`
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Sentence Strip */}
        <section className="bg-white/90 rounded-[28px] p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-slate-500">选中 Core Words 形成一句话</div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakSentence}
                disabled={sentence.length === 0}
                className={`text-sm font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${sentence.length === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'text-slate-700 bg-emerald-100 hover:bg-emerald-200'}`}
              >
                <Volume2 size={14} />
                朗读整句
              </button>
              <button
                onClick={handleUndoLastWord}
                disabled={sentence.length === 0}
                className={`text-sm font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${sentence.length === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'text-slate-700 bg-amber-100 hover:bg-amber-200'}`}
              >
                <Undo2 size={14} />
                撤销
              </button>
              <button
                onClick={handleClear}
                className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                清空
              </button>
            </div>
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
            <div className="text-sm text-slate-500">{sentenceHint}</div>
          </div>
          <div className="text-[11px] font-bold text-slate-500 mb-1">固定区（运动记忆）</div>
          <div className={`${gridClassName} pb-2`}>
            {gridState.fixedWords.map((item) => {
              const isRecommended = recommendedIds.has(item.id)
              const role = classifyRole(item.en)
              const roleTheme = getRoleTheme(role)
              return (
                <button
                  key={item.id}
                  onPointerDown={() => handleFixedPointerDown(item.id)}
                  onPointerUp={() => clearFixedPointerState(item.id)}
                  onPointerCancel={() => clearFixedPointerState(item.id)}
                  onPointerLeave={() => clearFixedPointerState(item.id)}
                  onClick={() => handleFixedWordTap(item)}
                  className={`relative rounded-2xl p-1.5 md:p-2 text-left shadow-sm border transition-all active:scale-[0.98] ${roleTheme.bg} ${isRecommended ? 'border-[#0ea5e9] ring-1 ring-[#0ea5e9]/40' : roleTheme.border}`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-1 bg-slate-100 flex items-center justify-center">
                    {!imageErrors[item.id] && item.image ? (
                      <img
                        src={item.image}
                        alt={item.en}
                        className="h-full w-full object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                      />
                    ) : (
                      <span className={cardTextClassName.icon}>{item.en.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className={cardTextClassName.en}>{item.en}</div>
                  <div className={cardTextClassName.zh}>{item.zh}</div>
                  <div className="absolute top-1 left-1 bg-slate-700/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <Pin size={10} />
                    固定
                  </div>
                  <div className={`absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${roleTheme.tag}`}>
                    {role}
                  </div>
                  {isRecommended && (
                    <div className="absolute top-1 right-1 bg-[#0ea5e9] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      AI
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <div className="text-[11px] font-bold text-[#0ea5e9] mb-1">更多核心词（位置固定）</div>
          <div className={`${gridClassName} pb-1`}>
            {gridState.dynamicWords.map((item) => {
              const isRecommended = recommendedIds.has(item.id)
              const role = classifyRole(item.en)
              const roleTheme = getRoleTheme(role)
              return (
                <button
                  key={item.id}
                  onClick={() => handleWordTap(item)}
                  className={`relative rounded-2xl p-1.5 md:p-2 text-left shadow-sm border transition-all active:scale-[0.98] ${roleTheme.bg} ${isRecommended ? 'border-[#0ea5e9] ring-1 ring-[#0ea5e9]/40' : roleTheme.border}`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-1 bg-slate-100 flex items-center justify-center">
                    {!imageErrors[item.id] && item.image ? (
                      <img
                        src={item.image}
                        alt={item.en}
                        className="h-full w-full object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                      />
                    ) : (
                      <span className={cardTextClassName.icon}>{item.en.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className={cardTextClassName.en}>{item.en}</div>
                  <div className={cardTextClassName.zh}>{item.zh}</div>
                  <div className={`absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${roleTheme.tag}`}>
                    {role}
                  </div>
                  {isRecommended && (
                    <div className="absolute top-1 right-1 bg-[#0ea5e9] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
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
            onClick={() => onNavigate('storybooks')}
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
