import { supabase, Category, Word } from '../lib/database';
import { apiFetch } from './api-client';

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
      const response = await apiFetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
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
      const response = await apiFetch(`/api/words?category=${encodeURIComponent(categoryName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      const words = await response.json();
      // Map category fields for compatibility
      return words.map((word: any) => ({
        ...word,
        category_display_name: word.category_display_name,
        category_icon: word.category_icon,
        category_color: word.category_color,
        is_favorite: false // Will need to fetch separately if needed
      }));
    } catch (error) {
      console.error('获取单词失败:', error);
      throw new Error('获取单词失败');
    }
  },

  // 获取单个单词详情
  async getById(id: number): Promise<Word | null> {
    try {
      const deviceId = getDeviceId();
      const response = await apiFetch(`/api/words/${id}?userId=${encodeURIComponent(deviceId)}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch word');
      }
      return await response.json();
    } catch (error) {
      console.error('获取单词详情失败:', error);
      throw new Error('获取单词详情失败');
    }
  },

  // 搜索单词
  async search(query: string): Promise<Word[]> {
    try {
      const deviceId = getDeviceId();
      const response = await apiFetch(`/api/words/search?q=${encodeURIComponent(query)}&userId=${encodeURIComponent(deviceId)}`);
      if (!response.ok) throw new Error('Failed to search words');
      return await response.json();
    } catch (error) {
      console.error('搜索单词失败:', error);
      throw new Error('搜索单词失败');
    }
  },

  // 创建新单词
  async create(word: Partial<Word>): Promise<Word> {
    try {
      // Use Backend API Proxy to avoid browser TCP issues with Neon
      const response = await apiFetch('/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create word via API');
      }

      return await response.json();
    } catch (error) {
      console.error('创建单词失败:', error);
      throw new Error('创建单词失败');
    }
  }
};

// 收藏相关API
export const favoriteService = {
  async add(wordId: number): Promise<void> {
    try {
      const deviceId = getDeviceId();
      const response = await apiFetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: deviceId, wordId })
      });
      if (!response.ok) throw new Error('Failed to add favorite');
    } catch (error) {
      console.error('添加收藏失败:', error);
      throw new Error('添加收藏失败');
    }
  },

  async remove(wordId: number): Promise<void> {
    try {
      const deviceId = getDeviceId();
      const response = await apiFetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: deviceId, wordId })
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
    } catch (error) {
      console.error('取消收藏失败:', error);
      throw new Error('取消收藏失败');
    }
  },

  async getAll(): Promise<Word[]> {
    try {
      const deviceId = getDeviceId();
      const response = await apiFetch(`/api/favorites?userId=${encodeURIComponent(deviceId)}`);
      if (!response.ok) throw new Error('Failed to fetch favorites');
      return await response.json();
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      throw new Error('获取收藏列表失败');
    }
  }
};

// 学习进度相关API
export const progressService = {
  async updateProgress(wordId: number, isCorrect: boolean): Promise<void> {
    try {
      const deviceId = getDeviceId();
      const response = await apiFetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: deviceId, wordId, isCorrect })
      });
      if (!response.ok) throw new Error('Failed to update progress');
    } catch (error) {
      console.error('更新学习进度失败:', error);
      throw new Error('更新学习进度失败');
    }
  },

  async getStats(): Promise<{
    totalWords: number;
    learnedWords: number;
    masteredWords: number;
    favoriteWords: number;
  }> {
    try {
      const deviceId = getDeviceId();
      const response = await apiFetch(`/api/progress/stats?userId=${encodeURIComponent(deviceId)}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('获取学习统计失败:', error);
      throw new Error('获取学习统计失败');
    }
  }
}; 
