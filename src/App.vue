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
        <!-- 顶部标题区域 -->
        <div class="header-section">
          <h1 class="app-title">English Learning for Kids</h1>
          <p class="app-subtitle">Choose a category to start learning!</p>
        </div>

        <!-- 分类网格 -->
        <div class="categories-grid">
          <div 
            v-for="category in categories.slice(0, 6)" 
            :key="category.id"
            class="category-card"
            @click="selectCategory(category)"
          >
            <div class="category-image">
              <img :src="getCategoryImageUrl(category.name)" :alt="category.name" />
            </div>
            <div class="category-info">
              <h3 class="category-name">{{ category.name }}</h3>
              <p class="category-count">{{ getWordCount(category.id) }} words</p>
            </div>
          </div>
        </div>

        <!-- 底部导航 -->
        <div class="bottom-navigation">
          <div class="nav-item active" @click="currentView = 'home'">
            <i class="fas fa-home text-2xl"></i>
            <span>Home</span>
          </div>
          <div class="nav-item" @click="currentView = 'learning'">
            <i class="fas fa-book-open text-2xl"></i>
            <span>Learn</span>
          </div>
          <div class="nav-item" @click="currentView = 'practice'">
            <i class="fas fa-gamepad text-2xl"></i>
            <span>Practice</span>
          </div>
          <div class="nav-item" @click="showSettings = true">
            <i class="fas fa-cog text-2xl"></i>
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
            <i class="fas fa-home text-2xl"></i>
            <span>Home</span>
          </div>
          <div class="nav-item active">
            <i class="fas fa-book-open text-2xl"></i>
            <span>Learn</span>
          </div>
          <div class="nav-item" @click="currentView = 'practice'">
            <i class="fas fa-gamepad text-2xl"></i>
            <span>Practice</span>
          </div>
          <div class="nav-item" @click="showSettings = true">
            <i class="fas fa-cog text-2xl"></i>
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
            <i class="fas fa-home text-2xl"></i>
            <span>Home</span>
          </div>
          <div class="nav-item" @click="currentView = 'learning'">
            <i class="fas fa-book-open text-2xl"></i>
            <span>Learn</span>
          </div>
          <div class="nav-item active">
            <i class="fas fa-gamepad text-2xl"></i>
            <span>Practice</span>
          </div>
          <div class="nav-item" @click="showSettings = true">
            <i class="fas fa-cog text-2xl"></i>
            <span>Settings</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置模态框 -->
    <div v-if="showSettings" class="settings-modal" @click="showSettings = false">
      <div class="settings-content" @click.stop>
        <div class="settings-header">
          <h3>Settings</h3>
          <button class="close-button" @click="showSettings = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="settings-body">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Show English Text</h4>
              <p>Display English words by default</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="showEnglishText">
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>Auto Play Sound</h4>
              <p>Automatically play pronunciation</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="autoPlay">
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>Learning Mode</h4>
              <p>Switch between words and phrases</p>
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
  mounted() {
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
    // 获取分类图片URL
    getCategoryImageUrl(categoryName) {
      const imageMap = {
        'Animals': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=200&fit=crop',
        'Food': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
        'Colors': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=200&fit=crop',
        'Body Parts': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
        'Numbers': 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=300&h=200&fit=crop',
        'Family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=200&fit=crop',
        'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
        'Transportation': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
        'Home': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
        'School': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=200&fit=crop',
        'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        'Weather': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=300&h=200&fit=crop'
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
      fetch('/api/learning/categories')
        .then(res => res.json())
        .then(data => {
          this.categories = data.data || [];
          // 获取每个分类的单词数量
          this.categories.forEach(category => {
            this.fetchWordCount(category.id);
          });
        })
        .catch(err => {
          console.error('获取分类失败:', err);
        });
    },

    // 获取单词数量
    fetchWordCount(categoryId) {
      fetch(`/api/learning/categories/${categoryId}/words`)
        .then(res => res.json())
        .then(data => {
          this.$set(this.wordCounts, categoryId, (data.data || []).length);
        })
        .catch(err => {
          console.error('获取单词数量失败:', err);
        });
    },

    // 选择分类
    selectCategory(category) {
      this.selectedCategory = category;
      this.currentView = 'learning';
      this.currentItemIndex = 0;
      this.loadLearningItems();
    },

    // 加载学习内容
    loadLearningItems() {
      const endpoint = this.learningMode === 'words' 
        ? `/api/learning/categories/${this.selectedCategory.id}/words`
        : `/api/learning/categories/${this.selectedCategory.id}/phrases`;
        
      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          this.currentItems = data.data || [];
          this.currentItemIndex = 0;
          if (this.currentItems.length === 0) {
            alert(`No ${this.learningMode} found in this category.`);
          }
        })
        .catch(err => {
          console.error(`获取${this.learningMode}失败:`, err);
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
        event.target.src = 'https://via.placeholder.com/400x300/42a5f5/ffffff?text=' + 
                          encodeURIComponent(text);
      }
    },

    // 开始游戏
    startGame(gameType) {
      alert(`${gameType} game will be implemented in future version!`);
    }
  }
}
</script>

<style scoped>
/* 引入字体 */
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
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

/* 首页样式 */
.home-view {
  padding: 40px 30px 120px;
  min-height: calc(100vh - 44px);
}

.header-section {
  text-align: center;
  margin-bottom: 50px;
}

.app-title {
  font-family: 'Fredoka One', cursive;
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.app-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

/* 分类网格 */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  max-width: 800px;
  margin: 0 auto;
}

.category-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.category-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.category-image {
  height: 150px;
  overflow: hidden;
  position: relative;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image img {
  transform: scale(1.1);
}

.category-info {
  padding: 20px;
  text-align: center;
}

.category-name {
  font-weight: 600;
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 8px;
}

.category-count {
  color: #667eea;
  font-weight: 500;
  font-size: 0.9rem;
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
  background: rgba(102, 126, 234, 0.9);
  color: white;
  border: none;
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
  font-family: 'Fredoka One', cursive;
}

.reveal-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.reveal-button:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.word-definition {
  color: #666;
  font-style: italic;
  line-height: 1.6;
}

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.nav-btn {
  flex: 1;
  padding: 15px 25px;
  border: none;
  border-radius: 15px;
  font-weight: 600;
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
  background: #667eea;
  color: white;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
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
  font-family: 'Fredoka One', cursive;
  font-size: 2.5rem;
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

/* 设置模态框 */
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
  .app-title {
    font-size: 2.2rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .practice-games {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .home-view, .learning-view, .practice-view {
    padding: 20px 20px 120px;
  }
}

/* 添加动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.category-card, .game-card, .learning-card {
  animation: fadeIn 0.6s ease-out;
}

/* 文本选择样式 */
.text-2xl {
  font-size: 1.5rem;
}
</style>

