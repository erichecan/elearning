import React from 'react'
import { Settings } from 'lucide-react'

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'card' | 'settings' | 'category', category?: string) => void
}

const categories = [
  {
    id: 'fruits',
    name: '水果蔬菜',
    englishName: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=600&fit=crop',
  },
  {
    id: 'animals',
    name: '动物世界',
    englishName: 'Animals',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=600&fit=crop',
  },
  {
    id: 'colors',
    name: '颜色形状',
    englishName: 'Colors & Shapes',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=600&fit=crop',
  },
  {
    id: 'numbers',
    name: '数字时间',
    englishName: 'Numbers & Time',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
  },
  {
    id: 'family',
    name: '家庭成员',
    englishName: 'Family Members',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop',
  },
  {
    id: 'body',
    name: '身体部位',
    englishName: 'Body Parts',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=600&fit=crop',
  },
  {
    id: 'clothes',
    name: '服装配饰',
    englishName: 'Clothes & Accessories',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=600&fit=crop',
  },
  {
    id: 'transport',
    name: '交通工具',
    englishName: 'Transportation',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=600&fit=crop',
  },
  {
    id: 'food',
    name: '食物饮料',
    englishName: 'Food & Drinks',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=600&fit=crop',
  },
  {
    id: 'school',
    name: '学校用品',
    englishName: 'School Supplies',
    image: 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=600&fit=crop',
  },
  {
    id: 'home',
    name: '家居用品',
    englishName: 'Household Items',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=600&fit=crop',
  },
  {
    id: 'weather',
    name: '天气季节',
    englishName: 'Weather & Seasons',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f2e07c346?w=400&h=600&fit=crop',
  },
  {
    id: 'sports',
    name: '运动娱乐',
    englishName: 'Sports & Fun',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=600&fit=crop',
  },
  {
    id: 'jobs',
    name: '职业工作',
    englishName: 'Jobs & Careers',
    image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&h=600&fit=crop',
  },
  {
    id: 'nature',
    name: '自然环境',
    englishName: 'Nature & Environment',
    image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&h=600&fit=crop',
  }
]

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full w-full p-6 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-1">FlashCard Kids 🎯</h1>
          <p className="text-base opacity-90">儿童英语认知学习</p>
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
              onClick={() => onNavigate('category', category.id)}
              className="bg-white rounded-lg shadow-sm cursor-pointer group hover:shadow-md transition-all duration-200 hover:scale-105 mx-auto"
              style={{ aspectRatio: '2/3', width: '100%' }}
            >
              <div className="relative h-full flex flex-col">
                {/* 图片区域 */}
                <div className="relative flex-1 overflow-hidden rounded-t-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* 文字区域 */}
                <div className="p-1 bg-white rounded-b-lg flex flex-col items-center">
                  <h3 className="text-xs font-bold text-gray-800 mb-0.5 truncate">{category.name}</h3>
                  <p className="text-[10px] text-gray-600 truncate">{category.englishName}</p>
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