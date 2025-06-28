# 🚀 Netlify 环境变量设置指南

## ⚠️ 重要：Netlify 不支持直接上传 .env 文件！

### 🔧 正确的设置方法：

1. **部署应用到 Netlify**
   - 连接您的 GitHub 仓库
   - Netlify 会自动读取 `netlify.toml` 配置文件

2. **设置环境变量**（在 Netlify 控制台中）
   - 进入项目设置
   - 点击 "Environment variables"
   - 添加以下两个变量：

### 📋 需要设置的环境变量：

```
变量名: VITE_SUPABASE_URL
变量值: https://ljtwkkzshbrvqrxgnuin.supabase.co
```

```
变量名: VITE_SUPABASE_ANON_KEY
变量值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ
```

### ✅ 简化部署流程：

1. **修复 Supabase 数据库**（使用 `修复数据库表结构.sql`）
2. **推送代码到 GitHub**
3. **连接 Netlify 到 GitHub**
4. **在 Netlify 中设置环境变量**
5. **触发重新部署**

### 🎯 自动化配置：

我已经创建了 `netlify.toml` 文件，它会自动：
- 设置构建命令为 `npm run build`
- 设置发布目录为 `dist`
- 配置单页应用路由
- 设置安全头部

您只需要手动设置环境变量即可！ 