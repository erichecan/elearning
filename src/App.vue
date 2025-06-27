<template>
  <div class="app-container">
    <!-- iPad Pro 状态栏模拟 -->
    <div class="status-bar">
      <div class="status-left">
        <span class="time">9:41</span>
      </div>
      <div class="status-center">
        <div class="dynamic-island"></div>
      </div>
      <div class="status-right">
        <i class="fas fa-signal"></i>
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-three-quarters"></i>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 首页：分类选择 -->
      <div v-if="currentView === 'home'" class="home-view">
        <!-- 顶部导航栏 - 完全按照原型设计 -->
        <nav class="gradient-bg">
          <div class="nav-content">
            <div class="nav-left">
              <div class="nav-icon">
                <i class="fas fa-graduation-cap"></i>
              </div>
              <div class="nav-text">
                <h1 class="nav-title">English Learning</h1>
                <p class="nav-subtitle">Learn with fun activities</p>
              </div>
            </div>
            <div class="nav-right">
              <button class="nav-button">
                <i class="fas fa-search"></i>
              </button>
              <button class="nav-button" @click="showSettings = true">
                <i class="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </nav>

        <!-- 简化欢迎区域 - 完全按照原型 -->
        <section class="welcome-section">
          <div class="welcome-content">
            <h2 class="welcome-title">Choose Learning Category</h2>
            <p class="welcome-subtitle">Select a category you're interested in to start learning!</p>
            <!-- 调试信息 -->
            <p v-if="categories.length === 0" class="debug-info">Loading categories...</p>
            <p v-else class="debug-info">Found {{ categories.length }} categories, showing first 6</p>
          </div>
        </section>

        <!-- 分类网格 - 完全按照原型的2x3布局 -->
        <section class="categories-section">
          <div class="categories-grid-prototype">
            <div 
              v-for="(category, index) in displayCategories" 
              :key="category.id"
              class="category-card-prototype"
              @click="selectCategory(category)"
            >
              <div class="category-content">
                <div 
                  class="category-emoji-icon" 
                  :class="`gradient-bg-${index % 6}`"
                >
                  {{ getCategoryEmoji(category.name) }}
                </div>
                <h4 class="category-title-prototype">{{ category.name }}</h4>
                <p class="category-description">{{ getWordCount(category.id) }} fun words to learn</p>
                <img 
                  :src="getCategoryImageUrl(category.name)" 
                  :alt="category.name" 
                  class="category-image-prototype"
                  @error="handleImageError"
                />
                <button 
                  class="category-button-prototype"
                  :class="`gradient-button-${index % 6}`"
                  @click.stop="selectCategory(category)"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 底部导航 - 统一样式 -->
        <div class="bottom-navigation">
          <div class="nav-item active" @click="currentView = 'home'">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div class="nav-item" @click="currentView = 'learning'">
            <i class="fas fa-book-open"></i>
            <span>Learn</span>
          </div>
          <div class="nav-item" @click="currentView = 'practice'">
            <i class="fas fa-gamepad"></i>
            <span>Practice</span>
          </div>
          <div class="nav-item" @click="showSettings = true">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </div>
        </div>
      </div>

      <!-- 学习页面 -->
      <div v-else-if="currentView === 'learning'" class="learning-view">
        <!-- 学习页面顶部 -->
        <div class="learning-header">
          <button class="back-button" @click="goHome">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="learning-title">
            <h2>{{ selectedCategory?.name || 'Learning' }}</h2>
            <div class="progress-info">{{ currentItemIndex + 1 }} / {{ currentItems.length }}</div>
          </div>
          <button class="favorite-button">
            <i class="fas fa-heart"></i>
          </button>
        </div>

        <!-- 学习卡片 -->
        <div v-if="currentItems.length > 0" class="learning-card-container">
          <div class="learning-card">
            <div class="word-image-container">
              <img 
                :src="currentItems[currentItemIndex]?.image_url || 'https://via.placeholder.com/400x300'" 
                :alt="currentItems[currentItemIndex]?.text"
                class="word-image"
                @error="handleImageError"
              />
              <button class="audio-button" @click="playAudio">
                <i class="fas fa-volume-up"></i>
              </button>
            </div>
            
            <div class="word-content">
              <div v-if="showEnglishText || textRevealed" class="english-text">
                {{ currentItems[currentItemIndex]?.text }}
              </div>
              
              <button v-if="!showEnglishText" class="reveal-button" @click="textRevealed = !textRevealed">
                {{ textRevealed ? 'Hide Text' : 'Show Text' }}
              </button>
              
              <div v-if="currentItems[currentItemIndex]?.definition && (showEnglishText || textRevealed)" class="word-definition">
                {{ currentItems[currentItemIndex].definition }}
              </div>
            </div>
          </div>

          <!-- 导航按钮 -->
          <div class="navigation-buttons">
            <button 
              class="nav-btn prev-btn" 
              @click="previousItem" 
              :disabled="currentItemIndex === 0"
            >
              <i class="fas fa-chevron-left"></i>
              Previous
            </button>
            
            <button 
              class="nav-btn next-btn" 
              @click="nextItem" 
              :disabled="currentItemIndex === currentItems.length - 1"
            >
              Next
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- 底部导航 -->
        <div class="bottom-navigation">
          <div class="nav-item" @click="currentView = 'home'">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div class="nav-item active">
            <i class="fas fa-book-open"></i>
            <span>Learn</span>
          </div>
          <div class="nav-item" @click="currentView = 'practice'">
            <i class="fas fa-gamepad"></i>
            <span>Practice</span>
          </div>
          <div class="nav-item" @click="showSettings = true">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </div>
        </div>
      </div>

      <!-- 练习页面 -->
      <div v-else-if="currentView === 'practice'" class="practice-view">
        <!-- 练习页面标题 -->
        <div class="practice-header">
          <h2>Practice Time!</h2>
          <p>Test your knowledge with fun games</p>
        </div>

        <!-- 练习游戏选项 -->
        <div class="practice-games">
          <div class="game-card" @click="startGame('matching')">
            <div class="game-icon">
              <i class="fas fa-puzzle-piece"></i>
            </div>
            <h3>Word Matching</h3>
            <p>Match words with pictures</p>
          </div>

          <div class="game-card" @click="startGame('quiz')">
            <div class="game-icon">
              <i class="fas fa-question-circle"></i>
            </div>
            <h3>Picture Quiz</h3>
            <p>Choose the correct word</p>
          </div>

          <div class="game-card" @click="startGame('memory')">
            <div class="game-icon">
              <i class="fas fa-brain"></i>
            </div>
            <h3>Memory Game</h3>
            <p>Find matching pairs</p>
          </div>

          <div class="game-card" @click="startGame('spelling')">
            <div class="game-icon">
              <i class="fas fa-spell-check"></i>
            </div>
            <h3>Spelling Challenge</h3>
            <p>Spell the words correctly</p>
          </div>
        </div>

        <!-- 底部导航 -->
        <div class="bottom-navigation">
          <div class="nav-item" @click="currentView = 'home'">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div class="nav-item" @click="currentView = 'learning'">
            <i class="fas fa-book-open"></i>
            <span>Learn</span>
          </div>
          <div class="nav-item active">
            <i class="fas fa-gamepad"></i>
            <span>Practice</span>
          </div>
          <div class="nav-item" @click="showSettings = true">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置模态框 -->
    <div v-if="showSettings" class="settings-modal" @click.self="showSettings = false">
      <div class="settings-content">
        <div class="settings-header">
          <h3>Settings</h3>
          <button class="close-button" @click="showSettings = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="settings-body">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Show English Text by Default</h4>
              <p>Always display English text without tapping</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="showEnglishText">
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4>Auto Play Pronunciation</h4>
              <p>Automatically play audio when changing words</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="autoPlay">
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h4>Learning Mode</h4>
              <p>Choose between words or phrases</p>
            </div>
            <select v-model="learningMode" class="mode-select">
              <option value="words">Words</option>
              <option value="phrases">Phrases</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      categories: [],
      currentView: 'home',
      selectedCategory: null,
      currentItems: [],
      currentItemIndex: 0,
      learningMode: 'words',
      showSettings: false,
      showEnglishText: false,
      autoPlay: false,
      textRevealed: false,
      wordCounts: {}
    }
  },
  computed: {
    displayCategories() {
      // 安全地返回前6个分类
      if (Array.isArray(this.categories) && this.categories.length > 0) {
        return this.categories.slice(0, 6);
      }
      return [];
    }
  },
  mounted() {
    console.log('应用启动，开始获取分类数据...');
    this.fetchCategories();
    this.loadSettings();
  },
  watch: {
    currentItemIndex() {
      this.textRevealed = false;
      if (this.autoPlay) {
        setTimeout(() => this.playAudio(), 500);
      }
    },
    showEnglishText() {
      this.saveSettings();
    },
    autoPlay() {
      this.saveSettings();
    },
    learningMode() {
      if (this.selectedCategory) {
        this.loadLearningItems();
      }
    }
  },
  methods: {
    // 获取分类表情符号
    getCategoryEmoji(categoryName) {
      const emojiMap = {
        'Animals': '🐾',
        'Food': '🍎', 
        'Colors': '🎨',
        'Body Parts': '👋',
        'Numbers': '🔢',
        'Family': '🏠',
        'Clothing': '👕',
        'Transportation': '🚗',
        'Home': '🏡',
        'School': '🏫',
        'Sports': '⚽',
        'Weather': '☀️',
        'Fruits': '🍓',
        'Vegetables': '🥕',
        'Toys': '🧸',
        'Shapes': '⭐',
        'Nature': '🌳'
      };
      return emojiMap[categoryName] || '📚';
    },

    // 获取分类图片URL
    getCategoryImageUrl(categoryName) {
      const imageMap = {
        'Animals': 'https://images.unsplash.com/photo-1574870111867-089730e5a72c?w=300&h=200&fit=crop',
        'Food': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=200&fit=crop',
        'Colors': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        'Body Parts': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
        'Numbers': 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=300&h=200&fit=crop',
        'Family': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=200&fit=crop',
        'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
        'Transportation': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
        'Home': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
        'School': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=200&fit=crop',
        'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        'Weather': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=300&h=200&fit=crop',
        'Fruits': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=200&fit=crop',
        'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
        'Toys': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=200&fit=crop',
        'Shapes': 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=300&h=200&fit=crop',
        'Nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop'
      };
      return imageMap[categoryName] || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop';
    },

    // 获取单词数量
    getWordCount(categoryId) {
      return this.wordCounts[categoryId] || '0';
    },

    // 加载设置
    loadSettings() {
      const settings = localStorage.getItem('englishLearningSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.showEnglishText = parsed.showEnglishText || false;
        this.autoPlay = parsed.autoPlay || false;
        this.learningMode = parsed.learningMode || 'words';
      }
    },

    // 保存设置
    saveSettings() {
      const settings = {
        showEnglishText: this.showEnglishText,
        autoPlay: this.autoPlay,
        learningMode: this.learningMode
      };
      localStorage.setItem('englishLearningSettings', JSON.stringify(settings));
    },

    // 获取分类数据
    fetchCategories() {
      fetch('http://localhost:5001/api/learning/categories')
        .then(res => res.json())
        .then(response => {
          // 后端返回格式: {data: [...], success: true}
          const data = response.data || response;
          this.categories = Array.isArray(data) ? data : [];
          // 获取每个分类的单词数量
          this.categories.forEach(category => {
            this.fetchWordCount(category.id);
          });
        })
        .catch(err => {
          console.error('获取分类失败:', err);
          this.categories = [];
        });
    },

    // 获取单词数量 - 修复Vue 3兼容性
    fetchWordCount(categoryId) {
      fetch(`http://localhost:5001/api/learning/categories/${categoryId}/words`)
        .then(res => res.json())
        .then(response => {
          // 处理可能的不同数据格式
          const data = response.data || response;
          this.wordCounts[categoryId] = (Array.isArray(data) ? data : []).length;
        })
        .catch(err => {
          console.error('获取单词数量失败:', err);
        });
    },

    // 选择分类
    selectCategory(category) {
      console.log('选择分类:', category);
      this.selectedCategory = category;
      this.currentView = 'learning';
      this.currentItemIndex = 0;
      this.loadLearningItems();
    },

    // 加载学习内容
    loadLearningItems() {
      const endpoint = this.learningMode === 'words' 
        ? `http://localhost:5001/api/learning/categories/${this.selectedCategory.id}/words`
        : `http://localhost:5001/api/learning/categories/${this.selectedCategory.id}/phrases`;
        
      console.log('加载学习内容:', endpoint);
      fetch(endpoint)
        .then(res => res.json())
        .then(response => {
          // 处理可能的不同数据格式
          const data = response.data || response;
          this.currentItems = Array.isArray(data) ? data : [];
          this.currentItemIndex = 0;
          console.log('加载的学习内容:', this.currentItems);
          if (this.currentItems.length === 0) {
            alert(`No ${this.learningMode} found in this category.`);
          }
        })
        .catch(err => {
          console.error(`获取${this.learningMode}失败:`, err);
          this.currentItems = [];
        });
    },

    // 返回首页
    goHome() {
      this.currentView = 'home';
      this.selectedCategory = null;
      this.currentItems = [];
      this.currentItemIndex = 0;
    },

    // 下一个单词
    nextItem() {
      if (this.currentItemIndex < this.currentItems.length - 1) {
        this.currentItemIndex++;
      }
    },

    // 上一个单词
    previousItem() {
      if (this.currentItemIndex > 0) {
        this.currentItemIndex--;
      }
    },

    // 播放音频
    playAudio() {
      if (!this.currentItems || this.currentItems.length === 0 || 
          this.currentItemIndex < 0 || this.currentItemIndex >= this.currentItems.length) {
        return;
      }
      
      const currentItem = this.currentItems[this.currentItemIndex];
      const textToSpeak = currentItem && currentItem.text ? currentItem.text : '';
      
      if (!textToSpeak) {
        return;
      }
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
      }
    },

    // 处理图片错误
    handleImageError(event) {
      if (this.currentItems && this.currentItems.length > 0 && 
          this.currentItemIndex >= 0 && this.currentItemIndex < this.currentItems.length) {
        const currentItem = this.currentItems[this.currentItemIndex];
        const text = currentItem && currentItem.text ? currentItem.text : 'Image';
        event.target.src = 'https://via.placeholder.com/400x300/42a5f5/ffffff?text=' + encodeURIComponent(text);
      }
    },

    // 开始游戏
    startGame(gameType) {
      alert(`Starting ${gameType} game! This feature will be added soon.`);
    }
  }
}
</script>

