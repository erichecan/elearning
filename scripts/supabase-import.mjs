import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('请设置环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 读取SQL文件
function readSqlFile(filename) {
  const filePath = path.join(process.cwd(), 'database', filename);
  return fs.readFileSync(filePath, 'utf8');
}

// 执行SQL语句
async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      console.error('SQL执行错误:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('执行SQL时出错:', err);
    return false;
  }
}

// 导入分类数据
async function importCategories() {
  console.log('开始导入分类数据...');
  
  const categories = [
    { name: 'fruits', display_name: '水果蔬菜', description: '各种水果和蔬菜的英语单词', icon: '🍎', color: '#FF6B6B' },
    { name: 'animals', display_name: '动物世界', description: '可爱的动物朋友们', icon: '🦁', color: '#4ECDC4' },
    { name: 'colors', display_name: '颜色形状', description: '基本颜色和形状认知', icon: '🌈', color: '#45B7D1' },
    { name: 'numbers', display_name: '数字时间', description: '数字和时间概念', icon: '🔢', color: '#96CEB4' },
    { name: 'family', display_name: '家庭成员', description: '家庭成员称谓', icon: '👨‍👩‍👧‍👦', color: '#FFEAA7' },
    { name: 'body', display_name: '身体部位', description: '认识身体各部位', icon: '🙋‍♀️', color: '#DDA0DD' },
    { name: 'clothes', display_name: '服装配饰', description: '日常服装用品', icon: '👕', color: '#98D8C8' },
    { name: 'food', display_name: '美食餐具', description: '食物和餐具名称', icon: '🍽️', color: '#F7DC6F' },
    { name: 'transport', display_name: '交通工具', description: '各种交通工具', icon: '🚗', color: '#AED6F1' },
    { name: 'nature', display_name: '自然天气', description: '自然现象和天气', icon: '🌤️', color: '#A9DFBF' },
    { name: 'daily_phrases', display_name: '日常短语', description: '生活中常用的英语短语', icon: '💬', color: '#FF9FF3' },
    { name: 'greeting_phrases', display_name: '问候短语', description: '礼貌问候和寒暄用语', icon: '👋', color: '#54A0FF' },
    { name: 'action_phrases', display_name: '动作短语', description: '描述动作和行为的短语', icon: '🏃‍♀️', color: '#5F27CD' },
    { name: 'simple_sentences', display_name: '简单句子', description: '基础英语句子结构', icon: '📝', color: '#00D2D3' },
    { name: 'conversation_sentences', display_name: '对话句子', description: '日常对话常用句子', icon: '🗣️', color: '#FF6B6B' }
  ];

  for (const category of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(category, { onConflict: 'name' });
    
    if (error) {
      console.error(`导入分类 ${category.name} 失败:`, error);
    } else {
      console.log(`✅ 分类 ${category.name} 导入成功`);
    }
  }
}

// 导入单词数据
async function importWords() {
  console.log('开始导入单词数据...');
  
  // 读取SQL文件中的单词数据
  const sqlContent = readSqlFile('supabase-sample-data.sql');
  
  // 提取INSERT语句
  const insertStatements = sqlContent.match(/INSERT INTO words[^;]+;/g);
  
  if (!insertStatements) {
    console.log('没有找到单词数据');
    return;
  }

  for (const statement of insertStatements) {
    try {
      const success = await executeSql(statement);
      if (success) {
        console.log('✅ 单词数据导入成功');
      } else {
        console.log('❌ 单词数据导入失败');
      }
    } catch (err) {
      console.error('执行单词导入时出错:', err);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 开始导入数据到Supabase...');
  
  try {
    await importCategories();
    await importWords();
    
    console.log('✅ 所有数据导入完成!');
  } catch (error) {
    console.error('❌ 导入过程中出现错误:', error);
  }
}

// 运行导入
main(); 