import React, { useState, useEffect } from 'react'
import { Settings, Star } from 'lucide-react'
import { categoryService } from '../services/api'
import { Category } from '../lib/database'

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'settings' | 'category' | 'admin' | 'math', category?: string) => void
}

const CATEGORY_IMAGES: Record<string, string> = {
  fruits:         'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
  animals:        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
  colors:         'https://images.unsplash.com/photo-1558618047-b93c0c2e2041?w=400&h=300&fit=crop',
  numbers_small:  'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop',
  numbers_big:    'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop',
  family:         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  body:           'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  clothes:        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
  vehicles:       'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
  feelings:       'https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=400&h=300&fit=crop',
  instruments:    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
  jobs:           'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
  animal_sounds:  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop',
  letter_sounds:  'https://images.unsplash.com/photo-1546953304-5d96f43c2e94?w=400&h=300&fit=crop',
  mouth_exercises:'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=400&h=300&fit=crop',
  friends:        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
  songs:          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
  adjectives:     'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop',
  talking:        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
  exclamations:   'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
}

const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23FFEAD8" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="48" fill="%23FB7938"%3E📚%3C/text%3E%3C/svg%3E'

const SAGO_CHARACTERS = [
  { name: 'Robin',  url: 'https://sagomini.com/workspace/uploads/characters/main/sagomini_primary-character_hover-05-1474399754.svg' },
  { name: 'Jinja',  url: 'https://sagomini.com/workspace/uploads/characters/main/sagomini_primary-character_hover-03-1474399665.svg' },
  { name: 'Harvey', url: 'https://sagomini.com/workspace/uploads/characters/main/sagomini_primary-character_hover-07-1474399394.svg' },
  { name: 'Jack',   url: 'https://sagomini.com/workspace/uploads/characters/main/sagomini_primary-character_hover-01-1474397662.svg' },
]

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminClickCount, setAdminClickCount] = useState(0)

  const handleAdminAccess = () => {
    const next = adminClickCount + 1
    setAdminClickCount(next)
    if (next >= 5) {
      onNavigate('admin')
      setAdminClickCount(0)
      return
    }
    setTimeout(() => setAdminClickCount(0), 3000)
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await categoryService.getAll()
        setCategories(data)
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
        <div className="animate-bounce-slow text-primary-500 text-xl font-extrabold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col bg-primary-50">

      {/* Header */}
      <header className="flex items-center justify-between mb-8 bg-white p-4 rounded-3xl shadow-soft overflow-hidden relative">
        {/* Sagomini characters — decorative strip */}
        <div className="absolute right-28 top-0 bottom-0 flex items-end gap-1 pointer-events-none select-none opacity-90">
          {SAGO_CHARACTERS.map((c) => (
            <img
              key={c.name}
              src={c.url}
              alt={c.name}
              className="h-14 w-auto object-contain drop-shadow-sm"
              draggable={false}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 relative z-10">
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
            <p className="text-secondary-400 font-bold text-sm">{categories.length} Topics Available</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="hidden md:flex items-center gap-2 bg-accent-100 px-4 py-2 rounded-full text-accent-500 font-extrabold text-sm">
            <Star size={16} fill="currentColor" />
            <span>Level 1</span>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="p-3 bg-secondary-50 text-secondary-500 rounded-2xl hover:bg-secondary-100 transition-colors"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">

        {/* Featured: Math */}
        <div className="px-1 mb-6">
          <h2 className="text-lg font-extrabold text-primary-900 mb-3">Learning Zone</h2>
          <div
            onClick={() => onNavigate('math')}
            className="rounded-3xl p-6 shadow-float text-white cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FAA61A 0%, #FB7938 100%)' }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold mb-1 drop-shadow-sm">Math Adventure 123</h3>
                <p className="opacity-90 font-semibold text-sm">Learn Make 10 & Adding with friends!</p>
              </div>
              <div className="bg-white/25 p-4 rounded-full backdrop-blur-sm">
                <span className="text-4xl">🧮</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category grid */}
        <h2 className="text-lg font-extrabold text-primary-900 mb-3 px-1">Explore Topics</h2>

        {error ? (
          <p className="text-center text-primary-400 font-semibold py-8">{error}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-1">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => onNavigate('category', category.name)}
                className="bg-white rounded-3xl p-3 shadow-card hover:shadow-float hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-primary-100"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-primary-50">
                  <img
                    src={CATEGORY_IMAGES[category.name] || FALLBACK_IMAGE}
                    alt={category.display_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.errored) {
                        img.dataset.errored = 'true'
                        img.src = FALLBACK_IMAGE
                      }
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-primary-900 font-extrabold text-base leading-tight">
                    {category.display_name}
                  </h3>
                  {category.icon && (
                    <p className="text-lg mt-0.5">{category.icon}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeScreen
