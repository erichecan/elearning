# 数据库爬虫使用说明

## 🎯 功能概述

数据库爬虫将不再下载图片文件到本地，而是直接将图片URL和单词信息存储到Supabase数据库中，大大节省服务器存储空间。

## 📋 优势

- ✅ **节省存储空间**: 只存储图片URL，不下载实际图片文件
- ✅ **数据结构化**: 单词数据直接存储在数据库中，便于查询和管理
- ✅ **去重处理**: 自动检测并跳过已存在的单词
- ✅ **分类映射**: 智能将网站分类映射到现有数据库分类
- ✅ **实时统计**: 提供详细的爬取进度和统计信息

## 🚀 快速开始

### 1. 环境配置

复制环境变量模板文件：
```bash
cp env.example .env
```

编辑 `.env` 文件，填入您的Supabase配置：
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

> 💡 **获取Supabase配置**:
> 1. 登录 [Supabase Dashboard](https://app.supabase.com)
> 2. 选择您的项目
> 3. 在 Settings > API 页面找到 URL 和 anon key

### 2. 测试数据库连接

```bash
npm run test-db
```

这将验证：
- 数据库连接是否正常
- 表结构是否正确
- 插入/删除权限是否正常

### 3. 运行数据库爬虫

```bash
npm run scrape-to-db
```

## 📊 分类映射

爬虫会将kids-flashcards.com的分类智能映射到您现有的数据库分类：

| 网站分类 | 数据库分类 | 说明 |
|---------|-----------|------|
| jungle animals | animals | 丛林动物 |
| domestic animals | animals | 家养动物 |
| farm animals | animals | 农场动物 |
| sea animals | animals | 海洋动物 |
| fruits | fruits | 水果 |
| vegetables | fruits | 蔬菜(归类到水果) |
| colors | colors | 颜色 |
| numbers (1-20) | numbers | 数字 |
| kitchenware | food | 厨具 |
| gadgets | daily_phrases | 电子设备 |
| furniture | daily_phrases | 家具 |
| easter | daily_phrases | 复活节 |
| classroom objects | daily_phrases | 教室用品 |
| school building | daily_phrases | 学校建筑 |
| opposites | daily_phrases | 反义词 |

## 🔍 数据处理流程

1. **网站探索**: 自动发现所有可用的闪卡分类
2. **图片提取**: 从每个分类页面提取单词图片和名称
3. **数据清理**: 
   - 移除重复图片
   - 清理单词名称（去除"picture flashcards"等后缀）
   - 过滤无效或过长的单词
4. **去重检查**: 检查数据库中是否已存在相同单词
5. **数据插入**: 将新单词和图片URL保存到数据库

## 📈 输出结果

### 数据库字段
每个单词记录包含：
- `word`: 英文单词
- `chinese`: 中文翻译（暂时为空，可后续填充）
- `image_url`: 图片URL
- `category_id`: 分类ID
- `difficulty_level`: 难度级别（默认为1）
- `is_active`: 是否激活（默认为true）

### 报告文件
- `database-scraping-report.json`: 详细的爬取统计报告

## 🛠️ 命令总览

```bash
# 测试数据库连接
npm run test-db

# 运行数据库爬虫
npm run scrape-to-db

# 传统文件下载爬虫（可选）
npm run scrape

# 探索网站结构
npm run explore

# 测试单个分类
npm run test-single
```

## 📊 预期结果

基于之前的测试，预计能获取：
- 🦁 **动物类**: ~60个单词（丛林动物、家养动物、农场动物等）
- 🍎 **水果蔬菜**: ~50个单词
- 📱 **电子设备**: ~30个单词  
- 🎨 **颜色**: ~20个单词
- 🔢 **数字**: ~20个单词
- 🍽️ **食物厨具**: ~30个单词
- 💬 **其他日常**: ~100+个单词

**总计预估**: 300-400个高质量英文单词及对应图片URL

## ⚠️ 注意事项

1. **网络稳定性**: 确保网络连接稳定，爬取过程可能需要5-10分钟
2. **数据库权限**: 确保Supabase密钥有插入权限
3. **重复运行**: 爬虫有去重功能，可以安全地重复运行
4. **错误处理**: 如遇到页面加载超时，可以重新运行爬虫

## 🔧 故障排除

### 环境变量错误
```
❌ 请设置 SUPABASE_URL 和 SUPABASE_ANON_KEY 环境变量
```
**解决**: 检查 `.env` 文件是否正确配置

### 数据库连接失败
```
❌ 分类表查询失败
```
**解决**: 
1. 验证Supabase URL和密钥
2. 检查数据库表是否已创建
3. 确认RLS策略允许读取操作

### 插入权限错误
```
❌ 插入权限测试失败
```
**解决**: 
1. 使用Service Role Key而不是Anon Key
2. 检查RLS策略设置
3. 确认表权限配置

## 🎉 完成后

爬取完成后，您可以：
1. 在Supabase Dashboard中查看新增的单词数据
2. 在您的应用中使用这些数据
3. 为空的中文翻译字段添加翻译
4. 根据需要调整单词的分类和难度级别 