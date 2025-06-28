console.log(`
🔐 GitHub Actions Supabase 环境变量配置指南

请按照以下步骤获取并设置 GitHub Secrets：

📋 需要设置的 GitHub Secrets：

1. SUPABASE_ACCESS_TOKEN
   📍 获取方式：
   - 访问：https://app.supabase.com/account/tokens
   - 点击 "Generate new token"
   - 输入名称（如：github-actions）
   - 复制生成的 token

2. SUPABASE_PROJECT_ID
   📍 值：ljtwkkzshbrvqrxgnuin

3. SUPABASE_DB_PASSWORD
   📍 获取方式：
   - 访问：https://app.supabase.com/project/ljtwkkzshbrvqrxgnuin/settings/database
   - 在 "Database password" 部分找到你的数据库密码
   - 如果忘记了，可以点击 "Reset database password" 重置

4. SUPABASE_DB_HOST
   📍 获取方式：
   - 访问：https://app.supabase.com/project/ljtwkkzshbrvqrxgnuin/settings/database
   - 在连接字符串中找到 @ 符号后面的主机名
   - 格式：db.ljtwkkzshbrvqrxgnuin.supabase.co
   - 完整连接字符串示例：postgresql://postgres:[YOUR-PASSWORD]@db.ljtwkkzshbrvqrxgnuin.supabase.co:5432/postgres

🔧 在 GitHub 仓库中设置 Secrets：

1. 访问你的 GitHub 仓库：https://github.com/erichecan/elearning
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 逐一添加上述4个 secret

✅ 设置完成后，推送任何更改到 supabase/migrations/ 目录，
GitHub Actions 就会自动同步到你的 Supabase 数据库！

⚠️ 注意事项：
- 密码和 token 要保密，不要在代码中暴露
- Host 地址不包含 "postgresql://" 前缀，只要域名部分
- Project ID 就是你项目 URL 中的那个 ID

💡 需要帮助？
如果遇到问题，可以在 Supabase Dashboard 的 Settings → Database 页面
找到完整的连接字符串示例。
`); 