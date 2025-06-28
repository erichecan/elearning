import { supabase, Category, Word } from '../lib/database';

// 生成设备唯一ID
function getDeviceId(): string {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// 分类相关API
export const categoryService = {
  // 获取所有分类
  async getAll(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取分类失败:', error);
      throw new Error('获取分类失败');
    }
  },

  // 根据name获取分类
  async getByName(name: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', name)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('获取分类失败:', error);
      throw new Error('获取分类失败');
    }
  }
};

// 单词相关API
export const wordService = {
  // 根据分类获取单词列表
  async getByCategory(categoryName: string): Promise<Word[]> {
    try {
      const deviceId = getDeviceId();
      
      const { data, error } = await supabase
        .from('words')
        .select(`
          *,
          categories!inner(display_name, icon, color),
          favorites!left(id)
        `)
        .eq('categories.name', categoryName)
        .eq('is_active', true)
        .eq('favorites.user_id', deviceId)
        .order('id', { ascending: true });

      if (error) throw error;

      // 处理数据格式
      const words = (data || []).map((word: any) => ({
        ...word,
        category_display_name: word.categories?.display_name,
        category_icon: word.categories?.icon,
        category_color: word.categories?.color,
        is_favorite: word.favorites && word.favorites.length > 0
      })) as Word[];

      return words;
    } catch (error) {
      console.error('获取单词失败:', error);
      throw new Error('获取单词失败');
    }
  },

  // 获取单个单词详情
  async getById(id: number): Promise<Word | null> {
    try {
      const deviceId = getDeviceId();
      
      const { data, error } = await supabase
        .from('words')
        .select(`
          *,
          categories(display_name, icon, color),
          favorites!left(id)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .eq('favorites.user_id', deviceId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        return {
          ...data,
          category_display_name: (data as any).categories?.display_name,
          category_icon: (data as any).categories?.icon,
          category_color: (data as any).categories?.color,
          is_favorite: (data as any).favorites && (data as any).favorites.length > 0
        } as Word;
      }
      
      return null;
    } catch (error) {
      console.error('获取单词详情失败:', error);
      throw new Error('获取单词详情失败');
    }
  },

  // 搜索单词
  async search(query: string): Promise<Word[]> {
    try {
      const deviceId = getDeviceId();
      
      const { data, error } = await supabase
        .from('words')
        .select(`
          *,
          categories(display_name, icon, color),
          favorites!left(id)
        `)
        .or(`word.ilike.%${query}%,chinese.ilike.%${query}%`)
        .eq('is_active', true)
        .eq('favorites.user_id', deviceId)
        .order('id', { ascending: true })
        .limit(50);

      if (error) throw error;

      const words = (data || []).map((word: any) => ({
        ...word,
        category_display_name: word.categories?.display_name,
        category_icon: word.categories?.icon,
        category_color: word.categories?.color,
        is_favorite: word.favorites && word.favorites.length > 0
      })) as Word[];

      return words;
    } catch (error) {
      console.error('搜索单词失败:', error);
      throw new Error('搜索单词失败');
    }
  }
};

// 收藏相关API
export const favoriteService = {
  // 添加收藏
  async add(wordId: number): Promise<void> {
    try {
      const deviceId = getDeviceId();
      
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: deviceId,
          word_id: wordId
        });

      if (error && error.code !== '23505') throw error; // 忽略重复插入错误
    } catch (error) {
      console.error('添加收藏失败:', error);
      throw new Error('添加收藏失败');
    }
  },

  // 取消收藏
  async remove(wordId: number): Promise<void> {
    try {
      const deviceId = getDeviceId();
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', deviceId)
        .eq('word_id', wordId);

      if (error) throw error;
    } catch (error) {
      console.error('取消收藏失败:', error);
      throw new Error('取消收藏失败');
    }
  },

  // 获取收藏列表
  async getAll(): Promise<Word[]> {
    try {
      const deviceId = getDeviceId();
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          word_id,
          created_at,
          words!inner(
            *,
            categories(display_name, icon, color)
          )
        `)
        .eq('user_id', deviceId)
        .eq('words.is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const words = (data || []).map((favorite: any) => ({
        ...favorite.words,
        category_display_name: favorite.words.categories?.display_name,
        category_icon: favorite.words.categories?.icon,
        category_color: favorite.words.categories?.color,
        is_favorite: true
      })) as Word[];

      return words;
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      throw new Error('获取收藏列表失败');
    }
  }
};

// 学习进度相关API
export const progressService = {
  // 更新学习进度
  async updateProgress(wordId: number, isCorrect: boolean): Promise<void> {
    try {
      const deviceId = getDeviceId();
      
      if (isCorrect) {
        const { error } = await supabase
          .rpc('update_correct_progress', {
            p_user_id: deviceId,
            p_word_id: wordId
          });
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .rpc('update_wrong_progress', {
            p_user_id: deviceId,
            p_word_id: wordId
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('更新学习进度失败:', error);
      throw new Error('更新学习进度失败');
    }
  },

  // 获取学习统计
  async getStats(): Promise<{
    totalWords: number;
    learnedWords: number;
    masteredWords: number;
    favoriteWords: number;
  }> {
    try {
      const deviceId = getDeviceId();
      
      const [totalResult, learnedResult, masteredResult, favoriteResult] = await Promise.all([
        supabase.from('words').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('learning_progress').select('id', { count: 'exact' }).eq('user_id', deviceId).or('correct_count.gt.0,wrong_count.gt.0'),
        supabase.from('learning_progress').select('id', { count: 'exact' }).eq('user_id', deviceId).gte('mastery_level', 4),
        supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', deviceId)
      ]);

      return {
        totalWords: totalResult.count || 0,
        learnedWords: learnedResult.count || 0,
        masteredWords: masteredResult.count || 0,
        favoriteWords: favoriteResult.count || 0
      };
    } catch (error) {
      console.error('获取学习统计失败:', error);
      throw new Error('获取学习统计失败');
    }
  }
}; 