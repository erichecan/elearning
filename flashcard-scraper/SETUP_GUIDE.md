# 🚀 数据库爬虫设置指南

## 📝 设置步骤

### 步骤 1: 获取 Supabase 配置

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 登录您的账户
3. 选择您的项目（elearning项目）
4. 点击左侧菜单的 "Settings" → "API"
5. 复制以下信息：
   - **Project URL** (类似: `https://xxxxx.supabase.co`)
   - **anon public** key 或 **service_role** key

### 步骤 2: 创建环境变量文件

在 `flashcard-scraper` 目录下创建 `.env` 文件：

```bash
# 复制示例文件
cp env.example .env
```

然后编辑 `.env` 文件：

```bash
# Supabase 配置
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# 可选：如果需要更高权限，使用service_role key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 步骤 3: 测试连接

```bash
npm run test-db
```

如果看到以下输出，说明配置成功：
```
✅ 分类表连接成功
📋 前5个分类:
  - fruits: 水果蔬菜 (ID: 1)
  - animals: 动物世界 (ID: 2)
  ...
✅ 单词表连接成功
✅ 插入权限正常
🎉 数据库连接测试完成！所有功能正常
```

### 步骤 4: 运行爬虫

```bash
npm run scrape-to-db
```

## 🔧 常见问题解决

### Q: 找不到 Supabase 配置？
**A**: 
1. 确保您已经有 Supabase 项目
2. 在项目中创建了必要的表结构
3. URL 格式应该是 `https://your-project-id.supabase.co`

### Q: 权限错误怎么办？
**A**: 
1. 尝试使用 `service_role` key 而不是 `anon` key
2. 检查 RLS (Row Level Security) 策略
3. 确保表的读写权限正确设置

### Q: 网络连接失败？
**A**: 
1. 检查网络连接
2. 确认 Supabase 项目状态正常
3. 验证 URL 拼写正确

### Q: 爬虫中途停止？
**A**: 
1. 检查网络稳定性
2. 重新运行爬虫（有去重功能）
3. 查看错误日志了解具体原因

## 📊 预期时间

- **环境配置**: 5-10分钟
- **数据库测试**: 1-2分钟  
- **完整爬取**: 5-15分钟
- **预计获取**: 300-400个单词

## 🎯 完成后验证

1. **查看 Supabase Dashboard**:
   - 进入 "Database" → "words" 表
   - 应该看到新增的英文单词记录
   - 每条记录都有 `image_url` 字段

2. **查看报告文件**:
   - `database-scraping-report.json` 包含详细统计

3. **测试图片 URL**:
   - 随机选择几个 `image_url` 在浏览器中打开
   - 应该能正常显示闪卡图片

## 🔄 重复运行

爬虫支持安全的重复运行：
- ✅ 自动跳过已存在的单词
- ✅ 只插入新发现的单词
- ✅ 不会产生重复数据

## 📈 数据使用

爬取完成后，您的应用就可以使用这些数据了：
- 单词和图片URL存储在 `words` 表中
- 通过 `category_id` 关联分类
- 图片URL可以直接在应用中使用
- 中文翻译可以后续补充

## 🆘 获取帮助

如果遇到问题：
1. 查看控制台错误信息
2. 检查 `database-scraping-report.json` 文件
3. 确认网络和数据库连接状态 