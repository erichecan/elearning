import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import SettingsScreen from './screens/SettingsScreen'
import CategoryScreen from './screens/CategoryScreen'
import AdminScreen from './screens/AdminScreen'

type Screen = 'home' | 'category' | 'settings' | 'admin'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const navigateTo = (screen: Screen, payload?: any) => {
    setCurrentScreen(screen)
    if (screen === 'category') {
      setSelectedCategory(payload)
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-primary-50">
      {/* 主内容区域 */}
      <div className="h-full w-full relative">
        {currentScreen === 'home' && (
          <HomeScreen onNavigate={navigateTo} />
        )}
        {currentScreen === 'category' && selectedCategory && (
          <CategoryScreen
            category={selectedCategory}
            onBack={() => navigateTo('home')}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen
            onBack={() => navigateTo('home')}
          />
        )}
        {currentScreen === 'admin' && (
          <AdminScreen
            onBack={() => navigateTo('home')}
          />
        )}
      </div>
    </div>
  )
}

export default App 