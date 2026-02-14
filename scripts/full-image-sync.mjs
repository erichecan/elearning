#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

class FullImageSyncService {
  constructor() {
    try {
      this.localDb = new Database(path.join(__dirname, '../local-elearning.db'))
    } catch (error) {
      this.localDb = null
    }
    
    this.supabase = null
    this.stats = { localOptimized: 0, supabaseSynced: 0, failed: 0, errors: [] }
    this.initSupabase()
  }

  initSupabase() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey)
      console.log('✅ Supabase连接已初始化')
    } else {
      console.log('⚠️  Supabase配置未找到')
    }
  }

  generateOptimizedImageUrl(word, category) {
    const categoryKeywords = {
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

  async optimizeLocalImages(limit = 50) {
    if (!this.localDb) return []
    
    console.log('\n📸 优化本地数据库图片...')
    
    const words = this.localDb.prepare(`
      SELECT w.id, w.word, w.chinese, c.name as category_name 
      FROM words w 
      JOIN categories c ON w.category_id = c.id 
      WHERE (w.image_url IS NULL OR w.image_url = "")
      ORDER BY w.id LIMIT ?
    `).all(limit)
    
    console.log(`   找到 ${words.length} 个需要优化的单词`)
    
    const optimizedWords = []
    
    for (const word of words) {
      try {
        const optimizedUrl = this.generateOptimizedImageUrl(word.word, word.category_name)
        
        this.localDb.prepare('UPDATE words SET image_url = ? WHERE id = ?').run(optimizedUrl, word.id)
        
        optimizedWords.push({
          word: word.word,
          chinese: word.chinese,
          image_url: optimizedUrl
        })
        
        console.log(`   ✅ ${word.word}`)
        this.stats.localOptimized++
        
      } catch (error) {
        console.error(`   ❌ ${word.word}: ${error.message}`)
        this.stats.failed++
      }
    }
    
    return optimizedWords
  }

  async syncToSupabase(wordsToSync) {
    if (!this.supabase || wordsToSync.length === 0) return
    
    console.log('\n☁️  同步到Supabase...')
    console.log(`   准备同步 ${wordsToSync.length} 个单词`)
    
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
        }
        
      } catch (error) {
        console.error(`   ❌ ${word.word}: ${error.message}`)
        this.stats.failed++
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  async run(limit = 50) {
    console.log('🚀 开始图片优化和同步...')
    
    const optimizedWords = await this.optimizeLocalImages(limit)
    await this.syncToSupabase(optimizedWords)
    
    console.log('\n🎉 完成!')
    console.log(`📊 统计: 本地优化 ${this.stats.localOptimized} 张, Supabase同步 ${this.stats.supabaseSynced} 个`)
    
    return this.stats
  }

  close() {
    if (this.localDb) this.localDb.close()
  }
}

async function main() {
  const service = new FullImageSyncService()
  
  try {
    const args = process.argv.slice(2)
    const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 50
    
    await service.run(limit)
    
  } catch (error) {
    console.error('❌ 执行失败:', error.message)
  } finally {
    service.close()
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
} 