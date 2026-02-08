import React, { useState, useEffect } from 'react'
import { Settings, Award, Star } from 'lucide-react'
import { categoryService } from '../services/api'
import { Category } from '../lib/database'

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'settings' | 'category' | 'admin' | 'math', category?: string) => void
}

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
  }
  return imageMap[categoryName] || 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'
}

const getCategoryEnglishName = (categoryName: string): string => {
  const nameMap: { [key: string]: string } = {
    'fruits': 'Fruits & Veggies',
    'animals': 'Animal Friends',
    'colors': 'Colors & Shapes',
    'numbers': 'Numbers & Time',
    'family': 'Family Members',
    'body': 'My Body',
    'clothes': 'Clothing',
    'food': 'Yummy Food',
    'transport': 'Vehicles',
    'nature': 'Nature World',
  }
  return nameMap[categoryName] || categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminClickCount, setAdminClickCount] = useState(0)

  const handleAdminAccess = () => {
    setAdminClickCount(prev => prev + 1)
    if (adminClickCount >= 4) {
      onNavigate('admin')
      setAdminClickCount(0)
    }
    setTimeout(() => {
      setAdminClickCount(0)
    }, 3000)
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const categoriesData = await categoryService.getAll()
        setCategories(categoriesData)
      } catch (err) {
        console.error('加载分类失败:', err)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-primary-50">
        <div className="animate-bounce-slow text-primary-600 text-xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col bg-primary-50">
      {/* Dashboard Header */}
      <header className="flex items-center justify-between mb-8 bg-white p-4 rounded-3xl shadow-soft">
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 p-3 rounded-2xl">
            <span className="text-2xl">🎓</span>
          </div>
          <div>
            <h1
              className="text-2xl font-extrabold text-primary-900 cursor-pointer select-none tracking-tight"
              onClick={handleAdminAccess}
            >
              FlashCard Kids
            </h1>
            <p className="text-secondary-500 font-semibold">{categories.length} Topics Available</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-accent-100 px-4 py-2 rounded-full text-accent-700 font-bold">
            <Award size={20} />
            <span>Level 1</span>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="p-3 bg-secondary-50 text-secondary-600 rounded-2xl hover:bg-secondary-100 transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>



      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">

        {/* Featured Section: Math */}
        <div className="px-2 mb-6">
          <h3 className="text-xl font-bold text-primary-800 mb-4">Learning Zone</h3>
          <div
            onClick={() => onNavigate('math')}
            className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl p-6 shadow-float text-white cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold mb-2">Math Adventure 123</h2>
                <p className="opacity-90 font-medium">Learn Make 10 & Adding with friends!</p>
              </div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <span className="text-4xl">🧮</span>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-primary-800 mb-4 px-2">Explore Topics</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onNavigate('category', category.name)}
              className="group bg-white rounded-3xl p-3 shadow-card hover:shadow-float hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-primary-100/50"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 relative bg-primary-50">
                <img
                  src={getCategoryImage(category.name)}
                  alt={category.display_name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
              </div>

              <div className="text-center">
                <h3 className="text-primary-900 font-extrabold text-lg leading-tight mb-1">
                  {getCategoryEnglishName(category.name)}
                </h3>
                <p className="text-primary-400 text-sm font-medium">{category.display_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeScreen