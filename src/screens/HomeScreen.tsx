import React, { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { categoryService } from '../services/api'
import { Category } from '../lib/database'

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'settings' | 'category' | 'admin', category?: string) => void
}

// 使用AI优化的智能图片搜索 - 更好的匹配度和质量
const getCategoryImage = (categoryName: string): string => {
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
  
  return imageMap[categoryName] || 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'
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

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminClickCount, setAdminClickCount] = useState(0)

  // 处理admin入口
  const handleAdminAccess = () => {
    setAdminClickCount(prev => prev + 1)
    if (adminClickCount >= 4) {
      onNavigate('admin')
      setAdminClickCount(0)
    }
    
    // 重置计数器
    setTimeout(() => {
      setAdminClickCount(0)
    }, 3000)
  }

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
          <h1 
            className="text-3xl font-bold mb-1 cursor-pointer select-none"
            onClick={handleAdminAccess}
            title="连续点击5次进入管理模式"
          >
            FlashCard Kids 🎯
          </h1>
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
                    onError={(e) => {
                      // 图片加载失败时使用备用图片
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop';
                    }}
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