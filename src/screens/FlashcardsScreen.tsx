import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { categoryService } from '../services/api'
import { Category } from '../lib/database'

interface FlashcardsScreenProps {
  onBack: () => void
  onOpenCategory: (category: string) => void
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

const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ onBack, onOpenCategory }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col bg-primary-50">
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 bg-white text-secondary-600 rounded-2xl shadow-soft hover:shadow-md transition-all border border-secondary-50"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-primary-900 tracking-tight">Flashcards</h1>
          <p className="text-sm font-semibold text-primary-500">{categories.length} Categories</p>
        </div>
        <div className="w-12"></div>
      </header>

      <div className="flex-1 overflow-y-auto pb-4 px-2 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onOpenCategory(category.name)}
              className="group bg-white rounded-3xl p-3 shadow-card hover:shadow-float hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-primary-100/50"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 relative bg-primary-50">
                <img
                  src={getCategoryImage(category.name)}
                  alt={category.display_name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'
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

export default FlashcardsScreen
