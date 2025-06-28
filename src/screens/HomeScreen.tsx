import React, { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { categoryService } from '../services/api'
import { Category } from '../lib/database'

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'card' | 'settings' | 'category', category?: string) => void
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
              style={{ aspectRatio: '2/3', width: '100%' }}
            >
              <div className="relative h-full flex flex-col">
                {/* 图片区域 */}
                <div className="relative flex-1 overflow-hidden rounded-t-lg">
                  <div 
                    className="w-full h-full flex items-center justify-center text-4xl"
                    style={{ backgroundColor: category.color || '#4ECDC4' }}
                  >
                    {category.icon || '📚'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* 文字区域 */}
                <div className="p-1 bg-white rounded-b-lg flex flex-col items-center">
                  <h3 className="text-xs font-bold text-gray-800 mb-0.5 truncate">{category.display_name}</h3>
                  <p className="text-[10px] text-gray-600 truncate">{category.description}</p>
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