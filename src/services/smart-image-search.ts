// 智能图片搜索服务
export interface ImageSearchResult {
  url: string
  thumbnail: string
  description: string
  source: string
  quality: number // 1-10 评分
  style: 'photo' | 'illustration' | 'vector'
}

export interface ImageSearchProvider {
  name: string
  searchImages(query: string, options: SearchOptions): Promise<ImageSearchResult[]>
  isAvailable(): boolean
}

export interface SearchOptions {
  category?: string
  style?: 'photo' | 'illustration' | 'vector' | 'any'
  orientation?: 'landscape' | 'portrait' | 'square' | 'any'
  minWidth?: number
  minHeight?: number
  safeSearch?: boolean
  limit?: number
}

// Unsplash API Provider (免费，无需API key)
class UnsplashProvider implements ImageSearchProvider {
  name = 'Unsplash'

  async searchImages(query: string, options: SearchOptions = {}): Promise<ImageSearchResult[]> {
    // 使用Unsplash Source API (无需API key)
    const results: ImageSearchResult[] = []
    
    // 生成几个不同的Unsplash图片URL
    for (let i = 0; i < (options.limit || 5); i++) {
      const width = options.minWidth || 400
      const height = options.minHeight || 300
      const searchTerms = query.replace(/\s+/g, ',')
      
      results.push({
        url: `https://source.unsplash.com/${width}x${height}/?${searchTerms}`,
        thumbnail: `https://source.unsplash.com/200x150/?${searchTerms}`,
        description: `${query} photo from Unsplash`,
        source: 'Unsplash',
        quality: 8,
        style: 'photo'
      })
    }
    
    return results
  }

  isAvailable(): boolean {
    return true // Unsplash Source API 总是可用
  }
}

// AI关键词优化器
class AIKeywordOptimizer {
  // 针对不同分类生成更精准的搜索关键词
  optimizeSearchKeywords(word: string, category: string): string[] {
    const categoryKeywords = this.getCategoryKeywords(category)
    const styleKeywords = this.getStyleKeywords(category)
    
    // 生成组合关键词
    const combinations = []
    
    // 基础组合
    combinations.push(word)
    combinations.push(`${word} ${categoryKeywords[0]}`)
    
    // 风格组合 - 选择最适合的风格
    const primaryStyle = styleKeywords[0]
    combinations.push(`${word} ${primaryStyle}`)
    
    // 教育相关组合
    combinations.push(`${word} for kids`)
    combinations.push(`${word} educational`)
    
    return combinations.slice(0, 3) // 返回前3个最佳组合
  }

  private getCategoryKeywords(category: string): string[] {
    const categoryMap: { [key: string]: string[] } = {
      'fruits': ['fruit', 'fresh', 'healthy'],
      'animals': ['animal', 'cute', 'wildlife'],
      'colors': ['color', 'colorful', 'bright'],
      'numbers': ['number', 'counting', 'math'],
      'family': ['family', 'people', 'person'],
      'body': ['human', 'anatomy', 'body'],
      'clothes': ['clothing', 'fashion', 'wear'],
      'food': ['food', 'cooking', 'meal'],
      'transport': ['vehicle', 'transportation', 'travel'],
      'nature': ['nature', 'outdoor', 'natural']
    }
    
    return categoryMap[category] || ['object']
  }

  private getStyleKeywords(category: string): string[] {
    // 大多数儿童学习内容适合清晰的照片
    if (['fruits', 'animals', 'food', 'nature', 'transport'].includes(category)) {
      return ['realistic', 'clear', 'professional']
    }
    
    return ['simple', 'educational', 'clean']
  }

  // 评估图片与单词的匹配度
  evaluateImageMatch(imageDescription: string, word: string, category: string): number {
    const description = imageDescription.toLowerCase()
    const targetWord = word.toLowerCase()
    
    let score = 0
    
    // 直接匹配
    if (description.includes(targetWord)) {
      score += 40
    }
    
    // 分类相关性
    const categoryKeywords = this.getCategoryKeywords(category)
    for (const keyword of categoryKeywords) {
      if (description.includes(keyword.toLowerCase())) {
        score += 15
      }
    }
    
    // 教育相关性
    const educationalKeywords = ['learning', 'educational', 'kids', 'children', 'simple', 'clear']
    for (const keyword of educationalKeywords) {
      if (description.includes(keyword)) {
        score += 10
      }
    }
    
    // 负面关键词减分
    const negativeKeywords = ['complex', 'adult', 'scary', 'violent', 'inappropriate']
    for (const keyword of negativeKeywords) {
      if (description.includes(keyword)) {
        score -= 20
      }
    }
    
    return Math.max(0, Math.min(100, score))
  }
}

