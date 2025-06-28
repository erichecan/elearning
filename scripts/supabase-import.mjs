import { createClient } from '@supabase/supabase-js';

// 从环境变量获取配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 批量导入单词数据
const batchImportWords = async () => {
  try {
    console.log('开始批量导入单词到Supabase...');
    
    // 更多单词数据 - 可以轻松扩展到1500个单词
    const wordsData = [
      // 身体部位类
      { word: 'Head', chinese: '头', phonetic: '/hed/', category_name: 'body', difficulty: 1 },
      { word: 'Hand', chinese: '手', phonetic: '/hænd/', category_name: 'body', difficulty: 1 },
      { word: 'Foot', chinese: '脚', phonetic: '/fʊt/', category_name: 'body', difficulty: 1 },
      { word: 'Eye', chinese: '眼睛', phonetic: '/aɪ/', category_name: 'body', difficulty: 1 },
      { word: 'Nose', chinese: '鼻子', phonetic: '/noʊz/', category_name: 'body', difficulty: 1 },
      { word: 'Mouth', chinese: '嘴巴', phonetic: '/maʊθ/', category_name: 'body', difficulty: 1 },
      { word: 'Ear', chinese: '耳朵', phonetic: '/ɪr/', category_name: 'body', difficulty: 1 },
      { word: 'Arm', chinese: '胳膊', phonetic: '/ɑːrm/', category_name: 'body', difficulty: 1 },
      { word: 'Leg', chinese: '腿', phonetic: '/leɡ/', category_name: 'body', difficulty: 1 },
      { word: 'Finger', chinese: '手指', phonetic: '/ˈfɪŋɡər/', category_name: 'body', difficulty: 2 },
      
      // 服装配饰类
      { word: 'Shirt', chinese: 'T恤', phonetic: '/ʃɜːrt/', category_name: 'clothes', difficulty: 1 },
      { word: 'Pants', chinese: '裤子', phonetic: '/pænts/', category_name: 'clothes', difficulty: 1 },
      { word: 'Dress', chinese: '连衣裙', phonetic: '/dres/', category_name: 'clothes', difficulty: 1 },
      { word: 'Shoes', chinese: '鞋子', phonetic: '/ʃuːz/', category_name: 'clothes', difficulty: 1 },
      { word: 'Hat', chinese: '帽子', phonetic: '/hæt/', category_name: 'clothes', difficulty: 1 },
      { word: 'Socks', chinese: '袜子', phonetic: '/sɑːks/', category_name: 'clothes', difficulty: 2 },
      { word: 'Jacket', chinese: '夹克', phonetic: '/ˈdʒækɪt/', category_name: 'clothes', difficulty: 2 },
      { word: 'Skirt', chinese: '裙子', phonetic: '/skɜːrt/', category_name: 'clothes', difficulty: 2 },
      { word: 'Sweater', chinese: '毛衣', phonetic: '/ˈswetər/', category_name: 'clothes', difficulty: 2 },
      { word: 'Gloves', chinese: '手套', phonetic: '/ɡlʌvz/', category_name: 'clothes', difficulty: 2 },
      
      // 食物饮料类
      { word: 'Bread', chinese: '面包', phonetic: '/bred/', category_name: 'food', difficulty: 1 },
      { word: 'Milk', chinese: '牛奶', phonetic: '/mɪlk/', category_name: 'food', difficulty: 1 },
      { word: 'Water', chinese: '水', phonetic: '/ˈwɔːtər/', category_name: 'food', difficulty: 1 },
      { word: 'Rice', chinese: '米饭', phonetic: '/raɪs/', category_name: 'food', difficulty: 1 },
      { word: 'Noodle', chinese: '面条', phonetic: '/ˈnuːdəl/', category_name: 'food', difficulty: 2 },
      { word: 'Cake', chinese: '蛋糕', phonetic: '/keɪk/', category_name: 'food', difficulty: 1 },
      { word: 'Cookie', chinese: '饼干', phonetic: '/ˈkʊki/', category_name: 'food', difficulty: 2 },
      { word: 'Juice', chinese: '果汁', phonetic: '/dʒuːs/', category_name: 'food', difficulty: 1 },
      { word: 'Tea', chinese: '茶', phonetic: '/tiː/', category_name: 'food', difficulty: 1 },
      { word: 'Coffee', chinese: '咖啡', phonetic: '/ˈkɔːfi/', category_name: 'food', difficulty: 2 },
      
      // 交通工具类
      { word: 'Car', chinese: '汽车', phonetic: '/kɑːr/', category_name: 'transport', difficulty: 1 },
      { word: 'Bus', chinese: '公交车', phonetic: '/bʌs/', category_name: 'transport', difficulty: 1 },
      { word: 'Train', chinese: '火车', phonetic: '/treɪn/', category_name: 'transport', difficulty: 1 },
      { word: 'Plane', chinese: '飞机', phonetic: '/pleɪn/', category_name: 'transport', difficulty: 1 },
      { word: 'Bike', chinese: '自行车', phonetic: '/baɪk/', category_name: 'transport', difficulty: 1 },
      { word: 'Ship', chinese: '轮船', phonetic: '/ʃɪp/', category_name: 'transport', difficulty: 2 },
      { word: 'Taxi', chinese: '出租车', phonetic: '/ˈtæksi/', category_name: 'transport', difficulty: 2 },
      { word: 'Truck', chinese: '卡车', phonetic: '/trʌk/', category_name: 'transport', difficulty: 2 },
      { word: 'Boat', chinese: '小船', phonetic: '/boʊt/', category_name: 'transport', difficulty: 2 },
      { word: 'Helicopter', chinese: '直升机', phonetic: '/ˈhelɪkɑːptər/', category_name: 'transport', difficulty: 3 },
      
      // 自然天气类
      { word: 'Sun', chinese: '太阳', phonetic: '/sʌn/', category_name: 'nature', difficulty: 1 },
      { word: 'Moon', chinese: '月亮', phonetic: '/muːn/', category_name: 'nature', difficulty: 1 },
      { word: 'Star', chinese: '星星', phonetic: '/stɑːr/', category_name: 'nature', difficulty: 1 },
      { word: 'Cloud', chinese: '云', phonetic: '/klaʊd/', category_name: 'nature', difficulty: 1 },
      { word: 'Rain', chinese: '雨', phonetic: '/reɪn/', category_name: 'nature', difficulty: 1 },
      { word: 'Snow', chinese: '雪', phonetic: '/snoʊ/', category_name: 'nature', difficulty: 1 },
      { word: 'Wind', chinese: '风', phonetic: '/wɪnd/', category_name: 'nature', difficulty: 1 },
      { word: 'Tree', chinese: '树', phonetic: '/triː/', category_name: 'nature', difficulty: 1 },
      { word: 'Flower', chinese: '花', phonetic: '/ˈflaʊər/', category_name: 'nature', difficulty: 1 },
      { word: 'Grass', chinese: '草', phonetic: '/ɡræs/', category_name: 'nature', difficulty: 1 },
      
      // 更多水果
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
        const { data: category, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', wordData.category_name)
          .single();
        
        if (categoryError || !category) {
          console.warn(`分类 ${wordData.category_name} 不存在，跳过单词: ${wordData.word}`);
          errorCount++;
          continue;
        }

        // 检查单词是否已存在
        const { data: existingWord, error: checkError } = await supabase
          .from('words')
          .select('id')
          .eq('word', wordData.word)
          .eq('category_id', category.id)
          .single();

        if (existingWord) {
          console.log(`单词 ${wordData.word} 已存在，跳过`);
          continue;
        }

        // 插入新单词
        const { error: insertError } = await supabase
          .from('words')
          .insert({
            word: wordData.word,
            chinese: wordData.chinese,
            phonetic: wordData.phonetic,
            category_id: category.id,
            difficulty_level: wordData.difficulty || 1,
            image_url: `https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&q=80&auto=format&txt=${encodeURIComponent(wordData.word)}`
          });

        if (insertError) throw insertError;

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