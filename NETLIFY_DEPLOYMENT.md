# Netlify 部署指南

## 环境变量配置

当您将应用部署到 Netlify 时，需要在 Netlify 的环境变量中设置以下变量：

### 在 Netlify Dashboard 中设置：

1. 进入您的 Netlify 项目设置
2. 点击 "Environment variables" 或"环境变量"
3. 添加以下环境变量：

```
VITE_SUPABASE_URL=https://ljtwkkzshbrvqrxgnuin.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ
```

### 重要说明：

- ✅ **VITE_SUPABASE_ANON_KEY** 是安全的，可以公开使用（已启用 RLS）
- ❌ **不要使用 SERVICE_ROLE_KEY** 在前端应用中
- 🔐 **ANON_KEY** 配合 Row Level Security 保证数据安全

## 部署步骤：

1. 将代码推送到 GitHub
2. 连接 Netlify 到您的 GitHub 仓库
3. 设置环境变量（如上所示）
4. 部署！

## 构建设置：

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 或更高

## 数据库设置：

确保您已经在 Supabase 中：
1. 运行了 `database/supabase-schema.sql` 来创建表结构
2. 运行了 `database/supabase-sample-data.sql` 来导入示例数据 