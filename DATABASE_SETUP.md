# Supabase数据库设置指南

## 1. 创建Supabase项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建免费账户
3. 点击 "New Project" 创建新项目
4. 选择组织和设置项目名称
5. 设置数据库密码
6. 选择地区（推荐选择离用户最近的地区）
7. 等待项目创建完成

## 2. 获取项目配置信息

在项目Dashboard中：
1. 进入 "Settings" → "API"
2. 记录以下信息：
   - **Project URL**：`https://your-project-id.supabase.co`
   - **anon public key**：`eyJhbGciOiJIUzI1NiIsInR...`

## 3. 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# Supabase配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. 数据库初始化

### 4.1 创建表结构

1. 在Supabase Dashboard中，进入 "SQL Editor"
2. 创建新查询
3. 复制并执行 `database/supabase-schema.sql` 文件中的所有SQL语句

### 4.2 插入示例数据

1. 在SQL Editor中创建新查询
2. 复制并执行 `database/supabase-sample-data.sql` 文件中的所有SQL语句

## 5. 验证设置

1. 在Dashboard的 "Table Editor" 中查看创建的表：
   - categories
   - words
   - favorites
   - learning_progress

2. 确认数据已正确插入

## 6. 启动应用

```bash
npm install
npm run dev
```

## 部署到Netlify

### 环境变量设置

在Netlify项目设置中添加环境变量：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 自动部署

1. 将代码推送到GitHub
2. 在Netlify中连接GitHub仓库
3. 设置环境变量
4. 部署完成后，应用将自动连接到Supabase数据库

## Supabase架构优势

### 🔒 安全性
- **行级安全 (RLS)**：确保用户只能访问自己的数据
- **API Keys**：公开的anon key是安全的，用于客户端访问
- **自动认证**：内置用户认证系统（未来可扩展）

### 📊 功能特性
- **实时订阅**：支持实时数据更新
- **自动API生成**：基于数据库表自动生成REST API
- **边缘函数**：支持服务器端逻辑
- **存储**：文件存储功能（用于音频文件）

### 🚀 扩展性
- **无服务器**：自动扩容，按使用量计费
- **全球CDN**：快速的数据访问
- **备份恢复**：自动数据备份
- **监控分析**：内置性能监控

### 💰 成本效益
- **免费层**：足够个人项目使用
- **透明定价**：按实际使用量付费
- **无隐藏费用**：包含存储、带宽、API调用

## 数据管理

### 批量导入单词

使用Supabase Dashboard的SQL Editor可以轻松批量导入大量单词：

```sql
-- 示例：批量导入更多单词
INSERT INTO words (word, chinese, phonetic, category_id, difficulty_level) 
SELECT word_data.*, c.id FROM 
(VALUES
    ('Example', '示例', '/ɪɡˈzæmpəl/', 1),
    -- ... 更多单词
) AS word_data(word, chinese, phonetic, difficulty_level),
categories c WHERE c.name = 'your_category';
```

### 数据导出
- 支持CSV、JSON格式导出
- 可编程API访问
- 备份和迁移友好

这个架构完美支持1500+单词的需求，并为未来的功能扩展提供了坚实基础！ 