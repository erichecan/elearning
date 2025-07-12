import React, { useState, useEffect, useRef } from 'react'
import { Volume2, Heart, ArrowLeft } from 'lucide-react'
import { wordService, favoriteService } from '../services/api'
import { Word } from '../lib/database'
import { speechService } from '../services/speech'

interface CategoryScreenProps {
  category: string
  onBack: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategoryScreen: React.FC<CategoryScreenProps> = ({ category, onBack }) => {
  // onNavigate 未使用，仅为类型兼容 // [自动修复] 2024-07-06 23:36:00
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // 只允许一个卡片翻转，使用单个数字而不是Set
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)

  // 加载单词数据
  useEffect(() => {
    const loadWords = async () => {
      try {
        setLoading(true)
        setError(null)
        const wordsData = await wordService.getByCategory(category)
        setWords(wordsData)
      } catch (err) {
        console.error('加载单词失败:', err)
        setError('加载单词失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    loadWords()
  }, [category])

  const handleCardFlip = (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // 清除之前的定时器
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (flippedCard === wordId) {
      // 如果点击的是已翻转的卡片，翻回正面
      setFlippedCard(null)
    } else {
      // 翻转到新卡片（自动将之前的卡片翻回正面）
      setFlippedCard(wordId)
      
      // 5秒后自动翻回正面
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

      // 更新本地状态
      setWords(prevWords => 
        prevWords.map(w => 
          w.id === wordId 
            ? { ...w, is_favorite: !w.is_favorite }
            : w
        )
      )
    } catch (err) {
      console.error('更新收藏失败:', err)
    }
  }

  const playAudio = async (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const word = words.find(w => w.id === wordId)
    if (!word) return

    if (!speechService.isSupported()) {
      alert('您的浏览器不支持语音播放功能')
      return
    }

    try {
      await speechService.speakWord(word.word)
    } catch (error) {
      console.error('语音播放失败:', error)
    }
  }

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  // 组件挂载时确保所有卡片都是正面
  useEffect(() => {
    setFlippedCard(null)
  }, [category])

  if (loading) {
    return (
      <div className="h-full w-full p-6 flex flex-col items-center justify-center">
        <div className="text-white text-lg">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full p-6 flex flex-col items-center justify-center">
        <div className="text-red-300 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all"
        >
          重新加载
        </button>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center text-white">
          <h1 className="text-xl font-bold">单词卡片</h1>
          <p className="text-sm opacity-75">共 {words.length} 个单词</p>
        </div>
        <div className="w-12"></div>
      </div>

      {/* 单词卡片网格 */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 h-full overflow-y-auto pb-2">
          {words.map((word) => {
            const isFlipped = flippedCard === word.id
            return (
              <div
                key={word.id}
                className="flip-card mx-auto group"
                style={{ aspectRatio: '2/3', width: '100%', maxWidth: '150px' }}
              >
                <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                  {/* 卡片正面 */}
                  <div 
                    className="flip-card-front bg-white rounded-lg shadow-sm cursor-pointer group hover:shadow-md transition-all duration-200 hover:scale-105"
                    onClick={(e) => handleCardFlip(word.id, e)}
                  >
                    <div className="relative h-full flex flex-col">
                      {/* 图片区域 */}
                      <div className="relative flex-1 overflow-hidden rounded-t-lg">
                        <img
                          src={word.image_url || getDefaultImageForCategory(category)}
                          alt={word.word}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // 图片加载失败时使用默认图片
                            const target = e.target as HTMLImageElement;
                            target.src = getDefaultImageForCategory(category);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* 操作按钮 */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={(e) => playAudio(word.id, e)}
                            className="p-1 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all"
                          >
                            <Volume2 size={12} />
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(word.id, e)}
                            className={`p-1 backdrop-blur-sm rounded-full transition-all ${
                              word.is_favorite 
                                ? 'bg-red-500/80 text-white' 
                                : 'bg-black/50 text-white hover:bg-black/70'
                            }`}
                          >
                            <Heart size={12} fill={word.is_favorite ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>
                      
                      {/* 文字区域 */}
                      <div className="p-1 bg-white rounded-b-lg flex flex-col items-center">
                        <h3 className="text-xs font-bold text-gray-800 mb-0.5 truncate">{word.word}</h3>
                        <p className="text-[10px] text-gray-600 truncate">{word.chinese}</p>
                      </div>
                    </div>
                  </div>

                  {/* 卡片背面 */}
                  <div 
                    className="flip-card-back bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex flex-col justify-center items-center p-4"
                    onClick={(e) => handleCardFlip(word.id, e)}
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{word.word}</h3>
                      <p className="text-sm text-gray-600 mb-2">{word.phonetic || `/${word.word.toLowerCase()}/`}</p>
                      <p className="text-base text-gray-700 font-medium">{word.chinese}</p>
                      
                      {/* 背面操作按钮 */}
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            playAudio(word.id, e)
                          }}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
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

// 为不同分类提供更好的默认图片
const getDefaultImageForCategory = (category: string): string => {
  const imageMap: { [key: string]: string } = {
    'fruits': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
    'animals': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    'colors': 'https://images.unsplash.com/photo-1558618047-b93c0c2e2041?w=400&h=300&fit=crop',
    'numbers': 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop',
    'family': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'body': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'clothes': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    'food': 'https://images.unsplash.com/photo-1504674900242-4197e29c3d14?w=400&h=300&fit=crop',
    'transport': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    'nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    'daily_phrases': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'greeting_phrases': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'action_phrases': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'simple_sentences': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'conversation_sentences': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  }
  
  return imageMap[category] || 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'
}

export default CategoryScreen 