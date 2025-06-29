# Kids Flashcards 爬虫项目

这个项目用于从 [kids-flashcards.com](https://kids-flashcards.com) 网站抓取闪卡图片。

## 📋 功能特性

- 🔍 自动探索网站结构和分类
- 🌍 支持多语言版本的闪卡
- 🖼️ 下载高质量闪卡图片
- 📄 下载PDF格式闪卡
- 📊 生成详细的爬取报告
- ⚡ 智能去重，避免重复下载
- 🛡️ 内置延迟机制，避免被封IP

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 安装Playwright浏览器
```bash
npx playwright install
```

### 3. 探索网站结构（推荐先运行）
```bash
npm run explore
```

### 4. 开始爬取
```bash
npm run scrape
```

## 📁 项目结构

```
flashcard-scraper/
├── README.md           # 项目说明
├── package.json        # 项目配置
├── explore.js          # 网站结构探索脚本
├── scraper.js          # 主爬虫脚本
├── downloads/          # 下载的图片存储目录
│   ├── animals/        # 按分类组织
│   ├── colors/
│   └── ...
├── exploration-report.json  # 网站结构探索报告
└── scraping-report.json     # 爬取结果报告
```

## 🔧 配置选项

在 `scraper.js` 中可以修改以下配置：

```javascript
class FlashcardScraper {
    constructor() {
        this.baseUrl = 'https://kids-flashcards.com';
        this.downloadDir = './downloads';          // 下载目录
        this.headless = false;                     // 是否无头模式
        this.delay = 500;                          // 下载间隔(毫秒)
        this.maxRetries = 3;                       // 最大重试次数
    }
}
```

## 📊 报告说明

### exploration-report.json
包含网站结构分析结果：
- 总分类数量
- 支持的语言
- 每个分类的详细信息

### scraping-report.json
包含爬取结果统计：
- 下载的图片数量
- 成功/失败统计
- 下载的文件列表

## ⚠️ 使用须知

1. **请遵守网站的robots.txt和使用条款**
2. **仅用于个人学习和研究目的**
3. **不要过于频繁地请求，避免给服务器造成压力**
4. **尊重版权，下载的内容仅供个人使用**

## 🛠️ 故障排除

### 常见问题

1. **下载失败**
   - 检查网络连接
   - 增加延迟时间
   - 查看错误日志

2. **浏览器启动失败**
   ```bash
   npx playwright install --force
   ```

3. **内存不足**
   - 减少并发数量
   - 分批下载

## 📝 更新日志

- v1.0.0: 初始版本，支持基本爬取功能
- 支持多语言
- 支持图片和PDF下载
- 智能去重功能

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License - 仅供学习和研究使用 