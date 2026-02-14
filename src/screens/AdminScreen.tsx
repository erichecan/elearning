import React, { useState } from 'react'
import { Settings, LogOut, RefreshCw } from 'lucide-react'
import { Word, Category } from '../lib/database'
import { wordService, categoryService } from '../services/api'
import { adminApiService, adminStorageService } from '../services/admin-api'
import { BulkImportWizard } from './admin/BulkImportWizard';
import { ProductList } from './admin/ProductList';
import CoreWordsManager from './admin/CoreWordsManager';

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
  const [currentTab, setCurrentTab] = useState<'products' | 'bulk-import' | 'sync' | 'core-words'>('products')
  const [words, setWords] = useState<OptimizedWord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('密码错误')
    }
  }

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
        }
      })
      setWords(optimizedWords)
    } catch (error) {
      console.error('加载单词失败:', error)
    } finally {
      setLoading(false)
    }
  }

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
        alert(`✅ 成功同步 ${syncResult.updated} 张图片到数据库！`)
        approvedWords.forEach(word => {
          adminStorageService.clearApprovalStatus(word.id)
        })
        if (selectedCategory) {
          await loadWords(selectedCategory)
        }
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
            <p className="text-gray-600 mt-2">内容管理系统</p>
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
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 主界面
  return (
    <div className="h-full w-full bg-gray-100 flex flex-col">
      {/* 顶部导航 */}
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

      {/* 标签导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'products', name: '内容管理' },
              { id: 'core-words', name: 'Core Words' },
              { id: 'bulk-import', name: '批量导入' },
              { id: 'sync', name: '数据同步' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`py-4 border-b-2 transition-colors ${currentTab === tab.id
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
        {currentTab === 'products' && (
          <ProductList />
        )}

        {currentTab === 'bulk-import' && (
          <BulkImportWizard onBack={() => setCurrentTab('products')} />
        )}

        {currentTab === 'core-words' && (
          <CoreWordsManager />
        )}

        {currentTab === 'sync' && (
          <div className="max-w-7xl mx-auto px-4 py-8 h-full overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">数据同步管理</h3>
              <div className="space-y-4">
                <button
                  onClick={syncApprovedImages}
                  disabled={loading}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center"
                >
                  <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={18} />
                  {loading ? '同步中...' : '同步已审核图片到数据库'}
                </button>
                <p className="text-gray-600">
                  将审核通过的图片同步到Supabase数据库
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminScreen
