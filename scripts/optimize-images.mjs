#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 智能图片搜索类
class ImageOptimizer {
  constructor() {
    this.db = new Database(path.join(__dirname, '../local-elearning.db'))
    this.optimizedImages = new Map()
    this.failedOptimizations = []
  }

  // 生成智能搜索关键词
  generateSmartKeywords(word, category) {
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
    
    return searchTerms
  }

  // 生成优化的图片URL
  generateOptimizedImageUrl(word, category) {
    const searchTerms = this.generateSmartKeywords(word, category)
    return `https://source.unsplash.com/400x300/?${searchTerms}`
  }

  // 批量优化单词图片
  async optimizeWordImages(options = {}) {
    const { limit = null, category = null } = options
    
    let query = `
      SELECT w.*, c.name as category_name 
      FROM words w 
      JOIN categories c ON w.category_id = c.id 
      WHERE (w.image_url IS NULL OR w.image_url = "")
    `
    
    if (category) {
      query += ' AND c.name = ?'
    }
    
    query += ' ORDER BY w.id'
    
    if (limit) {
      query += ' LIMIT ?'
    }

    const params = []
    if (category) params.push(category)
    if (limit) params.push(limit)

    const words = this.db.prepare(query).all(...params)
    
    console.log(`🎯 找到 ${words.length} 个需要优化图片的单词`)
    
    let optimized = 0
    
    for (const word of words) {
      try {
        console.log(`🔍 优化: ${word.word} (${word.chinese}) - ${word.category_name}`)
        
        // 生成优化的图片URL
        const optimizedUrl = this.generateOptimizedImageUrl(word.word, word.category_name)
        
        // 更新数据库
        this.db.prepare('UPDATE words SET image_url = ? WHERE id = ?').run(optimizedUrl, word.id)
        
        this.optimizedImages.set(word.id, {
          word: word.word,
          chinese: word.chinese,
          category: word.category_name,
          newUrl: optimizedUrl
        })
        
        console.log(`✅ 已更新: ${optimizedUrl}`)
        optimized++
        
      } catch (error) {
        console.error(`❌ 优化失败: ${word.word} - ${error.message}`)
        this.failedOptimizations.push({
          word: word.word,
          error: error.message
        })
      }
    }
    
    console.log(`\n📊 优化完成: ${optimized} 张图片`)
    return { optimized, failed: this.failedOptimizations.length }
  }

  close() {
    this.db.close()
  }
}

// 主函数
async function main() {
  console.log('🚀 智能图片优化工具')
  
  const optimizer = new ImageOptimizer()
  
  try {
    const args = process.argv.slice(2)
    const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 50
    
    await optimizer.optimizeWordImages({ limit })
    
  } catch (error) {
    console.error('❌ 执行失败:', error)
  } finally {
    optimizer.close()
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
} 