<style scoped>
/* 基础字体设置 - 使用系统字体，不使用Google Fonts */
* {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 应用容器 */
.app-container {
  height: 100vh;
  background: linear-gradient(to bottom right, #e3f2fd, #f3e5f5, #fce4ec);
  overflow: hidden;
}

/* iPad Pro 状态栏 */
.status-bar {
  height: 44px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.status-left .time {
  font-weight: 600;
}

.dynamic-island {
  width: 126px;
  height: 37px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 19px;
}

.status-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 主内容区域 */
.main-content {
  height: calc(100vh - 44px);
  background: white;
  overflow-y: auto;
}

/* 首页样式 - 完全按照原型设计 */
.home-view {
  min-height: calc(100vh - 44px);
  background: linear-gradient(to bottom right, #e3f2fd, #f3e5f5, #fce4ec);
}

/* 顶部导航栏 - 复刻原型 */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
  color: white;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.nav-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  line-height: 1;
}

.nav-subtitle {
  font-size: 13px;
  opacity: 0.9;
  margin: 2px 0 0 0;
  line-height: 1;
}

.nav-right {
  display: flex;
  gap: 16px;
}

.nav-button {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* 欢迎区域 - 复刻原型 */
.welcome-section {
  padding: 24px;
}

.welcome-content {
  text-align: center;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.debug-info {
  color: #667eea;
  font-size: 14px;
  margin: 10px 0 0 0;
  font-weight: 500;
}

/* 分类区域 - 复刻原型 */
.categories-section {
  padding: 0 24px 32px;
}

/* 分类网格 - 完全按照原型的2x3布局 */
.categories-grid-prototype {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

/* 分类卡片 - 完全复刻原型设计 */
.category-card-prototype {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  border: 2px solid transparent;
}

.category-card-prototype:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.category-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 表情图标 - 复刻原型 */
.category-emoji-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
  color: white;
}

/* 不同分类的渐变背景 */
.gradient-bg-0 { background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%); }
.gradient-bg-1 { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); }
.gradient-bg-2 { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
.gradient-bg-3 { background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%); }
.gradient-bg-4 { background: linear-gradient(135deg, #26c6da 0%, #00acc1 100%); }
.gradient-bg-5 { background: linear-gradient(135deg, #ec407a 0%, #d81b60 100%); }

.category-title-prototype {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.category-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 16px 0;
}

/* 分类图片 - 复刻原型 */
.category-image-prototype {
  width: 100%;
  height: 96px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

/* 开始学习按钮 - 复刻原型 */
.category-button-prototype {
  width: 100%;
  color: white;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.gradient-button-0 { background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%); }
.gradient-button-1 { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); }
.gradient-button-2 { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
.gradient-button-3 { background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%); }
.gradient-button-4 { background: linear-gradient(135deg, #26c6da 0%, #00acc1 100%); }
.gradient-button-5 { background: linear-gradient(135deg, #ec407a 0%, #d81b60 100%); }

/* 底部导航 */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  padding: 15px 0 25px;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #999;
}

.nav-item.active {
  color: #667eea;
}

.nav-item span {
  font-size: 0.8rem;
  font-weight: 500;
}

.nav-item i {
  font-size: 1.5rem;
}

/* 设置模态框样式 */
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.settings-content {
  background: white;
  border-radius: 25px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #eee;
}

.settings-header h3 {
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f8f9fa;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #667eea;
  color: white;
}

.settings-body {
  padding: 30px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-info h4 {
  color: #333;
  margin-bottom: 5px;
}

.setting-info p {
  color: #666;
  font-size: 0.9rem;
}

/* 切换开关 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.mode-select {
  padding: 10px 15px;
  border: 2px solid #eee;
  border-radius: 10px;
  background: white;
  color: #333;
  font-weight: 500;
  cursor: pointer;
}

.mode-select:focus {
  border-color: #667eea;
  outline: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .practice-games {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .categories-grid-prototype {
    gap: 16px;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: 15px;
  }
}

/* 学习页面样式 */
.learning-view {
  padding: 20px 30px 120px;
  min-height: calc(100vh - 44px);
}

.learning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.back-button, .favorite-button {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  border: none;
  background: #f8f9fa;
  color: #667eea;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover, .favorite-button:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.learning-title {
  text-align: center;
}

.learning-title h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 5px;
}

.progress-info {
  color: #667eea;
  font-weight: 500;
}

/* 学习卡片 */
.learning-card-container {
  max-width: 600px;
  margin: 0 auto;
}

.learning-card {
  background: white;
  border-radius: 25px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 40px;
}

.word-image-container {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.word-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audio-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-button:hover {
  background: #667eea;
  transform: scale(1.1);
}

.word-content {
  padding: 30px;
  text-align: center;
}

.english-text {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.reveal-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.reveal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.word-definition {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.nav-btn {
  flex: 1;
  padding: 15px 25px;
  border: none;
  border-radius: 15px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.prev-btn {
  background: #f8f9fa;
  color: #667eea;
}

.next-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 练习页面样式 */
.practice-view {
  padding: 40px 30px 120px;
  min-height: calc(100vh - 44px);
}

.practice-header {
  text-align: center;
  margin-bottom: 50px;
}

.practice-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 10px;
}

.practice-header p {
  color: #666;
  font-size: 1.1rem;
}

.practice-games {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  max-width: 800px;
  margin: 0 auto;
}

.game-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.game-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
}

.game-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.game-card p {
  color: #666;
  font-size: 0.9rem;
}

/* 底部导航 */
</style>

