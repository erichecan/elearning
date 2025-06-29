import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://ljtwkkzshbrvqrxgnuin.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCategories() {
  console.log('🔍 检查当前线上数据库的分类...')
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('❌ 查询分类失败:', error)
      return
    }

    console.log(`📊 数据库中共有 ${data.length} 个分类:`)
    console.log('=' .repeat(60))
    
    data.forEach((category, index) => {
      console.log(`${index + 1}. ID: ${category.id}, 名称: ${category.name}, 显示名: ${category.display_name}`)
    })
    
    console.log('=' .repeat(60))
    
    // 检查是否缺少预期的分类
    const expectedCategories = [
      'fruits', 'animals', 'colors', 'numbers', 'family',
      'body', 'clothes', 'food', 'transport', 'nature',
      'daily_phrases', 'greeting_phrases', 'action_phrases', 
      'simple_sentences', 'conversation_sentences'
    ]
    
    const existingCategories = data.map(cat => cat.name)
    const missingCategories = expectedCategories.filter(cat => !existingCategories.includes(cat))
    
    if (missingCategories.length > 0) {
      console.log(`❌ 缺少以下分类: ${missingCategories.join(', ')}`)
    } else {
      console.log('✅ 所有预期分类都存在')
    }
    
  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error)
  }
}

// 运行检查
checkCategories() 