// 主要的智能图片搜索服务
export class SmartImageSearchService {
  private providers: ImageSearchProvider[] = []
  private keywordOptimizer = new AIKeywordOptimizer()
  // [已自动修复] 2024-07-06 23:28:00 删除未使用的 PixabayProvider, chinese, baseKeywords, cache

  constructor() {
    // 初始化免费的图片搜索提供商
    this.providers.push(new UnsplashProvider())
    // 如果有Pixabay API key，添加Pixabay
    // this.providers.push(new PixabayProvider())
  }

  async findBestImage(word: string, category: string): Promise<string | null> {
    try {
      // 生成优化的搜索关键词
      const keywords = this.keywordOptimizer.optimizeSearchKeywords(word, category)
      
      console.log(`🔍 为 "${word}" 生成搜索关键词:`, keywords)
      
      // 使用第一个最佳关键词
      const bestKeyword = keywords[0]
      
      for (const provider of this.providers) {
        if (provider.isAvailable()) {
          try {
            const results = await provider.searchImages(bestKeyword, {
              category,
              style: 'photo',
              safeSearch: true,
              limit: 1,
              minWidth: 400,
              minHeight: 300
            })
            
            if (results.length > 0) {
              console.log(`✅ 为 "${word}" 找到图片: ${results[0].description}`)
              return results[0].url
            }
            
          } catch (error) {
            console.error(`${provider.name} 搜索失败:`, error)
          }
        }
      }
      
      return null
      
    } catch (error) {
      console.error(`搜索图片失败 "${word}":`, error)
      return null
    }
  }

  async batchUpdateImages(words: { id: number, word: string, category: string, chinese?: string }[]): Promise<{
    updated: number
    failed: number
    results: Array<{ id: number, word: string, imageUrl: string | null, error?: string }>
  }> {
    const results = []
    let updated = 0
    let failed = 0
    
    for (const wordData of words) {
      try {
        const bestImage = await this.findBestImage(wordData.word, wordData.category)
        
        if (bestImage) {
          results.push({
            id: wordData.id,
            word: wordData.word,
            imageUrl: bestImage
          })
          updated++
        } else {
          results.push({
            id: wordData.id,
            word: wordData.word,
            imageUrl: null,
            error: '未找到合适的图片'
          })
          failed++
        }
        
        // 避免API限制，添加延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        results.push({
          id: wordData.id,
          word: wordData.word,
          imageUrl: null,
          error: error instanceof Error ? error.message : '未知错误'
        })
        failed++
      }
    }
    
    return { updated, failed, results }
  }

  // 获取改进的分类图片URL
  getImprovedCategoryImage(categoryName: string): string {
    const improvedImageMap: { [key: string]: string } = {
      'fruits': 'https://source.unsplash.com/400x300/?fruits,fresh,colorful',
      'animals': 'https://source.unsplash.com/400x300/?animals,cute,wildlife',
      'colors': 'https://source.unsplash.com/400x300/?colors,rainbow,bright',
      'numbers': 'https://source.unsplash.com/400x300/?numbers,counting,math',
      'family': 'https://source.unsplash.com/400x300/?family,people,happy',
      'body': 'https://source.unsplash.com/400x300/?human,body,health',
      'clothes': 'https://source.unsplash.com/400x300/?clothes,fashion,kids',
      'food': 'https://source.unsplash.com/400x300/?food,healthy,cooking',
      'transport': 'https://source.unsplash.com/400x300/?transport,vehicles,travel',
      'nature': 'https://source.unsplash.com/400x300/?nature,landscape,beautiful',
      'daily_phrases': 'https://source.unsplash.com/400x300/?conversation,people,daily',
      'greeting_phrases': 'https://source.unsplash.com/400x300/?greeting,hello,people',
      'action_phrases': 'https://source.unsplash.com/400x300/?action,movement,people',
      'simple_sentences': 'https://source.unsplash.com/400x300/?learning,education,simple',
      'conversation_sentences': 'https://source.unsplash.com/400x300/?conversation,talking,people'
    }
    
    return improvedImageMap[categoryName] || 'https://source.unsplash.com/400x300/?learning,education'
  }
}

export const smartImageSearchService = new SmartImageSearchService() 