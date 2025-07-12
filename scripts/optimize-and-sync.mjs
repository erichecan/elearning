#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 加载环境变量
dotenv.config()

class ImageOptimizationService {
  constructor() {
    try {
      this.localDb = new Database(path.join(__dirname, '../local-elearning.db'))
    } catch (error) {
      console.log('⚠️  本地数据库未找到，跳过本地优化')
      this.localDb = null
    }
    
    this.supabase = null
    this.stats = {
      localOptimized: 0,
      supabaseSynced: 0,
      failed: 0,
      errors: []
    }
    
    this.initSupabase()
  }

  initSupabase() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase配置未找到，请设置环境变量:')
      console.log('   VITE_SUPABASE_URL')
      console.log('   VITE_SUPABASE_ANON_KEY')
      return
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase连接已初始化')
  }

  // 生成优化的图片URL
  generateOptimizedImageUrl(word, category) {
    const categoryKeywords = {
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

    const keywords = categoryKeywords[category] || ['object']
    const searchTerms = `${word},${keywords[0]},realistic,clear`
    
    return `https://source.unsplash.com/400x300/?${searchTerms}`
  }

  // 第一步：优化本地数据库图片
  async optimizeLocalImages(options = {}) {
    const { limit = 50, category = null } = options
    
    if (!this.localDb) {
      console.log('⏭️  跳过本地优化 - 本地数据库不可用')
      return []
    }
    
    console.log('\n📸 第一步: 优化本地数据库图片...')
    
    let query = `
      SELECT w.id, w.word, w.chinese, w.image_url, c.name as category_name 
      FROM words w 
      JOIN categories c ON w.category_id = c.id 
      WHERE (w.image_url IS NULL OR w.image_url = "")
    `
    
    const params = []
    if (category) {
      query += ' AND c.name = ?'
      params.push(category)
    }
    
    query += ' ORDER BY w.id LIMIT ?'
    params.push(limit)

    const words = this.localDb.prepare(query).all(...params)
    console.log(`   找到 ${words.length} 个需要优化的单词`)
    
    const optimizedWords = []
    
    for (const word of words) {
      try {
        const optimizedUrl = this.generateOptimizedImageUrl(word.word, word.category_name)
        
        // 更新本地数据库
        this.localDb.prepare('UPDATE words SET image_url = ? WHERE id = ?').run(optimizedUrl, word.id)
        
        optimizedWords.push({
          word: word.word,
          chinese: word.chinese,
          category: word.category_name,
          image_url: optimizedUrl
        })
        
        console.log(`   ✅ ${word.word}: ${optimizedUrl}`)
        this.stats.localOptimized++
        
      } catch (error) {
        console.error(`   ❌ ${word.word}: ${error.message}`)
        this.stats.failed++
        this.stats.errors.push({ word: word.word, error: error.message })
      }
    }
    
    console.log(`   完成: ${this.stats.localOptimized} 张图片`)
    return optimizedWords
  }

  // 第二步：同步到Supabase
  async syncToSupabase(wordsToSync = [], options = {}) {
    const { additionalLimit = 0 } = options
    
    if (!this.supabase) {
      console.log('⏭️  跳过Supabase同步 - Supabase未配置')
      return
    }
    
    console.log('\n☁️  第二步: 同步到Supabase...')
    
    // 如果没有提供要同步的单词，从本地数据库获取
    if (wordsToSync.length === 0 && this.localDb && additionalLimit > 0) {
      const localWords = this.localDb.prepare(`
        SELECT w.word, w.chinese, w.image_url, c.name as category
        FROM words w
        JOIN categories c ON w.category_id = c.id
        WHERE w.image_url IS NOT NULL AND w.image_url != ""
        LIMIT ?
      `).all(additionalLimit)
      
      wordsToSync = localWords.map(w => ({
        word: w.word,
        chinese: w.chinese,
        image_url: w.image_url,
        category: w.category
      }))
    }
    
    if (wordsToSync.length === 0) {
      console.log('   没有需要同步的单词')
      return
    }
    
    console.log(`   准备同步 ${wordsToSync.length} 个单词到Supabase`)
    
    // 测试连接
    try {
      const { data, error } = await this.supabase
        .from('words')
        .select('count(*)')
        .limit(1)
      
      if (error) throw error
      console.log('   ✅ Supabase连接测试成功')
    } catch (error) {
      console.error('   ❌ Supabase连接失败:', error.message)
      return
    }
    
    // 批量同步
    for (const word of wordsToSync) {
      try {
        const { data, error } = await this.supabase
          .from('words')
          .update({ image_url: word.image_url })
          .eq('word', word.word)
          .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
          console.log(`   ✅ ${word.word}`)
          this.stats.supabaseSynced++
        } else {
          console.log(`   ⚠️  未找到匹配记录: ${word.word}`)
        }
        
      } catch (error) {
        console.error(`   ❌ ${word.word}: ${error.message}`)
        this.stats.failed++
        this.stats.errors.push({ word: word.word, error: error.message })
      }
      
      // 避免API限制
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`   完成: ${this.stats.supabaseSynced} 个单词同步到Supabase`)
  }

  // 综合流程：优化并同步
  async optimizeAndSync(options = {}) {
    const { limit = 50, category = null, syncOnly = false, localOnly = false } = options
    
    console.log('🚀 开始图片优化和同步流程...')
    
    let optimizedWords = []
    
    // 第一步：本地优化（如果不是仅同步模式）
    if (!syncOnly) {
      optimizedWords = await this.optimizeLocalImages({ limit, category })
    }
    
    // 第二步：同步到Supabase（如果不是仅本地模式）
    if (!localOnly) {
      const additionalLimit = syncOnly ? limit : 0
      await this.syncToSupabase(optimizedWords, { additionalLimit })
    }
    
    // 显示最终统计
    console.log('\n🎉 流程完成!')
    console.log('📊 最终统计:')
    console.log(`   📸 本地优化: ${this.stats.localOptimized} 张`)
    console.log(`   ☁️  Supabase同步: ${this.stats.supabaseSynced} 个`)
    console.log(`   ❌ 失败: ${this.stats.failed} 个`)
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ 错误详情:')
      this.stats.errors.forEach(error => {
        console.log(`   ${error.word}: ${error.error}`)
      })
    }
    
    return this.stats
  }

  // 只同步现有图片到Supabase
  async syncExistingImages(options = {}) {
    const { limit = 100 } = options
    return await this.optimizeAndSync({ 
      limit, 
      syncOnly: true,
      ...options 
    })
  }

  // 生成报告
  async generateReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      statistics: this.stats,
      recommendations: [
        this.stats.localOptimized > 0 ? '✅ 本地图片优化完成' : '⚠️ 没有本地图片需要优化',
        this.stats.supabaseSynced > 0 ? '✅ Supabase同步完成' : '⚠️ 没有同步到Supabase',
        this.stats.failed > 0 ? `❌ ${this.stats.failed} 个项目失败，需要检查` : '✅ 所有操作成功',
        '💡 建议定期运行此脚本保持数据同步'
      ]
    }
    
    const reportPath = path.join(__dirname, '../reports/image-optimization-sync-report.json')
    await fs.mkdir(path.dirname(reportPath), { recursive: true })
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2))
    
    console.log(`\n📄 详细报告已保存: ${reportPath}`)
    return reportData
  }

  close() {
    if (this.localDb) {
      this.localDb.close()
    }
  }
}

