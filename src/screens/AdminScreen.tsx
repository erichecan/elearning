import React, { useState } from 'react'
import { Settings, LogOut, RefreshCw } from 'lucide-react'
import { Word } from '../lib/database'
import { wordService } from '../services/api'
import { adminApiService, adminStorageService } from '../services/admin-api'
import { fetchChildren, getActiveChildId, setActiveChildId } from '../services/child-context'
import { BulkImportWizard } from './admin/BulkImportWizard';
import { ProductList } from './admin/ProductList';
import CoreWordsManager from './admin/CoreWordsManager';
import FlashcardsManager from './admin/FlashcardsManager';
import MathExercisesManager from './admin/MathExercisesManager';
import StorybooksManager from './admin/StorybooksManager';
import VSDManager from './admin/VSDManager';
import RewardsManager from './admin/RewardsManager';
import AnalyticsManager from './admin/AnalyticsManager';

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
  const [currentTab, setCurrentTab] = useState<'products' | 'bulk-import' | 'sync' | 'core-words' | 'flashcards' | 'math' | 'storybooks' | 'vsd' | 'rewards' | 'analytics'>('products')
  const [words, setWords] = useState<OptimizedWord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory] = useState<string>('')
  const [children, setChildren] = useState<Array<{ id: string; name: string }>>([])
  const [activeChildId, setActiveChildIdState] = useState<string | undefined>(() => getActiveChildId() || undefined)
  const [appRole, setAppRole] = useState<'parent' | 'therapist' | 'admin'>('admin')

  const canAccessTab = (tabId: string) => {
    if (appRole === 'admin') return true
    if (appRole === 'parent') return true
    if (appRole === 'therapist') {
      return ['flashcards', 'math', 'analytics', 'storybooks'].includes(tabId)
    }
    return false
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = password.trim()
    if (!token) return
    try {
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001'
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/admin/ping`, {
        headers: { 'x-admin-token': token }
      })
      if (!response.ok) throw new Error('Unauthorized')
      localStorage.setItem('adminToken', token)
      setIsAuthenticated(true)
      const savedRole = localStorage.getItem('appRole')
      if (savedRole === 'parent' || savedRole === 'therapist' || savedRole === 'admin') {
        setAppRole(savedRole)
      }
      const list = await fetchChildren().catch(() => [])
      setChildren(list)
      if (!activeChildId && list.length > 0) {
        setActiveChildId(list[0].id)
        setActiveChildIdState(list[0].id)
      }
    } catch (error) {
      localStorage.removeItem('adminToken')
      alert('管理员 Token 无效')
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
            <p className="text-gray-600 mt-2">请输入管理员 Token</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                管理员 Token
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="请输入管理员 Token"
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
              onClick={() => {
                localStorage.removeItem('adminToken')
                setIsAuthenticated(false)
              }}
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
              { id: 'flashcards', name: 'Flashcards' },
              { id: 'math', name: 'Math 题库' },
              { id: 'storybooks', name: '绘本' },
              { id: 'vsd', name: 'VSD 场景' },
              { id: 'rewards', name: '奖励规则' },
              { id: 'analytics', name: '行为分析' },
              { id: 'bulk-import', name: '批量导入' },
              { id: 'sync', name: '数据同步' }
            ].filter(tab => canAccessTab(tab.id)).map(tab => (
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
          <div className="pb-3 flex items-center gap-4">
            <label className="text-xs text-gray-500 mr-2">当前孩子</label>
            <select
              value={activeChildId || ''}
              onChange={(e) => {
                const id = e.target.value
                setActiveChildIdState(id || undefined)
                if (id) setActiveChildId(id)
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {children.length === 0 && <option value="">无孩子数据</option>}
              {children.map((child) => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
            <label className="text-xs text-gray-500">角色视图</label>
            <select
              value={appRole}
              onChange={(e) => {
                const next = e.target.value as 'parent' | 'therapist' | 'admin'
                setAppRole(next)
                localStorage.setItem('appRole', next)
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="admin">admin</option>
              <option value="parent">parent</option>
              <option value="therapist">therapist</option>
            </select>
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

        {currentTab === 'flashcards' && (
          <FlashcardsManager childId={activeChildId || undefined} />
        )}

        {currentTab === 'math' && (
          <MathExercisesManager childId={activeChildId || undefined} />
        )}

        {currentTab === 'storybooks' && (
          <StorybooksManager childId={activeChildId || undefined} />
        )}

        {currentTab === 'vsd' && (
          <VSDManager childId={activeChildId || undefined} />
        )}

        {currentTab === 'rewards' && (
          <RewardsManager childId={activeChildId || undefined} />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsManager childId={activeChildId || undefined} />
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
