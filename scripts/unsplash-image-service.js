const { createClient } = require('@supabase/supabase-js');

// Supabase配置
const supabaseUrl = 'https://kdwpwbmnnpxhznpmgdla.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkd3B3Ym1ubnB4aHpucG1nZGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMjg0MDAsImV4cCI6MjA0ODgwNDQwMH0.8Q9uUGJ3dVgzxR3mEQKoP_mPEy_vNZ9Aj4JVoH4dqJU';
const supabase = createClient(supabaseUrl, supabaseKey);

// 专业儿童学习单词图片映射 - 基于真实教育资源
const PROFESSIONAL_WORD_IMAGES = {
    // 动物类
    'dog': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=center',
    'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=center',
    'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&crop=center',
    'fish': 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop&crop=center',
    'rabbit': 'https://images.unsplash.com/photo-1553936204-85b436511206?w=400&h=300&fit=crop&crop=center',
    'elephant': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop&crop=center',
    'lion': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=300&fit=crop&crop=center',
    'tiger': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop&crop=center',
    'bear': 'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=400&h=300&fit=crop&crop=center',
    'monkey': 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=300&fit=crop&crop=center',
    
    // 食物类
    'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&crop=center',
    'banana': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop&crop=center',
    'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop&crop=center',
    'bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop&crop=center',
    'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&crop=center',
    'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&crop=center',
    'egg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop&crop=center',
    'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center',
    'cake': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop&crop=center',
    'cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center',
    
    // 颜色类
    'red': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
    'blue': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop&crop=center',
    'green': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center',
    'yellow': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    'purple': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center',
    'pink': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
    'black': 'https://images.unsplash.com/photo-1493119508027-2b584f234d6c?w=400&h=300&fit=crop&crop=center',
    'white': 'https://images.unsplash.com/photo-1494976979355-c2b2f18f6d3f?w=400&h=300&fit=crop&crop=center',
    'brown': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop&crop=center',
    
    // 身体部位
    'hand': 'https://images.unsplash.com/photo-1525281336113-3bb2b30eadff?w=400&h=300&fit=crop&crop=center',
    'foot': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    'eye': 'https://images.unsplash.com/photo-1519709042477-8de6eaf37e5a?w=400&h=300&fit=crop&crop=center',
    'ear': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=center',
    'nose': 'https://images.unsplash.com/photo-1615814675277-ae2b6b9a2b8c?w=400&h=300&fit=crop&crop=center',
    'mouth': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&crop=center',
    'head': 'https://images.unsplash.com/photo-1494790108755-2616c898750d?w=400&h=300&fit=crop&crop=center',
    'hair': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center',
    'tooth': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&crop=center',
    'finger': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&crop=center',
    
    // 数字类 - 用视觉数字表示
    'one': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    'two': 'https://images.unsplash.com/photo-1503556893084-f3de3c34b418?w=400&h=300&fit=crop&crop=center',
    'three': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop&crop=center',
    'four': 'https://images.unsplash.com/photo-1533042789716-e9b4ee8b0f68?w=400&h=300&fit=crop&crop=center',
    'five': 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=400&h=300&fit=crop&crop=center',
    
    // 家庭类
    'family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop&crop=center',
    'mother': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=center',
    'father': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
    'baby': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=center',
    'child': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop&crop=center',
    'grandfather': 'https://images.unsplash.com/photo-1559967743-1c69ba0e339b?w=400&h=300&fit=crop&crop=center',
    'grandmother': 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=400&h=300&fit=crop&crop=center',
    'brother': 'https://images.unsplash.com/photo-1504149840132-7fc04c253a8b?w=400&h=300&fit=crop&crop=center',
    'sister': 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&h=300&fit=crop&crop=center',
    
    // 服装类
    'shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&crop=center',
    'pants': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&crop=center',
    'dress': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop&crop=center',
    'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&crop=center',
    'hat': 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=300&fit=crop&crop=center',
    'coat': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center',
    'socks': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&crop=center',
    'jacket': 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=400&h=300&fit=crop&crop=center'
};