// 命令行界面
async function main() {
  console.log('🔄 图片优化和Supabase同步工具')
  
  const service = new ImageOptimizationService()
  
  try {
    const args = process.argv.slice(2)
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
使用方法:
  npm run optimize-and-sync [选项]

选项:
  --limit <number>        处理的最大数量 (默认: 50)
  --category <name>       只处理指定分类
  --sync-only            只同步现有图片到Supabase，不优化新图片
  --local-only           只优化本地数据库，不同步Supabase
  --help, -h             显示帮助信息

示例:
  npm run optimize-and-sync                          # 优化50张图片并同步
  npm run optimize-and-sync -- --limit 100          # 优化100张图片并同步
  npm run optimize-and-sync -- --sync-only          # 只同步现有图片
  npm run optimize-and-sync -- --category fruits    # 只处理水果分类
  npm run optimize-and-sync -- --local-only         # 只优化本地数据库
      `)
      process.exit(0)
    }
    
    const limitIndex = args.indexOf('--limit')
    const limit = limitIndex >= 0 && args[limitIndex + 1] 
      ? parseInt(args[limitIndex + 1]) 
      : 50
    
    const categoryIndex = args.indexOf('--category')
    const category = categoryIndex >= 0 && args[categoryIndex + 1] 
      ? args[categoryIndex + 1]
      : null
    
    const syncOnly = args.includes('--sync-only')
    const localOnly = args.includes('--local-only')
    
    if (syncOnly) {
      await service.syncExistingImages({ limit, category })
    } else {
      await service.optimizeAndSync({ 
        limit, 
        category, 
        localOnly 
      })
    }
    
    // 生成报告
    await service.generateReport()
    
  } catch (error) {
    console.error('❌ 执行失败:', error.message)
    process.exit(1)
  } finally {
    service.close()
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
} 