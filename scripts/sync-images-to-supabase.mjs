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

class ImageSyncService {
  constructor() {
    this.localDb = new Database(path.join(__dirname, '../local-elearning.db'))
    this.supabase = null
    this.syncResults = {
      updated: 0,
      failed: 0,
      errors: []
    }
    
    this.initSupabase()
  }

  initSupabase() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase配置未找到')
      return
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase连接已初始化')
  }

  async syncToSupabase(options = {}) {
    const { limit = 50 } = options
    
    if (!this.supabase) {
      throw new Error('Supabase未配置')
    }
    
    // 获取本地有图片的单词
    const words = this.localDb.prepare(`
      SELECT w.word, w.chinese, w.image_url, c.name as category
      FROM words w
      JOIN categories c ON w.category_id = c.id
      WHERE w.image_url IS NOT NULL AND w.image_url != ""
      LIMIT ?
    `).all(limit)
    
    console.log(`🎯 准备同步 ${words.length} 个单词到Supabase`)
    
    for (const word of words) {
      try {
        const { data, error } = await this.supabase
          .from('words')
          .update({ image_url: word.image_url })
          .eq('word', word.word)
          .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
          console.log(`✅ ${word.word}: ${word.image_url}`)
          this.syncResults.updated++
        } else {
          console.log(`⚠️  未找到: ${word.word}`)
        }
        
      } catch (error) {
        console.error(`❌ ${word.word}: ${error.message}`)
        this.syncResults.failed++
        this.syncResults.errors.push({ word: word.word, error: error.message })
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`\n📊 同步完成: 成功 ${this.syncResults.updated}, 失败 ${this.syncResults.failed}`)
    return this.syncResults
  }

  close() {
    this.localDb.close()
  }
}

// 主函数
async function main() {
  console.log('🔄 Supabase图片同步工具')
  
  const syncService = new ImageSyncService()
  
  try {
    const args = process.argv.slice(2)
    const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 50
    
    await syncService.syncToSupabase({ limit })
    
  } catch (error) {
    console.error('❌ 执行失败:', error.message)
  } finally {
    syncService.close()
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
} 