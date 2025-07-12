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

const AdminScreenFixed: React.FC<AdminScreenProps> = ({ onBack }) => {
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
        pendingReview: allWords.filter((w: Word) => w.image_url && !adminStorageService.getApprovalStatus(w.id).approved).length,
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
      console.log(`加载了 ${optimizedWords.length} 个单词，其中 ${optimizedWords.filter(w => w.optimizedImageUrl).length} 个有优化图片`)
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
    const url = `https://source.unsplash.com/400x300/?${word},${keywords},realistic,clear`
    console.log(`生成图片URL: ${word} -> ${url}`)
    return url
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
      console.log(`开始优化 ${wordsToOptimize.length} 个单词的图片`)
      
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
      alert(`已为 ${successCount} 个单词生成优化图片，请在"审核管理"页面审核后同步`)
      
      // 自动切换到审核页面
      setCurrentTab('review')
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
      const connectionStatus = await adminApiService.checkSupabaseConnection()
      if (!connectionStatus.connected) {
        throw new Error(`数据库连接失败: ${connectionStatus.error}`)
      }

      const imageUpdates = approvedWords.map(word => ({
        wordId: word.id,
        word: word.word,
        imageUrl: word.optimizedImageUrl!
      }))

      const syncResult = await adminApiService.syncImagesToSupabase(imageUpdates)
      
      if (syncResult.updated > 0) {
        alert(`✅ 成功同步 ${syncResult.updated} 张图片到数据库！${syncResult.failed > 0 ? `\n❌ ${syncResult.failed} 张图片同步失败` : ''}`)
        
        approvedWords.forEach(word => {
          adminStorageService.clearApprovalStatus(word.id)
        })
        
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
    <div className="h-full w-full bg-gray-100 flex flex-col overflow-hidden">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
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

      {/* 标签导航 */}
      <div className="bg-white border-b flex-shrink-0">
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

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 h-full overflow-y-auto">
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
                <div className="text-gray-600">
                  <p>找到 {words.length} 个单词，其中 {words.filter(w => !w.image_url).length} 个缺少图片</p>
                  <p className="text-sm mt-1">点击"生成优化图片"按钮为缺少图片的单词创建AI优化图片</p>
                </div>
              )}
            </div>
          )}

          {currentTab === 'review' && (
            <div className="space-y-6">
              {!selectedCategory && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">审核管理</h3>
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">请先在"图片优化"页面选择分类并生成优化图片</p>
                    <button
                      onClick={() => setCurrentTab('optimize')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      前往图片优化
                    </button>
                  </div>
                </div>
              )}
              
              {selectedCategory && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">审核 {selectedCategory} 分类的图片</h3>
                    <div className="text-sm text-gray-600">
                      共 {words.length} 个单词 | 
                      可审核 {words.filter(w => w.optimizedImageUrl || w.image_url).length} 个 |
                      已审核 {words.filter(w => w.isApproved || w.isRejected).length} 个
                    </div>
                  </div>
                  
                  {loading && (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <p className="text-gray-600 mt-2">加载中...</p>
                    </div>
                  )}
                  
                  {!loading && words.filter(w => w.optimizedImageUrl || w.image_url).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        该分类暂无可审核的图片
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        请先在"图片优化"页面为该分类生成优化图片
                      </p>
                      <button
                        onClick={() => setCurrentTab('optimize')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        前往图片优化
                      </button>
                    </div>
                  )}
                  
                  {!loading && words.filter(w => w.optimizedImageUrl || w.image_url).length > 0 && (
                    <div className="max-h-[500px] overflow-y-auto border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {words.filter(w => w.optimizedImageUrl || w.image_url).map(word => (
                          <div key={word.id} className="border rounded-lg p-3 bg-gray-50 hover:bg-white transition-colors">
                            <div className="aspect-w-4 aspect-h-3 mb-3">
                              <img
                                src={word.optimizedImageUrl || word.image_url}
                                alt={word.word}
                                className="w-full h-32 object-cover rounded"
                                onError={(e) => {
                                  console.log(`图片加载失败: ${word.word} - ${e.currentTarget.src}`)
                                  e.currentTarget.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=' + encodeURIComponent(`${word.word}`)
                                }}
                                onLoad={() => {
                                  console.log(`图片加载成功: ${word.word}`)
                                }}
                              />
                            </div>
                            
                            <div className="text-center">
                              <h4 className="font-medium text-gray-900">{word.word}</h4>
                              <p className="text-sm text-gray-500 mb-2">{word.chinese}</p>
                              
                              {/* 显示图片来源 */}
                              <p className="text-xs text-gray-400 mb-3">
                                {word.optimizedImageUrl ? '🤖 AI优化图片' : '📷 原始图片'}
                              </p>
                              
                              <div className="flex justify-center space-x-2 mb-2">
                                <button
                                  onClick={() => reviewImage(word.id, true)}
                                  className={`p-2 rounded transition-colors ${
                                    word.isApproved 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-gray-200 hover:bg-green-100 text-gray-700'
                                  }`}
                                  title="审核通过"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => reviewImage(word.id, false)}
                                  className={`p-2 rounded transition-colors ${
                                    word.isRejected 
                                      ? 'bg-red-500 text-white' 
                                      : 'bg-gray-200 hover:bg-red-100 text-gray-700'
                                  }`}
                                  title="审核拒绝"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              
                              {/* 审核状态指示 */}
                              <div>
                                {word.isApproved && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    ✅ 已通过
                                  </span>
                                )}
                                {word.isRejected && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                    ❌ 已拒绝
                                  </span>
                                )}
                                {!word.isApproved && !word.isRejected && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    ⏳ 待审核
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentTab === 'sync' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">数据同步</h3>
              
              <div className="space-y-4">
                <button
                  onClick={syncApprovedImages}
                  disabled={loading}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? '同步中...' : '同步已审核图片到数据库'}
                </button>
                
                <p className="text-gray-600">
                  将审核通过的图片同步到本地数据库和Supabase
                </p>
                
                {selectedCategory && words.filter(w => w.isApproved).length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">
                      当前有 {words.filter(w => w.isApproved).length} 张已审核通过的图片可以同步
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminScreenFixed 