const { chromium } = require('playwright');
const fs = require('fs-extra');

class WebsiteExplorer {
    constructor() {
        this.browser = null;
        this.page = null;
        this.baseUrl = 'https://kids-flashcards.com';
    }

    async init() {
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
        console.log('🔍 开始探索网站结构...');
    }

    async exploreMainPage() {
        console.log('🏠 分析主页...');
        await this.page.goto(this.baseUrl);
        await this.page.waitForLoadState('networkidle');

        // 获取所有链接
        const allLinks = await this.page.$$eval('a', links => 
            links.map(link => ({
                href: link.href,
                text: link.textContent.trim(),
                title: link.title
            })).filter(link => link.href && link.text)
        );

        console.log(`发现 ${allLinks.length} 个链接`);

        // 分析语言页面
        const languageLinks = allLinks.filter(link => {
            try {
                const url = new URL(link.href);
                const pathParts = url.pathname.split('/').filter(p => p);
                return pathParts.length === 1 && pathParts[0].length === 2;
            } catch (e) {
                return false;
            }
        });

        console.log(`🌍 发现 ${languageLinks.length} 种语言:`);
        languageLinks.forEach(lang => console.log(`  - ${lang.text}: ${lang.href}`));

        return { allLinks, languageLinks };
    }

    async exploreEnglishFlashcards() {
        console.log('🔤 分析英文闪卡页面...');
        await this.page.goto(`${this.baseUrl}/en`);
        await this.page.waitForLoadState('networkidle');

        // 获取页面标题和结构
        const title = await this.page.title();
        console.log(`页面标题: ${title}`);

        // 查找所有闪卡分类链接
        const flashcardLinks = await this.page.$$eval('a', links => 
            links.map(link => ({
                href: link.href,
                text: link.textContent.trim(),
                title: link.title
            })).filter(link => 
                link.href.includes('flashcards') && 
                link.href.includes('/en/free-printable/')
            )
        );

        console.log(`📚 发现 ${flashcardLinks.length} 个闪卡分类:`);
        flashcardLinks.forEach((link, index) => {
            console.log(`  ${index + 1}. ${link.text} - ${link.href}`);
        });

        return flashcardLinks;
    }

    async analyzeSampleFlashcard(url) {
        console.log(`🔬 详细分析闪卡页面: ${url}`);
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');

        // 获取页面所有图片
        const images = await this.page.$$eval('img', imgs => 
            imgs.map(img => ({
                src: img.src,
                alt: img.alt,
                title: img.title,
                className: img.className,
                width: img.width,
                height: img.height
            }))
        );

        console.log(`🖼️ 发现 ${images.length} 张图片:`);
        images.forEach((img, index) => {
            console.log(`  ${index + 1}. ${img.alt || img.title || 'unnamed'} - ${img.src}`);
        });

        // 查找下载链接
        const downloadLinks = await this.page.$$eval('a', links => 
            links.map(link => ({
                href: link.href,
                text: link.textContent.trim(),
                download: link.download
            })).filter(link => 
                link.href.includes('.pdf') || 
                link.text.toLowerCase().includes('download') ||
                link.download
            )
        );

        console.log(`⬇️ 发现 ${downloadLinks.length} 个下载链接:`);
        downloadLinks.forEach((link, index) => {
            console.log(`  ${index + 1}. ${link.text} - ${link.href}`);
        });

        // 分析页面结构
        const pageStructure = await this.page.evaluate(() => {
            const structure = {
                flashcardCount: 0,
                categories: [],
                languages: [],
                downloadFormats: []
            };

            // 寻找闪卡数量信息
            const countElements = document.querySelectorAll('*');
            for (let el of countElements) {
                const text = el.textContent;
                if (text && text.match(/\d+\s*flashcards?/i)) {
                    const match = text.match(/(\d+)\s*flashcards?/i);
                    if (match) {
                        structure.flashcardCount = parseInt(match[1]);
                    }
                }
            }

            return structure;
        });

        console.log(`📊 页面结构分析:`, pageStructure);

        return { images, downloadLinks, pageStructure };
    }

    async discoverAllCategories() {
        console.log('🎯 发现所有分类...');
        
        // 从英文页面开始
        const englishCategories = await this.exploreEnglishFlashcards();
        
        // 尝试访问其他语言页面
        const languages = ['de', 'es', 'fr', 'it', 'nl', 'pt', 'ru']; // 从搜索结果中看到的语言
        const allCategories = new Map();

        // 添加英文分类
        for (const cat of englishCategories) {
            const categoryName = this.extractCategoryName(cat.href);
            if (!allCategories.has(categoryName)) {
                allCategories.set(categoryName, {
                    name: categoryName,
                    languages: []
                });
            }
            allCategories.get(categoryName).languages.push({ lang: 'en', url: cat.href, text: cat.text });
        }

        // 检查其他语言
        for (const lang of languages) {
            try {
                console.log(`🌍 检查 ${lang} 语言页面...`);
                await this.page.goto(`${this.baseUrl}/${lang}`, { timeout: 10000 });
                await this.page.waitForLoadState('networkidle');

                const langCategories = await this.page.$$eval('a', links => 
                    links.map(link => ({
                        href: link.href,
                        text: link.textContent.trim()
                    })).filter(link => 
                        link.href.includes('flashcards') && 
                        link.href.includes(`/${lang}/free-printable/`)
                    )
                );

                console.log(`  发现 ${langCategories.length} 个 ${lang} 分类`);

                for (const cat of langCategories) {
                    const categoryName = this.extractCategoryName(cat.href);
                    if (!allCategories.has(categoryName)) {
                        allCategories.set(categoryName, {
                            name: categoryName,
                            languages: []
                        });
                    }
                    allCategories.get(categoryName).languages.push({ lang, url: cat.href, text: cat.text });
                }

                // 添加延迟避免过于频繁的请求
                await this.page.waitForTimeout(1000);
            } catch (error) {
                console.log(`  ⚠️ 跳过 ${lang} 语言: ${error.message}`);
            }
        }

        return Array.from(allCategories.values());
    }

    extractCategoryName(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const categoryPart = pathParts[pathParts.length - 1];
            return categoryPart.replace('-flashcards-in-english', '')
                              .replace('-flashcards', '')
                              .replace(/-/g, ' ');
        } catch (e) {
            return 'unknown';
        }
    }

    async generateExplorationReport(categories) {
        const report = {
            timestamp: new Date().toISOString(),
            totalCategories: categories.length,
            totalLanguages: new Set(categories.flatMap(cat => cat.languages.map(l => l.lang))).size,
            estimatedTotalFlashcards: categories.length * 20, // 粗略估计
            categories: categories,
            languages: Array.from(new Set(categories.flatMap(cat => cat.languages.map(l => l.lang)))),
            summary: {
                mostLanguagesCategory: categories.reduce((max, cat) => 
                    cat.languages.length > (max?.languages.length || 0) ? cat : max, null),
                avgLanguagesPerCategory: categories.length > 0 ? 
                    categories.reduce((sum, cat) => sum + cat.languages.length, 0) / categories.length : 0
            }
        };

        await fs.writeJson('./exploration-report.json', report, { spaces: 2 });
        console.log('📊 探索报告已保存到 exploration-report.json');
        
        // 打印摘要
        console.log('\n📈 探索摘要:');
        console.log(`- 总分类数: ${report.totalCategories}`);
        console.log(`- 总语言数: ${report.totalLanguages}`);
        console.log(`- 估计总闪卡数: ${report.estimatedTotalFlashcards}`);
        console.log(`- 平均每分类语言数: ${report.summary.avgLanguagesPerCategory.toFixed(1)}`);
        
        return report;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('✅ 探索完成');
    }

    async run() {
        try {
            await this.init();
            
            // 步骤1: 分析主页
            await this.exploreMainPage();
            
            // 步骤2: 分析英文闪卡页面
            const englishCategories = await this.exploreEnglishFlashcards();
            
            // 步骤3: 详细分析一个示例页面
            if (englishCategories.length > 0) {
                await this.analyzeSampleFlashcard(englishCategories[0].href);
            }
            
            // 步骤4: 发现所有分类
            const allCategories = await this.discoverAllCategories();
            
            // 步骤5: 生成报告
            await this.generateExplorationReport(allCategories);
            
        } catch (error) {
            console.error('❌ 探索过程中出现错误:', error);
        } finally {
            await this.close();
        }
    }
}

// 运行探索器
(async () => {
    const explorer = new WebsiteExplorer();
    await explorer.run();
})(); 