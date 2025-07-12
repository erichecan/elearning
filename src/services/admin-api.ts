import { supabase, Word } from '../lib/database'

export interface ImageOptimizationResult {
  success: boolean
  wordId: number
  word: string
  oldImageUrl?: string
  newImageUrl: string
  error?: string
}

export interface SyncResult {
  updated: number
  failed: number
  errors: Array<{ word: string; error: string }>
}

// 生成优化的图片URL
function generateOptimizedImageUrl(word: string, category: string): string {
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

// Admin API服务
export const adminApiService = {
  // 批量优化单词图片
  async optimizeWordImages(words: Word[], category: string): Promise<ImageOptimizationResult[]> {
    const results: ImageOptimizationResult[] = []
    
    for (const word of words) {
      try {
        const newImageUrl = generateOptimizedImageUrl(word.word, category)
        
        results.push({
          success: true,
          wordId: word.id,
          word: word.word,
          oldImageUrl: word.image_url,
          newImageUrl
        })
      } catch (error) {
        results.push({
          success: false,
          wordId: word.id,
          word: word.word,
          oldImageUrl: word.image_url,
          newImageUrl: '',
          error: error instanceof Error ? error.message : '未知错误'
        })
      }
    }
    
    return results
  },

  // 同步图片到Supabase
  async syncImagesToSupabase(imageUpdates: Array<{ wordId: number; word: string; imageUrl: string }>): Promise<SyncResult> {
    const result: SyncResult = {
      updated: 0,
      failed: 0,
      errors: []
    }
    
    for (const update of imageUpdates) {
      try {
        const { error } = await supabase
          .from('words')
          .update({ image_url: update.imageUrl })
          .eq('id', update.wordId)
          .select()
        
        if (error) throw error
        result.updated++
        console.log(`✅ 同步成功: ${update.word} -> ${update.imageUrl}`)
        
      } catch (error) {
        result.failed++
        const errorMessage = error instanceof Error ? error.message : '未知错误'
        result.errors.push({ word: update.word, error: errorMessage })
        console.error(`❌ 同步失败: ${update.word} - ${errorMessage}`)
      }
      
      // 避免API限制
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    return result
  },

  // 删除单词
  async deleteWord(wordId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('words')
        .update({ is_active: false }) // 软删除，标记为不活跃
        .eq('id', wordId)
      
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      return { success: false, error: errorMessage }
    }
  },

  // 恢复单词
  async restoreWord(wordId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('words')
        .update({ is_active: true })
        .eq('id', wordId)
      
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      return { success: false, error: errorMessage }
    }
  },

  // 批量更新单词图片
  async batchUpdateImages(updates: Array<{ wordId: number; imageUrl: string }>): Promise<SyncResult> {
    const result: SyncResult = {
      updated: 0,
      failed: 0,
      errors: []
    }
    
    for (const update of updates) {
      try {
        const { error } = await supabase
          .from('words')
          .update({ image_url: update.imageUrl })
          .eq('id', update.wordId)
          .select('word')
        
        if (error) throw error
        result.updated++
        
      } catch (error) {
        result.failed++
        const errorMessage = error instanceof Error ? error.message : '未知错误'
        result.errors.push({ 
          word: `ID:${update.wordId}`, 
          error: errorMessage 
        })
      }
    }
    
    return result
  },

  // 检查Supabase连接
  async checkSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('categories')
        .select('count(*)')
        .limit(1)
      
      if (error) throw error
      
      return { connected: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      return { connected: false, error: errorMessage }
    }
  },

  // 获取分类统计
  async getCategoryStats(categoryName: string): Promise<{
    totalWords: number
    wordsWithImages: number
    wordsWithoutImages: number
  }> {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('image_url, categories!inner(name)')
        .eq('categories.name', categoryName)
        .eq('is_active', true)
      
      if (error) throw error
      
      const totalWords = data?.length || 0
      const wordsWithImages = data?.filter(w => w.image_url && w.image_url.trim() !== '').length || 0
      const wordsWithoutImages = totalWords - wordsWithImages
      
      return {
        totalWords,
        wordsWithImages,
        wordsWithoutImages
      }
    } catch (error) {
      console.error('获取分类统计失败:', error)
      return {
        totalWords: 0,
        wordsWithImages: 0,
        wordsWithoutImages: 0
      }
    }
  },

  // 预览优化结果
  previewOptimization(words: Word[], category: string): Array<{
    wordId: number
    word: string
    chinese: string
    currentImageUrl: string | undefined
    optimizedImageUrl: string
  }> {
    return words.map(word => ({
      wordId: word.id,
      word: word.word,
      chinese: word.chinese,
      currentImageUrl: word.image_url,
      optimizedImageUrl: generateOptimizedImageUrl(word.word, category)
    }))
  }
}

// 本地存储管理（用于审核状态）
export const adminStorageService = {
  // 设置审核状态
  setApprovalStatus(wordId: number, approved: boolean) {
    localStorage.setItem(`approved_${wordId}`, approved.toString())
    localStorage.setItem(`rejected_${wordId}`, (!approved).toString())
  },

  // 获取审核状态
  getApprovalStatus(wordId: number): { approved: boolean; rejected: boolean } {
    const approved = localStorage.getItem(`approved_${wordId}`) === 'true'
    const rejected = localStorage.getItem(`rejected_${wordId}`) === 'true'
    return { approved, rejected }
  },

  // 清除审核状态
  clearApprovalStatus(wordId: number) {
    localStorage.removeItem(`approved_${wordId}`)
    localStorage.removeItem(`rejected_${wordId}`)
  },

  // 获取所有审核通过的单词ID
  getApprovedWordIds(): number[] {
    const approvedIds: number[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('approved_') && localStorage.getItem(key) === 'true') {
        const wordId = parseInt(key.replace('approved_', ''))
        if (!isNaN(wordId)) {
          approvedIds.push(wordId)
        }
      }
    }
    
    return approvedIds
  },

  // 清除所有审核状态
  clearAllApprovalStatuses() {
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('approved_') || key.startsWith('rejected_'))) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }
} 