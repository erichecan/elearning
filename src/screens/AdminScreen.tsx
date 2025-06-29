import React, { useState, useEffect } from 'react'
import { Settings, Eye, Check, X, RefreshCw, Upload, Trash2, LogOut } from 'lucide-react'
import { Word, Category } from '../lib/database'
import { wordService, categoryService } from '../services/api'
import { adminApiService, adminStorageService, ImageOptimizationResult } from '../services/admin-api'

interface AdminScreenProps {
  onBack: () => void
}

interface OptimizedWord extends Word {
  isApproved?: boolean
  isRejected?: boolean
  optimizedImageUrl?: string
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [currentTab, setCurrentTab] = useState<'overview' | 'optimize' | 'review' | 'sync'>('overview')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [words, setWords] = useState<OptimizedWord[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalWords: 0,
    wordsWithImages: 0,
    pendingReview: 0,
    approved: 0
  })

  // 简单的密码验证
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
      loadStats()
      loadCategories()
    } else {
      alert('密码错误')
    }
  }

  // 加载统计数据
  const loadStats = async () => {
    try {
      // 由于wordService没有getAll方法，我们从所有分类中获取单词
      const allCategories = await categoryService.getAll()
      let allWords: Word[] = []
      
      for (const category of allCategories) {
        const categoryWords = await wordService.getByCategory(category.name)
        allWords = allWords.concat(categoryWords)
      }
      
      const approved = allWords.filter((w: Word) => adminStorageService.getApprovalStatus(w.id).approved)
      
      setStats({
        totalWords: allWords.length,
        wordsWithImages: allWords.filter((w: Word) => w.image_url).length,
        pendingReview: allWords.filter((w: Word) => w.image_url && !localStorage.getItem(`approved_${w.id}`)).length,
        approved: approved.length
      })
    } catch (error) {
      console.error('加载统计失败:', error)
    }
  }

  // 加载分类
  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll()
      setCategories(categoriesData)
    } catch (error) {
      console.error('加载分类失败:', error)
    }
  }

  // 加载单词
  const loadWords = async (category: string) => {
    setLoading(true)
    try {
      const wordsData = await wordService.getByCategory(category)
      const optimizedWords = wordsData.map(word => {
        const approvalStatus = adminStorageService.getApprovalStatus(word.id)
        return {
          ...word,
          isApproved: approvalStatus.approved,
          isRejected: approvalStatus.rejected,
          optimizedImageUrl: generateOptimizedImageUrl(word.word, category)
        }
      })
      setWords(optimizedWords)
    } catch (error) {
      console.error('加载单词失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 生成优化的图片URL
  const generateOptimizedImageUrl = (word: string, category: string) => {
    const categoryKeywords: { [key: string]: string } = {
      'fruits': 'fruit,fresh,healthy',
      'animals': 'animal,cute,wildlife',
      'colors': 'color,colorful,bright',
      'numbers': 'number,counting,math',
      'family': 'family,people,person',
      'body': 'human,anatomy,body',
      'clothes': 'clothing,fashion,wear',
      'food': 'food,cooking,meal',
      'transport': 'vehicle,transportation,travel',
      'nature': 'nature,outdoor,natural'
    }

    const keywords = categoryKeywords[category] || 'object'
    return `https://source.unsplash.com/400x300/?${word},${keywords},realistic,clear`
  }

  // 批量优化图片
  const optimizeImages = async () => {
    if (!selectedCategory) {
      alert('请先选择分类')
      return
    }

    setLoading(true)
    try {
      const wordsToOptimize = words.filter(w => !w.image_url)
      
      const optimizationResults = await adminApiService.optimizeWordImages(wordsToOptimize, selectedCategory)
      
      // 更新界面状态
      optimizationResults.forEach(result => {
        if (result.success) {
          setWords(prev => prev.map(w => 
            w.id === result.wordId 
              ? { ...w, optimizedImageUrl: result.newImageUrl }
              : w
          ))
        }
      })
      
      const successCount = optimizationResults.filter(r => r.success).length
      alert(`已为 ${successCount} 个单词生成优化图片，请审核后同步`)
    } catch (error) {
      console.error('优化失败:', error)
      alert('优化失败')
    } finally {
      setLoading(false)
    }
  }

  // 审核图片
  const reviewImage = (wordId: number, approved: boolean) => {
    adminStorageService.setApprovalStatus(wordId, approved)
    
    setWords(prev => prev.map(w => 
      w.id === wordId 
        ? { ...w, isApproved: approved, isRejected: !approved }
        : w
    ))
    
    loadStats()
  }

  // 同步到数据库
  const syncApprovedImages = async () => {
    const approvedWords = words.filter(w => w.isApproved && w.optimizedImageUrl)
    
    if (approvedWords.length === 0) {
      alert('没有已审核通过的图片需要同步')
      return
    }

    setLoading(true)
    try {
      // 检查Supabase连接
      const connectionStatus = await adminApiService.checkSupabaseConnection()
      if (!connectionStatus.connected) {
        throw new Error(`数据库连接失败: ${connectionStatus.error}`)
      }

      // 准备同步数据
      const imageUpdates = approvedWords.map(word => ({
        wordId: word.id,
        word: word.word,
        imageUrl: word.optimizedImageUrl!
      }))

      // 同步到Supabase
      const syncResult = await adminApiService.syncImagesToSupabase(imageUpdates)
      
      // 显示结果
      if (syncResult.updated > 0) {
        alert(`✅ 成功同步 ${syncResult.updated} 张图片到数据库！${syncResult.failed > 0 ? `\n❌ ${syncResult.failed} 张图片同步失败` : ''}`)
        
        // 清除已同步的审核状态
        approvedWords.forEach(word => {
          adminStorageService.clearApprovalStatus(word.id)
        })
        
        // 重新加载数据
        await loadWords(selectedCategory)
        await loadStats()
      } else {
        throw new Error('没有图片成功同步')
      }
      
    } catch (error) {
      console.error('同步失败:', error)
      alert(`同步失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  // 登录界面
  if (!isAuthenticated) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Settings className="mx-auto mb-4 text-blue-500" size={48} />
            <h1 className="text-2xl font-bold text-gray-800">Admin 后台管理</h1>
            <p className="text-gray-600 mt-2">图片优化与审核系统</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                管理员密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="请输入管理员密码"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              登录
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              返回主页
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 主界面
  return (
    <div className="h-full w-full bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Settings className="text-blue-500" size={24} />
              <h1 className="text-xl font-bold text-gray-900">Admin 后台管理</h1>
            </div>
            
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              <LogOut size={20} />
              <span>退出</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: '概览' },
              { id: 'optimize', name: '图片优化' },
              { id: 'review', name: '审核管理' },
              { id: 'sync', name: '数据同步' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`py-4 border-b-2 transition-colors ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">总单词数</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalWords}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">有图片单词</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.wordsWithImages}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">待审核</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingReview}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">已审核通过</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.approved}</p>
            </div>
          </div>
        )}

        {currentTab === 'optimize' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">选择分类进行优化</h3>
            <div className="flex items-center space-x-4 mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  if (e.target.value) {
                    loadWords(e.target.value)
                  }
                }}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">选择分类</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.display_name}</option>
                ))}
              </select>
              
              <button
                onClick={optimizeImages}
                disabled={!selectedCategory || loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? '处理中...' : '生成优化图片'}
              </button>
            </div>
            
            {words.length > 0 && (
              <p className="text-gray-600">
                找到 {words.length} 个单词，其中 {words.filter(w => !w.image_url).length} 个缺少图片
              </p>
            )}
          </div>
        )}

        {currentTab === 'review' && selectedCategory && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">审核 {selectedCategory} 分类的图片</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {words.filter(w => w.optimizedImageUrl || w.image_url).map(word => (
                <div key={word.id} className="border rounded-lg p-4">
                  <img
                    src={word.optimizedImageUrl || word.image_url}
                    alt={word.word}
                    className="w-full h-32 object-cover rounded mb-3"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=加载失败'
                    }}
                  />
                  
                  <div className="text-center">
                    <h4 className="font-medium">{word.word}</h4>
                    <p className="text-sm text-gray-500">{word.chinese}</p>
                    
                    <div className="flex justify-center space-x-2 mt-3">
                      <button
                        onClick={() => reviewImage(word.id, true)}
                        className={`p-2 rounded ${
                          word.isApproved ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => reviewImage(word.id, false)}
                        className={`p-2 rounded ${
                          word.isRejected ? 'bg-red-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'sync' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">数据同步</h3>
            
            <button
              onClick={syncApprovedImages}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              同步已审核图片到数据库
            </button>
            
            <p className="text-gray-600 mt-4">
              将审核通过的图片同步到本地数据库和Supabase
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminScreen 