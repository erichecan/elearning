import React, { useState, useEffect, useRef } from 'react'
import { Volume2, Heart, ArrowLeft } from 'lucide-react'

interface CategoryScreenProps {
  category: string
  onNavigate: (screen: 'home' | 'category' | 'card' | 'settings', payload?: any) => void
  onBack: () => void
}

// 所有单词数据
const allWords = [
  // 水果蔬菜
  { id: 1, word: 'Apple', chinese: '苹果', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop', audio: 'apple.mp3', isFavorite: false, category: 'fruits' },
  { id: 2, word: 'Banana', chinese: '香蕉', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop', audio: 'banana.mp3', isFavorite: true, category: 'fruits' },
  { id: 3, word: 'Orange', chinese: '橙子', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop', audio: 'orange.mp3', isFavorite: false, category: 'fruits' },
  { id: 4, word: 'Strawberry', chinese: '草莓', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop', audio: 'strawberry.mp3', isFavorite: false, category: 'fruits' },
  { id: 5, word: 'Carrot', chinese: '胡萝卜', image: 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=300&fit=crop', audio: 'carrot.mp3', isFavorite: false, category: 'fruits' },
  { id: 6, word: 'Tomato', chinese: '西红柿', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', audio: 'tomato.mp3', isFavorite: false, category: 'fruits' },
  // 动物世界
  { id: 7, word: 'Elephant', chinese: '大象', image: 'https://images.unsplash.com/photo-1557050543-4d5f2e07c346?w=400&h=300&fit=crop', audio: 'elephant.mp3', isFavorite: false, category: 'animals' },
  { id: 8, word: 'Lion', chinese: '狮子', image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=300&fit=crop', audio: 'lion.mp3', isFavorite: false, category: 'animals' },
  { id: 9, word: 'Giraffe', chinese: '长颈鹿', image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&h=300&fit=crop', audio: 'giraffe.mp3', isFavorite: false, category: 'animals' },
  { id: 10, word: 'Penguin', chinese: '企鹅', image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&h=300&fit=crop', audio: 'penguin.mp3', isFavorite: false, category: 'animals' },
  { id: 11, word: 'Dolphin', chinese: '海豚', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', audio: 'dolphin.mp3', isFavorite: false, category: 'animals' },
  { id: 12, word: 'Butterfly', chinese: '蝴蝶', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', audio: 'butterfly.mp3', isFavorite: false, category: 'animals' },
  // 颜色形状
  { id: 13, word: 'Red', chinese: '红色', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', audio: 'red.mp3', isFavorite: false, category: 'colors' },
  { id: 14, word: 'Blue', chinese: '蓝色', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', audio: 'blue.mp3', isFavorite: false, category: 'colors' },
  { id: 15, word: 'Green', chinese: '绿色', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', audio: 'green.mp3', isFavorite: false, category: 'colors' },
  { id: 16, word: 'Yellow', chinese: '黄色', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', audio: 'yellow.mp3', isFavorite: false, category: 'colors' },
  { id: 17, word: 'Circle', chinese: '圆形', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', audio: 'circle.mp3', isFavorite: false, category: 'colors' },
  { id: 18, word: 'Square', chinese: '正方形', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', audio: 'square.mp3', isFavorite: false, category: 'colors' },
]

const CategoryScreen: React.FC<CategoryScreenProps> = ({ category, onNavigate, onBack }) => {
  const words = allWords.filter(w => w.category === category)
  // 只允许一个卡片翻转，使用单个数字而不是Set
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)

  const handleWordClick = (word: any) => {
    onNavigate('card', word)
  }

  const handleCardFlip = (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // 清除之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (flippedCard === wordId) {
      // 如果点击的是已翻转的卡片，翻回正面
      setFlippedCard(null)
    } else {
      // 翻转到新卡片（自动将之前的卡片翻回正面）
      setFlippedCard(wordId)
      
      // 5秒后自动翻回正面
      timerRef.current = setTimeout(() => {
        setFlippedCard(null)
        timerRef.current = null
      }, 5000)
    }
  }

  const toggleFavorite = (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Toggle favorite for word:', wordId)
  }

  const playAudio = (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Play audio for word:', wordId)
  }

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // 组件挂载时确保所有卡片都是正面
  useEffect(() => {
    setFlippedCard(null)
  }, [category])

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
                          src={word.image}
                          alt={word.word}
                          className="w-full h-full object-cover"
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
                              word.isFavorite 
                                ? 'bg-red-500/80 text-white' 
                                : 'bg-black/50 text-white hover:bg-black/70'
                            }`}
                          >
                            <Heart size={12} fill={word.isFavorite ? 'currentColor' : 'none'} />
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
                      <p className="text-sm text-gray-600 mb-2">/{word.word.toLowerCase()}/</p>
                      <p className="text-base text-gray-700 font-medium">{word.chinese}</p>
                      
                      {/* 背面操作按钮 */}
                      <div className="mt-4 flex gap-2 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            playAudio(word.id, e)
                          }}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          <Volume2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleWordClick(word)
                          }}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 transition-colors"
                        >
                          学习
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

export default CategoryScreen 