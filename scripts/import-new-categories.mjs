import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://ljtwkkzshbrvqrxgnuin.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ'

const supabase = createClient(supabaseUrl, supabaseKey)

// 新的分类数据
const newCategories = [
  { name: 'daily_phrases', display_name: '日常短语', description: '生活中常用的英语短语', icon: '💬', color: '#FF9FF3' },
  { name: 'greeting_phrases', display_name: '问候短语', description: '礼貌问候和寒暄用语', icon: '👋', color: '#54A0FF' },
  { name: 'action_phrases', display_name: '动作短语', description: '描述动作和行为的短语', icon: '🏃‍♀️', color: '#5F27CD' },
  { name: 'simple_sentences', display_name: '简单句子', description: '基础英语句子结构', icon: '📝', color: '#00D2D3' },
  { name: 'conversation_sentences', display_name: '对话句子', description: '日常对话常用句子', icon: '🗣️', color: '#FF6B6B' }
]

// 新分类的单词数据
const newWords = [
  // 日常短语 (category_id: 11)
  { word: 'Good morning', chinese: '早上好', phonetic: '/ɡʊd ˈmɔːrnɪŋ/', category_id: 11, difficulty_level: 1 },
  { word: 'Good night', chinese: '晚安', phonetic: '/ɡʊd naɪt/', category_id: 11, difficulty_level: 1 },
  { word: 'Thank you', chinese: '谢谢', phonetic: '/θæŋk juː/', category_id: 11, difficulty_level: 1 },
  { word: 'You are welcome', chinese: '不客气', phonetic: '/juː ɑːr ˈwelkəm/', category_id: 11, difficulty_level: 2 },
  { word: 'Excuse me', chinese: '对不起', phonetic: '/ɪkˈskjuːz miː/', category_id: 11, difficulty_level: 2 },
  { word: 'I am sorry', chinese: '我很抱歉', phonetic: '/aɪ æm ˈsɑːri/', category_id: 11, difficulty_level: 2 },
  { word: 'How are you', chinese: '你好吗', phonetic: '/haʊ ɑːr juː/', category_id: 11, difficulty_level: 2 },
  { word: 'I am fine', chinese: '我很好', phonetic: '/aɪ æm faɪn/', category_id: 11, difficulty_level: 2 },
  { word: 'See you later', chinese: '再见', phonetic: '/siː juː ˈleɪtər/', category_id: 11, difficulty_level: 3 },
  { word: 'Have a nice day', chinese: '祝你愉快', phonetic: '/hæv ə naɪs deɪ/', category_id: 11, difficulty_level: 3 },

  // 问候短语 (category_id: 12)
  { word: 'Hello', chinese: '你好', phonetic: '/həˈloʊ/', category_id: 12, difficulty_level: 1 },
  { word: 'Hi', chinese: '嗨', phonetic: '/haɪ/', category_id: 12, difficulty_level: 1 },
  { word: 'Goodbye', chinese: '再见', phonetic: '/ɡʊdˈbaɪ/', category_id: 12, difficulty_level: 1 },
  { word: 'Nice to meet you', chinese: '很高兴认识你', phonetic: '/naɪs tuː miːt juː/', category_id: 12, difficulty_level: 2 },
  { word: 'My name is', chinese: '我的名字是', phonetic: '/maɪ neɪm ɪz/', category_id: 12, difficulty_level: 2 },
  { word: 'What is your name', chinese: '你叫什么名字', phonetic: '/wɑːt ɪz jɔːr neɪm/', category_id: 12, difficulty_level: 2 },
  { word: 'How old are you', chinese: '你多大了', phonetic: '/haʊ oʊld ɑːr juː/', category_id: 12, difficulty_level: 2 },
  { word: 'I am years old', chinese: '我岁了', phonetic: '/aɪ æm jɪrz oʊld/', category_id: 12, difficulty_level: 2 },
  { word: 'Where are you from', chinese: '你来自哪里', phonetic: '/wer ɑːr juː frʌm/', category_id: 12, difficulty_level: 3 },
  { word: 'I am from', chinese: '我来自', phonetic: '/aɪ æm frʌm/', category_id: 12, difficulty_level: 3 },

  // 动作短语 (category_id: 13)
  { word: 'Stand up', chinese: '站起来', phonetic: '/stænd ʌp/', category_id: 13, difficulty_level: 1 },
  { word: 'Sit down', chinese: '坐下', phonetic: '/sɪt daʊn/', category_id: 13, difficulty_level: 1 },
  { word: 'Come here', chinese: '过来', phonetic: '/kʌm hɪr/', category_id: 13, difficulty_level: 1 },
  { word: 'Go away', chinese: '走开', phonetic: '/ɡoʊ əˈweɪ/', category_id: 13, difficulty_level: 2 },
  { word: 'Look at me', chinese: '看着我', phonetic: '/lʊk æt miː/', category_id: 13, difficulty_level: 2 },
  { word: 'Listen carefully', chinese: '仔细听', phonetic: '/ˈlɪsən ˈkerfəli/', category_id: 13, difficulty_level: 2 },
  { word: 'Open the door', chinese: '开门', phonetic: '/ˈoʊpən ðə dɔːr/', category_id: 13, difficulty_level: 2 },
  { word: 'Close the window', chinese: '关窗', phonetic: '/kloʊz ðə ˈwɪndoʊ/', category_id: 13, difficulty_level: 2 },
  { word: 'Turn on the light', chinese: '开灯', phonetic: '/tɜːrn ɑːn ðə laɪt/', category_id: 13, difficulty_level: 3 },
  { word: 'Turn off the TV', chinese: '关电视', phonetic: '/tɜːrn ɔːf ðə ˌtiː ˈviː/', category_id: 13, difficulty_level: 3 },

  // 简单句子 (category_id: 14)
  { word: 'I am a student', chinese: '我是一个学生', phonetic: '/aɪ æm ə ˈstjuːdənt/', category_id: 14, difficulty_level: 1 },
  { word: 'This is my book', chinese: '这是我的书', phonetic: '/ðɪs ɪz maɪ bʊk/', category_id: 14, difficulty_level: 1 },
  { word: 'I like apples', chinese: '我喜欢苹果', phonetic: '/aɪ laɪk ˈæpəlz/', category_id: 14, difficulty_level: 1 },
  { word: 'She is my friend', chinese: '她是我的朋友', phonetic: '/ʃiː ɪz maɪ frend/', category_id: 14, difficulty_level: 2 },
  { word: 'We are happy', chinese: '我们很开心', phonetic: '/wiː ɑːr ˈhæpi/', category_id: 14, difficulty_level: 2 },
  { word: 'The cat is sleeping', chinese: '猫在睡觉', phonetic: '/ðə kæt ɪz ˈsliːpɪŋ/', category_id: 14, difficulty_level: 2 },
  { word: 'I can swim', chinese: '我会游泳', phonetic: '/aɪ kæn swɪm/', category_id: 14, difficulty_level: 2 },
  { word: 'The sun is bright', chinese: '太阳很亮', phonetic: '/ðə sʌn ɪz braɪt/', category_id: 14, difficulty_level: 2 },
  { word: 'I want to eat', chinese: '我想吃东西', phonetic: '/aɪ wɑːnt tuː iːt/', category_id: 14, difficulty_level: 3 },
  { word: 'The weather is nice', chinese: '天气很好', phonetic: '/ðə ˈweðər ɪz naɪs/', category_id: 14, difficulty_level: 3 },

  // 对话句子 (category_id: 15)
  { word: 'What is this', chinese: '这是什么', phonetic: '/wɑːt ɪz ðɪs/', category_id: 15, difficulty_level: 1 },
  { word: 'It is a cat', chinese: '这是一只猫', phonetic: '/ɪt ɪz ə kæt/', category_id: 15, difficulty_level: 1 },
  { word: 'Where is my bag', chinese: '我的包在哪里', phonetic: '/wer ɪz maɪ bæɡ/', category_id: 15, difficulty_level: 2 },
  { word: 'It is on the table', chinese: '它在桌子上', phonetic: '/ɪt ɪz ɑːn ðə ˈteɪbəl/', category_id: 15, difficulty_level: 2 },
  { word: 'What time is it', chinese: '几点了', phonetic: '/wɑːt taɪm ɪz ɪt/', category_id: 15, difficulty_level: 2 },
  { word: 'It is three o clock', chinese: '三点钟了', phonetic: '/ɪt ɪz θriː ə klɑːk/', category_id: 15, difficulty_level: 2 },
  { word: 'Do you like ice cream', chinese: '你喜欢冰淇淋吗', phonetic: '/duː juː laɪk aɪs kriːm/', category_id: 15, difficulty_level: 3 },
  { word: 'Yes I do', chinese: '是的我喜欢', phonetic: '/jes aɪ duː/', category_id: 15, difficulty_level: 3 },
  { word: 'Can you help me', chinese: '你能帮我吗', phonetic: '/kæn juː help miː/', category_id: 15, difficulty_level: 3 },
  { word: 'Of course I can', chinese: '当然可以', phonetic: '/əv kɔːrs aɪ kæn/', category_id: 15, difficulty_level: 3 }
]

async function importNewCategories() {
  console.log('🚀 开始导入新的分类数据...')
  
  try {
    // 导入分类
    for (const category of newCategories) {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
      
      if (error) {
        console.error(`❌ 导入分类 ${category.name} 失败:`, error.message)
      } else {
        console.log(`✅ 分类 ${category.name} 导入成功`)
      }
    }

    // 导入单词
    console.log('📚 开始导入单词数据...')
    for (const word of newWords) {
      const { data, error } = await supabase
        .from('words')
        .insert(word)
      
      if (error) {
        console.error(`❌ 导入单词 ${word.word} 失败:`, error.message)
      } else {
        console.log(`✅ 单词 ${word.word} 导入成功`)
      }
    }

    console.log('🎉 所有新数据导入完成!')
  } catch (error) {
    console.error('❌ 导入过程中出现错误:', error)
  }
}

// 运行导入
importNewCategories() 