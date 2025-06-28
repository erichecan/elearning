import { neon } from '@neondatabase/serverless';

// 从环境变量获取数据库连接
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('请设置 DATABASE_URL 环境变量');
  process.exit(1);
}

const sql = neon(databaseUrl);

// 示例：批量导入单词数据
const batchImportWords = async () => {
  try {
    console.log('开始批量导入单词...');
    
    // 示例数据格式 - 可以轻松扩展到1500个单词
    const wordsData = [
      // 更多水果蔬菜
      { word: 'Grape', chinese: '葡萄', phonetic: '/ɡreɪp/', category_name: 'fruits', difficulty: 2 },
      { word: 'Watermelon', chinese: '西瓜', phonetic: '/ˈwɔːtərmelən/', category_name: 'fruits', difficulty: 3 },
      { word: 'Pineapple', chinese: '菠萝', phonetic: '/ˈpaɪnæpəl/', category_name: 'fruits', difficulty: 3 },
      { word: 'Mango', chinese: '芒果', phonetic: '/ˈmæŋɡoʊ/', category_name: 'fruits', difficulty: 2 },
      { word: 'Peach', chinese: '桃子', phonetic: '/piːtʃ/', category_name: 'fruits', difficulty: 2 },
      { word: 'Pear', chinese: '梨', phonetic: '/per/', category_name: 'fruits', difficulty: 1 },
      { word: 'Cherry', chinese: '樱桃', phonetic: '/ˈtʃeri/', category_name: 'fruits', difficulty: 2 },
      { word: 'Lemon', chinese: '柠檬', phonetic: '/ˈlemən/', category_name: 'fruits', difficulty: 2 },
      
      // 更多动物
      { word: 'Rabbit', chinese: '兔子', phonetic: '/ˈræbɪt/', category_name: 'animals', difficulty: 1 },
      { word: 'Bear', chinese: '熊', phonetic: '/ber/', category_name: 'animals', difficulty: 1 },
      { word: 'Monkey', chinese: '猴子', phonetic: '/ˈmʌŋki/', category_name: 'animals', difficulty: 2 },
      { word: 'Zebra', chinese: '斑马', phonetic: '/ˈziːbrə/', category_name: 'animals', difficulty: 2 },
      { word: 'Horse', chinese: '马', phonetic: '/hɔːrs/', category_name: 'animals', difficulty: 1 },
      { word: 'Cow', chinese: '奶牛', phonetic: '/kaʊ/', category_name: 'animals', difficulty: 1 },
      { word: 'Pig', chinese: '猪', phonetic: '/pɪɡ/', category_name: 'animals', difficulty: 1 },
      { word: 'Sheep', chinese: '羊', phonetic: '/ʃiːp/', category_name: 'animals', difficulty: 1 }
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const wordData of wordsData) {
      try {
        // 获取分类ID
        const categoryResult = await sql`
          SELECT id FROM categories WHERE name = ${wordData.category_name} LIMIT 1
        `;
        
        if (categoryResult.length === 0) {
          console.warn(`分类 ${wordData.category_name} 不存在，跳过单词: ${wordData.word}`);
          errorCount++;
          continue;
        }

        const categoryId = categoryResult[0].id;

        // 检查单词是否已存在
        const existingWord = await sql`
          SELECT id FROM words 
          WHERE word = ${wordData.word} AND category_id = ${categoryId}
          LIMIT 1
        `;

        if (existingWord.length > 0) {
          console.log(`单词 ${wordData.word} 已存在，跳过`);
          continue;
        }

        // 插入新单词
        await sql`
          INSERT INTO words (word, chinese, phonetic, category_id, difficulty_level, image_url)
          VALUES (
            ${wordData.word},
            ${wordData.chinese},
            ${wordData.phonetic},
            ${categoryId},
            ${wordData.difficulty || 1},
            ${`https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&q=80&auto=format&txt=${encodeURIComponent(wordData.word)}`}
          )
        `;

        console.log(`✓ 成功导入: ${wordData.word} - ${wordData.chinese}`);
        successCount++;

      } catch (error) {
        console.error(`✗ 导入失败: ${wordData.word} - ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n导入完成！`);
    console.log(`成功: ${successCount} 个`);
    console.log(`失败: ${errorCount} 个`);

  } catch (error) {
    console.error('批量导入失败:', error);
    process.exit(1);
  }
};

// 执行导入
batchImportWords(); 