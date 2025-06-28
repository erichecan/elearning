const fs = require('fs');
const path = require('path');

// 从环境变量获取配置
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log(`
🚀 Supabase 数据库手动部署脚本

📋 使用说明：
1. 确保你的 .env 文件中有正确的 Supabase 配置
2. 在 Supabase Dashboard 中手动执行 SQL 文件
3. 或者使用 Supabase CLI 本地同步

🔧 推荐的手动部署步骤：

方法一：Supabase Dashboard
1. 访问：https://app.supabase.com/project/ljtwkkzshbrvqrxgnuin/sql
2. 打开 SQL Editor
3. 复制粘贴以下文件内容并执行：
`);

// 列出所有迁移文件
const migrationsDir = path.join(__dirname, '../supabase/migrations');
const files = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql') && !file.includes('test_github_actions'))
  .sort();

files.forEach((file, index) => {
  console.log(`   ${index + 1}. ${file}`);
});

console.log(`

方法二：使用 Supabase CLI (推荐)
如果你已安装 Supabase CLI：

1. 链接项目：
   supabase link --project-ref ljtwkkzshbrvqrxgnuin

2. 推送迁移：
   supabase db push

方法三：直接复制SQL内容
以下是各个迁移文件的内容：
`);

// 输出每个文件的内容
files.forEach((file, index) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📄 文件 ${index + 1}: ${file}`);
  console.log(`${'='.repeat(50)}`);
  
  const filePath = path.join(migrationsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(content);
});

console.log(`\n🎉 所有迁移文件内容已列出！
请将上述 SQL 内容复制到 Supabase Dashboard 的 SQL Editor 中执行。

💡 提示：建议按顺序执行，从文件 1 开始。
`);

// 检查环境变量
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  console.log(`✅ 环境变量配置正确`);
  console.log(`   Supabase URL: ${SUPABASE_URL}`);
} else {
  console.log(`⚠️  请确保 .env 文件中有以下配置：
VITE_SUPABASE_URL=https://ljtwkkzshbrvqrxgnuin.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon密钥`);
} 