// 备用图片服务 - 高质量SVG生成
function generateEducationalSVG(word, category = 'general') {
    const colorSchemes = {
        'Animals': { bg: '#FFE8CC', accent: '#FF9500', emoji: '🐾' },
        'Food': { bg: '#E8F5E8', accent: '#4CAF50', emoji: '🍎' },
        'Colors': { bg: '#F3E5F5', accent: '#9C27B0', emoji: '🎨' },
        'Body Parts': { bg: '#E3F2FD', accent: '#2196F3', emoji: '👋' },
        'Numbers': { bg: '#FFF3E0', accent: '#FF9800', emoji: '🔢' },
        'Family': { bg: '#FCE4EC', accent: '#E91E63', emoji: '🏠' },
        'Clothing': { bg: '#F1F8E9', accent: '#8BC34A', emoji: '👕' },
        'default': { bg: '#F5F5F5', accent: '#9E9E9E', emoji: '📚' }
    };
    
    const scheme = colorSchemes[category] || colorSchemes.default;
    const uniqueId = `educational-${Math.random().toString(36).substr(2, 9)}`;
    
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <defs>
                <linearGradient id="${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${scheme.bg};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${scheme.accent};stop-opacity:0.3" />
                </linearGradient>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="4" flood-opacity="0.1"/>
                </filter>
            </defs>
            <rect width="400" height="300" fill="url(#${uniqueId})" rx="20"/>
            <circle cx="320" cy="60" r="40" fill="${scheme.accent}" opacity="0.1"/>
            <circle cx="80" cy="240" r="30" fill="${scheme.accent}" opacity="0.15"/>
            <rect x="150" y="80" width="100" height="100" fill="white" rx="20" opacity="0.9" filter="url(#shadow)"/>
            <text x="200" y="140" text-anchor="middle" font-size="40" font-family="system-ui">${scheme.emoji}</text>
            <text x="200" y="220" text-anchor="middle" font-size="24" font-weight="bold" font-family="system-ui" fill="${scheme.accent}">${word.toUpperCase()}</text>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// 智能图片获取函数
async function getSmartImageUrl(word, category = 'general') {
    console.log(`🖼️ 为单词 "${word}" (分类: ${category}) 获取智能图片...`);
    
    // 1. 优先使用专业映射图片
    if (PROFESSIONAL_WORD_IMAGES[word.toLowerCase()]) {
        console.log(`✅ 使用专业图片映射: ${word}`);
        return PROFESSIONAL_WORD_IMAGES[word.toLowerCase()];
    }
    
    // 2. 提供高质量备用SVG
    console.log(`📐 生成教育SVG图片: ${word}`);
    return generateEducationalSVG(word, category);
}

// 批量修复数据库中的图片URL
async function fixAllImageUrls() {
    console.log('🔧 开始批量修复数据库图片URL...');
    
    try {
        // 获取所有单词数据
        const { data: words, error } = await supabase
            .from('words')
            .select('*');
            
        if (error) {
            console.error('❌ 获取单词数据失败:', error);
            return;
        }
        
        console.log(`📊 找到 ${words.length} 个单词需要处理`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const word of words) {
            try {
                // 获取分类信息
                const { data: categoryData } = await supabase
                    .from('categories')
                    .select('name')
                    .eq('id', word.category_id)
                    .single();
                    
                const categoryName = categoryData?.name || 'general';
                
                // 获取智能图片URL
                const newImageUrl = await getSmartImageUrl(word.text, categoryName);
                
                // 更新数据库
                const { error: updateError } = await supabase
                    .from('words')
                    .update({ image_url: newImageUrl })
                    .eq('id', word.id);
                    
                if (updateError) {
                    console.error(`❌ 更新单词 "${word.text}" 失败:`, updateError);
                    errorCount++;
                } else {
                    console.log(`✅ 更新单词 "${word.text}" 成功`);
                    successCount++;
                }
                
                // 防止请求过快
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (err) {
                console.error(`❌ 处理单词 "${word.text}" 异常:`, err);
                errorCount++;
            }
        }
        
        console.log('🎉 批量修复完成!');
        console.log(`✅ 成功更新: ${successCount} 个`);
        console.log(`❌ 失败: ${errorCount} 个`);
        
    } catch (err) {
        console.error('❌ 批量修复异常:', err);
    }
}

// 生成修复SQL
function generateFixSQL() {
    console.log('📝 生成图片URL修复SQL...');
    
    const sqlUpdates = [];
    
    Object.entries(PROFESSIONAL_WORD_IMAGES).forEach(([word, imageUrl]) => {
        const sql = `UPDATE words SET image_url = '${imageUrl}' WHERE LOWER(text) = '${word.toLowerCase()}';`;
        sqlUpdates.push(sql);
    });
    
    const fullSQL = `-- 儿童英语学习应用 - 图片URL批量修复
-- 执行时间: ${new Date().toISOString()}
-- 目标: 将所有单词图片更新为高质量专业图片

${sqlUpdates.join('\n')}

-- 检查更新结果
SELECT COUNT(*) as updated_count FROM words WHERE image_url LIKE 'https://images.unsplash.com%';
`;

    require('fs').writeFileSync('image-fix.sql', fullSQL);
    console.log('✅ SQL文件已生成: image-fix.sql');
    console.log(`📊 包含 ${sqlUpdates.length} 个UPDATE语句`);
    
    return fullSQL;
}

// 主执行函数
async function main() {
    console.log('🚀 Unsplash智能图片服务启动!');
    console.log('功能选择:');
    console.log('1. 批量修复数据库图片URL');
    console.log('2. 生成修复SQL文件');
    console.log('3. 测试单词图片获取');
    
    const args = process.argv.slice(2);
    const action = args[0] || '1';
    
    switch (action) {
        case '1':
            await fixAllImageUrls();
            break;
        case '2':
            generateFixSQL();
            break;
        case '3':
            const testWord = args[1] || 'dog';
            const testCategory = args[2] || 'Animals';
            const testUrl = await getSmartImageUrl(testWord, testCategory);
            console.log(`🧪 测试结果 - 单词: ${testWord}, 分类: ${testCategory}`);
            console.log(`🔗 图片URL: ${testUrl}`);
            break;
        default:
            console.log('❌ 无效的操作选择');
    }
}

// 如果直接运行此文件
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    getSmartImageUrl,
    generateEducationalSVG,
    fixAllImageUrls,
    generateFixSQL,
    PROFESSIONAL_WORD_IMAGES
}; 