import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Volume2, VolumeX, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('categories') // 'categories' | 'flashcard'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiBaseUrl = 'https://qjh9iecekgxv.manus.space/api/learning'

  const currentWord = selectedCategory && selectedCategory.words && selectedCategory.words.length > 0 
    ? selectedCategory.words[currentWordIndex] 
    : null

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${apiBaseUrl}/categories`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data.filter(category => category.word_count > 0))
      } else {
        throw new Error(data.error || 'Failed to load categories')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setError(error.message)
      // 如果 API 失败，使用备用数据
      setCategories(getFallbackCategories())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackCategories = () => {
    return [
      {
        id: 1,
        name: 'Animals',
        icon: '🐾',
        word_count: 5,
        words: [
          { id: 1, text: 'cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop' },
          { id: 2, text: 'dog', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop' },
          { id: 3, text: 'bird', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop' },
          { id: 4, text: 'fish', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop' },
          { id: 5, text: 'elephant', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop' }
        ]
      },
      {
        id: 2,
        name: 'Food',
        icon: '🍎',
        word_count: 5,
        words: [
          { id: 6, text: 'apple', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop' },
          { id: 7, text: 'banana', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop' },
          { id: 8, text: 'bread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
          { id: 9, text: 'milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
          { id: 10, text: 'cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' }
        ]
      },
      {
        id: 3,
        name: 'Colors',
        icon: '🌈',
        word_count: 5,
        words: [
          { id: 11, text: 'red', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop' },
          { id: 12, text: 'blue', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop' },
          { id: 13, text: 'green', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
          { id: 14, text: 'yellow', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
          { id: 15, text: 'purple', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop' }
        ]
      }
    ]
  }

  const selectCategory = (category) => {
    setSelectedCategory(category)
    setCurrentWordIndex(0)
    setCurrentView('flashcard')
  }

  const goBack = () => {
    setCurrentView('categories')
    setSelectedCategory(null)
    setCurrentWordIndex(0)
  }

  const nextWord = () => {
    if (selectedCategory && currentWordIndex < selectedCategory.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    }
  }

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
    }
  }

  const playAudio = () => {
    if (!soundEnabled || !currentWord) return
    
    // 使用 Web Speech API 进行语音合成
    if ('speechSynthesis' in window) {
      // 停止当前播放的语音
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(currentWord.text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      utterance.pitch = 1.2
      utterance.volume = 1.0
      
      // 尝试使用更适合儿童的声音
      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('Female') || voice.name.includes('Woman') || voice.name.includes('Samantha'))
      )
      
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }
      
      speechSynthesis.speak(utterance)
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (soundEnabled) {
      speechSynthesis.cancel()
    }
  }

  const handleImageError = (event) => {
    // 如果图片加载失败，显示默认图片
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE2MCAyMDBIMjQwTDIwMCAxNTBaIiBmaWxsPSIjOUI5QkEzIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM5QjlCQTMiLz4KPC9zdmc+'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadCategories} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* 头部导航 */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            🌟 English Learning 🌟
          </h1>
          <Button
            onClick={toggleSound}
            variant="outline"
            size="lg"
            className={`bg-white/20 border-white/30 text-white hover:bg-white/30 ${!soundEnabled ? 'opacity-50' : ''}`}
          >
            {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="p-4 md:p-8">
        {currentView === 'categories' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12 drop-shadow-lg">
              Choose a Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => selectCategory(category)}
                  className="bg-white rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl min-h-[200px] md:min-h-[250px] flex flex-col justify-center items-center"
                >
                  <div className="text-5xl md:text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.word_count} words</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'flashcard' && currentWord && (
          <div className="max-w-4xl mx-auto">
            {/* Flashcard 头部 */}
            <div className="flex justify-between items-center mb-8 text-white">
              <Button
                onClick={goBack}
                variant="outline"
                size="lg"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                {selectedCategory.name}
              </h2>
              <div className="bg-white/20 px-4 py-2 rounded-full font-semibold">
                {currentWordIndex + 1} / {selectedCategory.words.length}
              </div>
            </div>

            {/* Flashcard */}
            <div className="mb-8">
              <div
                onClick={playAudio}
                className="bg-white rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-2xl max-w-2xl mx-auto relative"
              >
                <div className="relative mb-6">
                  <img
                    src={currentWord.image}
                    alt={currentWord.text}
                    onError={handleImageError}
                    className="w-full h-64 md:h-80 object-cover rounded-xl"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full">
                    <Volume2 className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {currentWord.text}
                  </h3>
                  <p className="text-gray-600">Tap to hear pronunciation</p>
                </div>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex justify-center gap-6">
              <Button
                onClick={previousWord}
                disabled={currentWordIndex === 0}
                size="lg"
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              <Button
                onClick={nextWord}
                disabled={currentWordIndex >= selectedCategory.words.length - 1}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

