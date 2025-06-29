# 本地数据库版本使用指南

本指南介绍如何使用本地SQLite数据库版本的爬虫，无需配置复杂的线上数据库。

## 🎯 优势

- **简单配置**: 无需环境变量配置，开箱即用
- **快速调试**: 本地数据库，调试方便
- **完整功能**: 包含数据查看、导出、统计等功能
- **数据安全**: 数据存储在本地，完全可控
- **易于迁移**: 支持导出为JSON/SQL格式，方便后续迁移

## 🚀 快速开始

### 1. 测试本地数据库功能

```bash
npm run test-local
```

这将运行一个完整的测试，验证所有数据库功能是否正常。

### 2. 运行本地爬虫

```bash
npm run scrape-local
```

这将：
- 自动创建 `flashcards.db` 数据库文件
- 创建必要的表结构和默认分类
- 爬取 kids-flashcards.com 网站
- 将单词和图片URL存储到本地数据库

### 3. 查看爬取结果

#### 交互式查看
```bash
npm run view-data
```

进入交互式菜单，可以：
- 查看统计信息
- 浏览所有分类
- 搜索单词
- 查看数据质量报告

#### 快速查看命令
```bash
# 查看统计信息
npm run view-stats

# 查看所有单词 (前50个)
npm run view-words

# 查看所有分类
npm run view-categories

# 导出数据
npm run export-data
```

## 📊 数据库结构

### 分类表 (categories)
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,           -- 分类英文名 (如 animals, fruits)
    display_name TEXT NOT NULL,          -- 分类中文显示名 (如 动物世界, 水果蔬菜)
    description TEXT,                    -- 描述
    icon TEXT,                          -- 图标emoji
    color TEXT,                         -- 主题颜色
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 单词表 (words)
```sql
CREATE TABLE words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,                  -- 英文单词
    chinese TEXT,                        -- 中文翻译
    phonetic TEXT,                       -- 音标
    image_url TEXT,                      -- 图片URL
    audio_url TEXT,                      -- 音频URL
    category_id INTEGER REFERENCES categories(id),
    difficulty_level INTEGER DEFAULT 1,  -- 难度等级 1-5
    is_active INTEGER DEFAULT 1,         -- 是否激活
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(word, category_id)            -- 同一分类下单词不重复
);
```

## 🔍 数据查看工具

### 命令行参数用法

```bash
# 查看统计信息
node view-data.js stats

# 查看所有分类
node view-data.js categories

# 查看前100个单词
node view-data.js words 100

# 搜索包含 "cat" 的单词
node view-data.js search cat

# 查看 animals 分类下的单词 (前30个)
node view-data.js category animals 30

# 查看重复单词
node view-data.js duplicates

# 查看数据质量报告
node view-data.js quality

# 导出数据
node view-data.js export
```

## 📤 数据导出

运行爬虫完成后，可以导出数据用于迁移到线上：

```bash
npm run export-data
```

这将生成：
- `exported-data.json`: JSON格式的完整数据
- `exported-data.sql`: SQL格式的数据，可直接导入其他数据库

### JSON格式示例
```json
{
  "categories": [
    {
      "id": 1,
      "name": "animals",
      "display_name": "动物世界",
      "description": "可爱的动物朋友们",
      "icon": "🦁",
      "color": "#4ECDC4"
    }
  ],
  "words": [
    {
      "id": 1,
      "word": "cat",
      "chinese": "猫",
      "image_url": "https://kids-flashcards.com/images/cat.jpg",
      "category_id": 1,
      "difficulty_level": 1,
      "is_active": 1
    }
  ],
  "stats": {
    "totalWords": 251,
    "totalCategories": 11,
    "categoryStats": [...]
  },
  "exportedAt": "2024-01-27T10:30:00.000Z"
}
```

## 🗃️ 文件说明

- `flashcards.db`: 主数据库文件 (爬虫运行后生成)
- `local-database.js`: 数据库管理类
- `local-scraper.js`: 本地数据库版本爬虫
- `view-data.js`: 数据查看和管理工具
- `test-local.js`: 本地数据库功能测试

## 📈 预期结果

运行完整爬虫后，预计获得：
- **300-400个英文单词** 和对应的图片URL
- **11个分类**: 动物、水果蔬菜、颜色、数字、家庭成员、身体部位、服装、食物、交通工具、自然天气、日常短语
- **高质量数据**: 自动去重，分类映射，单词清洗

## 🔄 后续迁移到线上

1. 使用 `npm run export-data` 导出数据
2. 将 `exported-data.sql` 导入到 Supabase 或其他线上数据库
3. 或者使用 `exported-data.json` 编写导入脚本

## 🛠️ 故障排除

### 数据库文件损坏
```bash
# 删除数据库文件重新开始
rm flashcards.db
npm run scrape-local
```

### 查看详细日志
爬虫运行时会显示详细的进度和错误信息，注意查看控制台输出。

### 网络问题
如果遇到网络超时，爬虫会自动跳过失败的分类，继续处理其他分类。

## 📞 帮助

如有问题，检查以下几点：
1. 确保安装了所有依赖: `npm install`
2. 确保安装了浏览器: `npm run install-browsers`
3. 检查网络连接是否正常
4. 查看控制台错误信息

本地版本的优势是调试简单，出现问题时可以快速定位和解决！ 