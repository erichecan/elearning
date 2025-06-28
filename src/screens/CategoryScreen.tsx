import React from 'react'
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

  const handleWordClick = (word: any) => {
    onNavigate('card', word)
  }

  const toggleFavorite = (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    // 这里可以添加收藏逻辑
    console.log('Toggle favorite for word:', wordId)
  }

  const playAudio = (wordId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    // 这里可以添加音频播放逻辑
    console.log('Play audio for word:', wordId)
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
        </div>
        <div className="w-12"></div> {/* 占位符保持居中 */}
      </div>

      {/* 单词卡片网格 - 响应式紧凑布局 */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 h-full overflow-y-auto pb-2">
          {words.map((word) => (
            <div
              key={word.id}
              onClick={() => handleWordClick(word)}
              className="bg-white rounded-lg shadow-sm cursor-pointer group hover:shadow-md transition-all duration-200 hover:scale-105 mx-auto"
              style={{ aspectRatio: '2/3', width: '100%' }}
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
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button
                      onClick={(e) => playAudio(word.id, e)}
                      className="p-1 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-all"
                    >
                      <Volume2 size={8} />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(word.id, e)}
                      className={`p-1 backdrop-blur-sm rounded-full transition-all ${
                        word.isFavorite 
                          ? 'bg-red-500/80 text-white' 
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart size={8} fill={word.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
                {/* 文字区域 */}
                <div className="p-1 bg-white rounded-b-lg">
                  <h3 className="text-xs font-bold text-gray-800 mb-0.5 truncate">{word.word}</h3>
                  <p className="text-[10px] text-gray-600 truncate">{word.chinese}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryScreen 