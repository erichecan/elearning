console.log(`
🚀 Supabase 自动化部署配置指南

请按照以下步骤配置 GitHub Secrets：

1. 获取 Supabase Access Token：
   - 访问：https://app.supabase.com/account/tokens
   - 点击 "Generate new token"
   - 输入名称（如：github-actions）
   - 复制生成的 token

2. 获取 Supabase Project ID：
   - 访问：https://app.supabase.com/project/ljtwkkzshbrvqrxgnuin/settings/general
   - 在 "Reference ID" 字段找到：ljtwkkzshbrvqrxgnuin

3. 在 GitHub 仓库设置 Secrets：
   - 访问你的 GitHub 仓库
   - 点击 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - 添加以下两个 secret：
     * Name: SUPABASE_ACCESS_TOKEN
     * Value: [粘贴你的 Access Token]
     * Name: SUPABASE_PROJECT_ID  
     * Value: ljtwkkzshbrvqrxgnuin

4. 推送代码到 GitHub：
   git add .
   git commit -m "Add Supabase automation"
   git push

完成以上步骤后，每次修改 supabase/migrations/ 下的文件并推送到 GitHub，
GitHub Actions 就会自动同步到你的 Supabase 数据库！

你的项目信息：
- Project ID: ljtwkkzshbrvqrxgnuin
- Access Token: 需要从 Supabase 控制台获取
`); 