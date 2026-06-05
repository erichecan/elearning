import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Volume2, Heart, ArrowLeft, MessageSquare } from 'lucide-react'

const FALLBACK_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23FFEAD8" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="48" fill="%23FB7938"%3E📚%3C/text%3E%3C/svg%3E'
import { wordService, favoriteService } from '../services/api'
import { Word } from '../lib/database'
import { speechService } from '../services/speech'

interface CategoryScreenProps {
  category: string
  onBack: () => void
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ category, onBack }) => {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const loadWords = async () => {
      try {
        setLoading(true)
        setError(null)
        const wordsData = await wordService.getByCategory(category)
        setWords(wordsData)
      } catch (err) {
        console.error('加载单词失败:', err)
        setError('Failed to load words')
      } finally {
        setLoading(false)
      }
    }
    loadWords()
  }, [category])

  const handleCardFlip = (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (flippedCard === wordId) {
      setFlippedCard(null)
    } else {
      setFlippedCard(wordId)
      timerRef.current = window.setTimeout(() => {
        setFlippedCard(null)
        timerRef.current = null
      }, 6000) as unknown as number
    }
  }

  const toggleFavorite = async (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const word = words.find(w => w.id === wordId)
      if (!word) return
      if (word.is_favorite) {
        await favoriteService.remove(wordId)
      } else {
        await favoriteService.add(wordId)
      }
      setWords(prev => prev.map(w => w.id === wordId ? { ...w, is_favorite: !w.is_favorite } : w))
    } catch (err) {
      console.error('更新收藏失败:', err)
    }
  }

  const playWordAudio = async (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const word = words.find(w => w.id === wordId)
    if (!word) return
    try {
      await speechService.playAudio(word.audio_url || null, word.word)
    } catch (error) {
      console.error('语音播放失败:', error)
    }
  }

  const handleImgError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (!img.dataset.errored) {
      img.dataset.errored = 'true'
      img.src = FALLBACK_IMG
    }
  }, [])

  const playSentenceAudio = async (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const word = words.find(w => w.id === wordId)
    if (!word) return
    try {
      if (word.sentence_audio_url) {
        await speechService.playAudio(word.sentence_audio_url, word.sentence || word.word)
      } else if (word.sentence) {
        await speechService.playAudio(null, word.sentence)
      }
    } catch (error) {
      console.error('句子音频播放失败:', error)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    setFlippedCard(null)
  }, [category])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-primary-50">
        <div className="animate-bounce-slow text-primary-500 text-xl font-extrabold">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6">
        <div className="text-red-500 font-bold text-lg mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 bg-white text-primary-900 rounded-2xl shadow-soft hover:shadow-card transition-all border border-primary-100"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-primary-900 tracking-tight capitalize">
            {category.replace(/_/g, ' ')}
          </h1>
          <p className="text-sm font-bold text-secondary-400">{words.length} Words</p>
        </div>

        <div className="w-12" />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-4 px-1 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {words.map((word) => {
            const isFlipped = flippedCard === word.id
            const hasSentence = !!(word.sentence || word.sentence_cn)
            return (
              <div
                key={word.id}
                className="flip-card mx-auto h-80 w-full"
                style={{ isolation: 'isolate' }}
              >
                <div
                  className={`flip-card-inner cursor-pointer${isFlipped ? ' flipped' : ''}`}
                  onClick={(e) => handleCardFlip(word.id, e)}
                >
                  {/* Front */}
                  <div className="flip-card-front bg-white shadow-card border-2 border-primary-100 flex flex-col overflow-hidden">
                    {/* Image */}
                    <div className="relative flex-1 overflow-hidden bg-primary-50">
                      <img
                        src={word.image_url || FALLBACK_IMG}
                        alt={word.word}
                        className="w-full h-full object-cover"
                        style={{ transform: 'translateZ(0)' }}
                        onError={handleImgError}
                      />

                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button
                          onClick={(e) => playWordAudio(word.id, e)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-primary-500 shadow-soft hover:scale-110 transition-transform"
                        >
                          <Volume2 size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={(e) => toggleFavorite(word.id, e)}
                          className={`p-2 backdrop-blur-sm rounded-full shadow-soft hover:scale-110 transition-all ${
                            word.is_favorite ? 'bg-accent-100 text-accent-500' : 'bg-white/90 text-primary-300'
                          }`}
                        >
                          <Heart size={14} fill={word.is_favorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* Word label */}
                    <div className="px-3 py-2.5 bg-white flex flex-col items-center border-t border-primary-50">
                      <h3 className="text-base font-extrabold text-primary-900 leading-tight">{word.word}</h3>
                      <p className="text-xs font-semibold text-primary-300 mt-0.5">Tap to flip ✨</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="flip-card-back bg-gradient-to-br from-secondary-400 to-secondary-600 shadow-float flex flex-col items-center justify-center p-4 text-white">
                    {/* Chinese + phonetic */}
                    <h2 className="text-3xl font-black mb-0.5 drop-shadow-sm">{word.chinese}</h2>
                    {word.phonetic && (
                      <p className="text-sm font-bold opacity-70 font-mono mb-3">{word.phonetic}</p>
                    )}

                    {/* Sentence display */}
                    {hasSentence && (
                      <div className="w-full bg-white/20 rounded-2xl px-3 py-2.5 mb-3 text-center backdrop-blur-sm">
                        {word.sentence && (
                          <p className="text-xs font-semibold leading-snug italic opacity-95">
                            {word.sentence}
                          </p>
                        )}
                        {word.sentence_cn && (
                          <p className="text-xs font-medium leading-snug opacity-80 mt-1">
                            {word.sentence_cn}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Audio buttons */}
                    <div className="flex flex-col items-center gap-2 w-full">
                      <button
                        onClick={(e) => playWordAudio(word.id, e)}
                        className="flex items-center gap-2 px-5 py-2 bg-white text-secondary-600 rounded-full shadow-soft hover:scale-105 active:scale-95 transition-transform font-extrabold text-sm"
                      >
                        <Volume2 size={16} strokeWidth={3} />
                        <span>{word.word}</span>
                      </button>
                      {hasSentence && (
                        <button
                          onClick={(e) => playSentenceAudio(word.id, e)}
                          className="flex items-center gap-2 px-4 py-1.5 bg-white/30 text-white rounded-full hover:scale-105 active:scale-95 transition-transform border border-white/50 font-bold text-xs"
                        >
                          <MessageSquare size={13} strokeWidth={2.5} />
                          <span>Read sentence</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoryScreen
