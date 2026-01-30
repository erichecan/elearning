import React, { useState, useEffect, useRef } from 'react'
import { Volume2, Heart, ArrowLeft } from 'lucide-react'
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
      }, 5000) as unknown as number
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

  const playAudio = async (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const word = words.find(w => w.id === wordId)
    if (!word) return
    if (!speechService.isSupported()) {
      alert('Browser does not support speech')
      return
    }
    try {
      await speechService.speakWord(word.word)
    } catch (error) {
      console.error('语音播放失败:', error)
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
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-bounce-slow text-primary-600 text-xl font-bold">Loading Words...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6">
        <div className="text-red-500 font-bold text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-500 text-white rounded-2xl shadow-lg hover:bg-primary-600 transition-all font-bold"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <button
          onClick={onBack}
          className="p-3 bg-white text-secondary-600 rounded-2xl shadow-soft hover:shadow-md transition-all border border-secondary-50"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-primary-900 tracking-tight capitalize">{category.replace('_', ' ')}</h1>
          <p className="text-sm font-semibold text-primary-500">{words.length} Words</p>
        </div>

        <div className="w-12"></div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-4 px-2 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {words.map((word) => {
            const isFlipped = flippedCard === word.id
            return (
              <div
                key={word.id}
                className="flip-card mx-auto group h-64 w-full"
              >
                <div
                  className={`flip-card-inner relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer ${isFlipped ? 'flipped' : ''}`}
                  onClick={(e) => handleCardFlip(word.id, e)}
                >
                  {/* Front */}
                  <div className="flip-card-front absolute inset-0 backface-hidden bg-white rounded-3xl shadow-card border-2 border-primary-50 flex flex-col overflow-hidden">
                    <div className="relative flex-1 overflow-hidden bg-primary-50/50">
                      <img
                        src={word.image_url || 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'}
                        alt={word.word}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'
                        }}
                      />

                      {/* Actions */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={(e) => playAudio(word.id, e)}
                          className="p-2 bg-white/80 backdrop-blur-md rounded-full text-primary-600 shadow-sm hover:scale-110 transition-transform"
                        >
                          <Volume2 size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={(e) => toggleFavorite(word.id, e)}
                          className={`p-2 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-all ${word.is_favorite
                              ? 'bg-rose-50 text-rose-500'
                              : 'bg-white/80 text-gray-400'
                            }`}
                        >
                          <Heart size={16} fill={word.is_favorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white flex flex-col items-center justify-center border-t border-primary-50">
                      <h3 className="text-lg font-extrabold text-primary-900 mb-0.5">{word.word}</h3>
                      <p className="text-xs font-bold text-primary-400 opacity-60">Tap to flip</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="flip-card-back absolute inset-0 backface-hidden bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-3xl shadow-float rotate-y-180 flex flex-col items-center justify-center p-4 text-white">
                    <h2 className="text-3xl font-black mb-2 drop-shadow-sm">{word.chinese}</h2>
                    <p className="text-lg font-bold opacity-80 font-mono mb-4">{word.phonetic}</p>

                    <button
                      onClick={(e) => { e.stopPropagation(); playAudio(word.id, e); }}
                      className="p-4 bg-white text-secondary-500 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                      <Volume2 size={24} strokeWidth={3} />
                    </button>
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