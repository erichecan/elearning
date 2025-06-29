import React, { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { categoryService } from '../services/api'
import { Category } from '../lib/database'

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'settings' | 'category', category?: string) => void
}

// 为每个分类设置对应的背景图片
const getCategoryImage = (categoryName: string): string => {
  const imageMap: { [key: string]: string } = {
    'fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop&auto=format',
    'animals': 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=400&h=300&fit=crop&auto=format',
    'colors': 'https://images.unsplash.com/photo-1541845157-a6d2d100c931?w=400&h=300&fit=crop&auto=format',
    'numbers': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&auto=format',
    'family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop&auto=format',
    'body': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format',
    'clothes': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&auto=format',
    'food': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format',
    'transport': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&auto=format',
    'nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
    'daily_phrases': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format',
    'greeting_phrases': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop&auto=format',
    'action_phrases': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
    'simple_sentences': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop&auto=format',
    'conversation_sentences': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&auto=format'
  }
  
  return imageMap[categoryName] || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format'
}

// 为每个分类设置对应的英文显示名称
const getCategoryEnglishName = (categoryName: string): string => {
  const nameMap: { [key: string]: string } = {
    'fruits': 'Fruits & Vegetables',
    'animals': 'Animals',
    'colors': 'Colors & Shapes',
    'numbers': 'Numbers & Time',
    'family': 'Family Members',
    'body': 'Body Parts',
    'clothes': 'Clothes & Accessories',
    'food': 'Food & Utensils',
    'transport': 'Transportation',
    'nature': 'Nature & Weather',
    'daily_phrases': 'Daily Phrases',
    'greeting_phrases': 'Greeting Phrases',
    'action_phrases': 'Action Phrases',
    'simple_sentences': 'Simple Sentences',
    'conversation_sentences': 'Conversation Sentences'
  }
  
  return nameMap[categoryName] || categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
}

// 为每个分类设置对应的英文描述
const getCategoryEnglishDescription = (categoryName: string): string => {
  const descriptionMap: { [key: string]: string } = {
    'fruits': 'Learn fruit and vegetable names',
    'animals': 'Discover cute animal friends',
    'colors': 'Basic colors and shapes',
    'numbers': 'Numbers and time concepts',
    'family': 'Family member titles',
    'body': 'Learn body parts',
    'clothes': 'Daily clothing items',
    'food': 'Food and utensil names',
    'transport': 'Various vehicles',
    'nature': 'Nature and weather',
    'daily_phrases': 'Common daily phrases',
    'greeting_phrases': 'Polite greetings',
    'action_phrases': 'Action and behavior phrases',
    'simple_sentences': 'Basic sentence structures',
    'conversation_sentences': 'Common conversation sentences'
  }
  
  return descriptionMap[categoryName] || 'Learn English words'
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载分类数据
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const categoriesData = await categoryService.getAll()
        setCategories(categoriesData)
      } catch (err) {
        console.error('加载分类失败:', err)
        setError('加载分类失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="h-full w-full p-6 flex flex-col items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full p-6 flex flex-col items-center justify-center">
        <div className="text-red-300 text-xl mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all"
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
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-1">FlashCard Kids 🎯</h1>
          <p className="text-base opacity-90">儿童英语认知学习</p>
          <p className="text-sm opacity-75">共 {categories.length} 个分类</p>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* 分类卡片网格 - 响应式紧凑布局 */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 h-full overflow-y-auto pb-2">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onNavigate('category', category.name)}
              className="bg-white rounded-lg shadow-sm cursor-pointer group hover:shadow-md transition-all duration-200 hover:scale-105 mx-auto"
              style={{ aspectRatio: '2/3', width: '100%', maxWidth: '150px' }}
            >
              <div className="relative h-full flex flex-col">
                {/* 图片区域 - 现在显示大图而不是小图标 */}
                <div className="relative flex-1 overflow-hidden rounded-t-lg">
                  <img
                    src={getCategoryImage(category.name)}
                    alt={category.display_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {/* 文字区域 */}
                <div className="p-2 bg-white rounded-b-lg flex flex-col items-center">
                  <h3 className="text-xs font-bold text-gray-800 mb-0.5 text-center line-clamp-1">{getCategoryEnglishName(category.name)}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeScreen 