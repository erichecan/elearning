<template>
    <div class="app-container">
    <!-- 设置面板 -->
    <div v-if="showSettings" class="settings-overlay" @click="showSettings = false">
      <div class="settings-panel" @click.stop>
        <h3>设置 Settings</h3>
        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="showEnglishText" />
            默认显示英文文字 Show English Text by Default
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="autoPlay" />
            自动播放发音 Auto Play Pronunciation
          </label>
        </div>
        <button @click="showSettings = false" class="close-btn">关闭 Close</button>
          </div>
        </div>

    <!-- 设置按钮 -->
    <button class="settings-btn" @click="showSettings = true">⚙️</button>

    <!-- 彩色装饰SVG -->
    <svg class="decoration-svg top-left" viewBox="0 0 180 80">
      <path d="M0,40 Q40,0 180,20 Q120,80 0,40" fill="#ffe066"/>
      <circle cx="40" cy="60" r="8" fill="#eeb7e8"/>
      <g>
        <circle cx="30" cy="30" r="3" fill="#eeb7e8"/>
        <circle cx="38" cy="38" r="2" fill="#eeb7e8"/>
        <circle cx="50" cy="25" r="2.5" fill="#eeb7e8"/>
      </g>
    </svg>

    <svg class="decoration-svg bottom-left" viewBox="0 0 120 80">
      <path d="M0,80 Q60,0 120,60 Q80,80 0,80" fill="#1976d2"/>
      <ellipse cx="30" cy="60" rx="18" ry="10" fill="#43e0ff"/>
    </svg>

    <svg class="decoration-svg top-right" viewBox="0 0 140 90">
      <path d="M140,20 Q80,0 0,40 Q60,90 140,20" fill="#e91e63"/>
      <circle cx="90" cy="50" r="6" fill="#ffeb3b"/>
      <polygon points="110,35 115,20 120,35 135,30 125,45 140,50 125,55 135,70 120,65 115,80 110,65 95,70 105,55 90,50 105,45" fill="#ffeb3b"/>
    </svg>

    <svg class="decoration-svg bottom-right" viewBox="0 0 100 60">
      <ellipse cx="20" cy="40" rx="15" ry="8" fill="#81c784"/>
      <ellipse cx="50" cy="30" rx="20" ry="12" fill="#81c784"/>
      <ellipse cx="80" cy="45" rx="18" ry="10" fill="#81c784"/>
    </svg>

    <!-- 首页：分类选择 -->
    <div v-if="currentView === 'home'" class="home-container">
      <!-- 主banner -->
      <div class="main-banner">
        <div class="pre-k-tag">Pre-K</div>
        <h1>Guided Phonics</h1>
        <div class="subtitle">for Preschoolers</div>
      </div>

      <!-- 分类标题 -->
      <h2 class="category-title">Choose a Category</h2>

      <!-- 分类网格 -->
      <div class="category-grid">
        <div 
          v-for="cat in categories" 
          :key="cat.id" 
          @click="selectCategory(cat)"
          class="category-card"
          @mouseenter="onCardHover"
          @mouseleave="onCardLeave"
        >
          <div class="category-image">
            <img :src="getCategoryImage(cat.name)" :alt="cat.name" />
            </div>
          <div class="category-info">
            <div class="category-name">{{ cat.name }}</div>
            <div class="category-desc">{{ cat.description }}</div>
          </div>
          <div class="category-decorations">
            <div class="decoration decoration-1"></div>
            <div class="decoration decoration-2"></div>
          </div>
        </div>
          </div>
        </div>

    <!-- 学习页面：Flashcard -->
    <div v-else-if="currentView === 'learning'" class="learning-container">
      <!-- 顶部导航栏 -->
      <div class="learning-header">
        <button @click="goHome" class="back-btn">
          ← Back to Categories
        </button>
        <div class="category-info-header">
          <span class="category-icon">{{ selectedCategory.icon }}</span>
          <span class="category-name">{{ selectedCategory.name }}</span>
        </div>
        <div class="progress-indicator">
          {{ currentItemIndex + 1 }} / {{ currentItems.length }}
            </div>
          </div>

      <!-- 学习模式切换 -->
      <div class="mode-switcher">
        <button 
          @click="toggleLearningMode"
          class="mode-switch-btn"
        >
          Switch to {{ learningMode === 'words' ? 'Phrases' : 'Words' }}
        </button>
        <div class="current-mode">
          Current: {{ learningMode === 'words' ? 'Word Learning' : 'Phrase Learning' }}
        </div>
      </div>

      <!-- Flashcard区域 -->
      <div 
        v-if="currentItems.length > 0" 
        class="flashcard-area"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- 左侧导航按钮 - 只在学习页面且有多个项目时显示 -->
        <button 
          v-if="currentView === 'learning' && currentItems.length > 1"
          class="nav-btn nav-btn-left" 
          @click="previousItem" 
          :disabled="currentItemIndex === 0"
        >
          ‹
        </button>

        <!-- 卡片容器 -->
          <div class="flashcard-container">
          <div class="flashcard">
            <!-- 单词卡片 -->
            <div v-if="!isPhrase(currentItems[currentItemIndex])" class="word-card">
              <div class="card-image-container">
                <img 
                  :src="currentItems[currentItemIndex].image_url" 
                  :alt="currentItems[currentItemIndex].text"
                  class="card-image"
                  @error="handleImageError"
                />
                <!-- 发音按钮覆盖在图片上 -->
                <button class="audio-btn-overlay" @click="playAudio">
                  🔊
                </button>
              </div>
              
              <!-- 英文文字（可控制显示/隐藏） -->
              <div v-if="showEnglishText || textRevealed" class="word-text">
                {{ currentItems[currentItemIndex].text }}
              </div>
              
              <!-- 显示/隐藏文字按钮 -->
              <button v-if="!showEnglishText" @click="textRevealed = !textRevealed" class="reveal-btn">
                {{ textRevealed ? 'Hide Text' : 'Show Text' }}
              </button>
              
              <!-- 定义（如果有） -->
              <div v-if="currentItems[currentItemIndex].definition && (showEnglishText || textRevealed)" class="word-definition">
                {{ currentItems[currentItemIndex].definition }}
            </div>
          </div>

            <!-- 短句卡片 -->
            <div v-else class="phrase-card">
              <div class="phrase-content">
                <div class="phrase-text">
                  {{ currentItems[currentItemIndex].text }}
                </div>
                <div class="phrase-translation">
                  {{ currentItems[currentItemIndex].translation }}
                </div>
                <div v-if="currentItems[currentItemIndex].context" class="phrase-context">
                  {{ currentItems[currentItemIndex].context }}
                </div>
              </div>
              <button class="audio-btn-phrase" @click="playAudio">
                🔊 Play Sound
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧导航按钮 - 只在学习页面且有多个项目时显示 -->
        <button 
          v-if="currentView === 'learning' && currentItems.length > 1"
          class="nav-btn nav-btn-right" 
          @click="nextItem" 
          :disabled="currentItemIndex === currentItems.length - 1"
        >
          ›
        </button>
      </div>

      <!-- 底部导航按钮 - 只在学习页面且有多个项目时显示 -->
      <div class="bottom-nav" v-if="currentView === 'learning' && currentItems.length > 1">
        <button 
          @click="previousItem" 
          :disabled="currentItemIndex === 0"
          class="bottom-nav-btn"
        >
          ← Previous
        </button>
        
        <button 
          @click="nextItem" 
          :disabled="currentItemIndex === currentItems.length - 1"
          class="bottom-nav-btn"
        >
          Next →
        </button>
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
      showEnglishText: false, // 默认隐藏英文
      autoPlay: false,
      textRevealed: false, // 当前卡片是否显示文字
      touchStartX: 0,
      touchEndX: 0
    }
  },
  mounted() {
    this.fetchCategories();
    this.loadSettings();
  },
  watch: {
    currentItemIndex() {
      this.textRevealed = false; // 切换卡片时重置文字显示状态
      if (this.autoPlay) {
        setTimeout(() => this.playAudio(), 500);
      }
    },
    showEnglishText() {
      this.saveSettings();
    },
    autoPlay() {
      this.saveSettings();
    }
  },
  methods: {
    // 获取分类图片
    getCategoryImage(categoryName) {
      const createSVG = (text, color) => {
        const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${color}"/>
          <text x="50%" y="50%" font-size="32" fill="white" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif">${text}</text>
        </svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
      };
      
      const imageMap = {
        'Animals': createSVG('🐾 Animals', '#ff9800'),
        'Food': createSVG('🍎 Food', '#4caf50'),
        'Colors': createSVG('🌈 Colors', '#f44336'),
        'Body Parts': createSVG('👤 Body Parts', '#9c27b0'),
        'Numbers': createSVG('🔢 Numbers', '#2196f3'),
        'Family': createSVG('👨‍👩‍👧‍👦 Family', '#e91e63'),
        'Clothing': createSVG('👕 Clothing', '#607d8b'),
        'Transportation': createSVG('🚗 Transportation', '#795548'),
        'Home': createSVG('🏠 Home', '#ffc107'),
        'School': createSVG('🎓 School', '#009688'),
        'Sports': createSVG('⚽ Sports', '#8bc34a'),
        'Weather': createSVG('☀️ Weather', '#00bcd4'),
        'Useful Phrases': createSVG('💬 Phrases', '#ff5722'),
        'Greetings': createSVG('👋 Greetings', '#3f51b5'),
        'Feelings': createSVG('😊 Feelings', '#e91e63'),
        'Opposites': createSVG('↔️ Opposites', '#9e9e9e')
      };
      return imageMap[categoryName] || createSVG('📚 Learning', '#607d8b');
    },

    // 设置相关
    loadSettings() {
      const settings = localStorage.getItem('englishLearningSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.showEnglishText = parsed.showEnglishText || false;
        this.autoPlay = parsed.autoPlay || false;
      }
    },

    saveSettings() {
      const settings = {
        showEnglishText: this.showEnglishText,
        autoPlay: this.autoPlay
      };
      localStorage.setItem('englishLearningSettings', JSON.stringify(settings));
    },

    // 卡片悬停效果
    onCardHover(event) {
      event.target.style.transform = 'translateY(-8px) scale(1.05)';
    },

    onCardLeave(event) {
      event.target.style.transform = 'translateY(0) scale(1)';
    },

    // 触摸滑动
    onTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    },

    onTouchMove(event) {
      this.touchEndX = event.touches[0].clientX;
    },

    onTouchEnd() {
      const swipeThreshold = 50;
      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // 向左滑动 - 下一张
          this.nextItem();
        } else {
          // 向右滑动 - 上一张
          this.previousItem();
        }
      }
    },

    fetchCategories() {
      fetch('/api/learning/categories')
        .then(res => res.json())
        .then(data => {
          this.categories = data.data || [];
        })
        .catch(err => {
          console.error('获取分类失败:', err);
          alert('Failed to fetch categories');
        });
    },
    
    selectCategory(category) {
      this.selectedCategory = category;
      this.currentView = 'learning';
      this.currentItemIndex = 0;
      this.loadLearningItems();
    },
    
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
          alert(`Failed to fetch ${this.learningMode}`);
        });
    },
    
    toggleLearningMode() {
      this.learningMode = this.learningMode === 'words' ? 'phrases' : 'words';
      this.loadLearningItems();
    },
    
    isPhrase(item) {
      return item.translation && !item.image_url;
    },
    
    goHome() {
      this.currentView = 'home';
      this.selectedCategory = null;
      this.currentItems = [];
      this.currentItemIndex = 0;
    },
    
    nextItem() {
      if (this.currentItemIndex < this.currentItems.length - 1) {
        this.currentItemIndex++;
      }
    },
    
    previousItem() {
      if (this.currentItemIndex > 0) {
        this.currentItemIndex--;
      }
    },
    
    playAudio() {
      // 安全检查
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
      } else {
        alert('Speech synthesis not supported in this browser');
      }
    },
    
    handleImageError(event) {
      // 安全检查：确保数据存在
      if (this.currentItems && this.currentItems.length > 0 && 
          this.currentItemIndex >= 0 && this.currentItemIndex < this.currentItems.length) {
        const currentItem = this.currentItems[this.currentItemIndex];
        const text = currentItem && currentItem.text ? currentItem.text : 'Image';
        event.target.src = 'https://via.placeholder.com/400x300/42a5f5/ffffff?text=' + 
                          encodeURIComponent(text);
      } else {
        // 使用默认占位符
        event.target.src = 'https://via.placeholder.com/400x300/42a5f5/ffffff?text=Loading';
      }
    }
  }
}
</script>

<style scoped>
/* 全局容器和iPad自适应 */
.app-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%);
  font-family: 'Baloo 2', 'ZCOOL KuaiLe', 'Comic Sans MS', cursive, sans-serif;
  overflow-x: hidden;
}

/* 设置按钮 */
.settings-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  transform: scale(1.1);
  background: #fff;
}

/* 设置面板 */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.settings-panel {
  background: #fff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
}

.settings-panel h3 {
  margin: 0 0 20px 0;
  color: #1976d2;
  text-align: center;
  font-size: 1.5rem;
}

.setting-item {
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.setting-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
}

.setting-item input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
}

.close-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
}

/* 装饰SVG */
.decoration-svg {
  position: absolute;
  z-index: 1;
}

.decoration-svg.top-left {
  left: 0;
  top: 0;
  width: 180px;
  height: 80px;
}

.decoration-svg.bottom-left {
  left: 0;
  bottom: 0;
  width: 120px;
  height: 80px;
}

.decoration-svg.top-right {
  right: 0;
  top: 0;
  width: 140px;
  height: 90px;
}

.decoration-svg.bottom-right {
  right: 20px;
  bottom: 20px;
  width: 100px;
  height: 60px;
}

/* 首页样式 */
.home-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

/* iPad适配 */
@media (min-width: 768px) {
  .home-container {
  padding: 40px;
  }
}

.main-banner {
  background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
  color: #fff;
  padding: 30px;
  border-radius: 32px;
  text-align: center;
  margin: 20px 0 40px;
  box-shadow: 0 12px 40px rgba(41, 182, 246, 0.3);
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .main-banner {
    padding: 50px;
  }
}

.pre-k-tag {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #fff;
  color: #29b6f6;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.main-banner h1 {
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 0 #1976d2;
}

@media (min-width: 768px) {
  .main-banner h1 {
    font-size: 4rem;
  }
}

.subtitle {
  margin-top: 20px;
  font-size: 1.2rem;
  opacity: 0.9;
}

@media (min-width: 768px) {
  .subtitle {
    font-size: 1.8rem;
  }
}

.category-title {
  color: #1976d2;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 0 #fff;
  margin: 40px 0 30px;
  text-align: center;
}

@media (min-width: 768px) {
  .category-title {
    font-size: 3rem;
  }
}

/* 分类网格 - iPad优化 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

@media (min-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  }
}

.category-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  position: relative;
}

.category-image {
  width: 100%;
  height: 120px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .category-image {
    height: 150px;
  }
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
  padding: 15px;
  text-align: center;
}

@media (min-width: 768px) {
  .category-info {
    padding: 20px;
  }
}

.category-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 8px;
}

@media (min-width: 768px) {
  .category-name {
    font-size: 1.4rem;
  }
}

.category-desc {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

@media (min-width: 768px) {
  .category-desc {
    font-size: 0.95rem;
  }
}

.category-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.8;
}

.decoration-1 {
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  background: #ffeb3b;
}

.decoration-2 {
  bottom: -15px;
  left: -15px;
  width: 25px;
  height: 25px;
  background: #e91e63;
}

/* 学习页面样式 */
.learning-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  min-height: 100vh;
}

@media (min-width: 768px) {
  .learning-container {
    padding: 30px;
  }
}

.learning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.back-btn {
  background: #ff7043;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 112, 67, 0.3);
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
}

.category-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: #1976d2;
  font-weight: bold;
}

@media (min-width: 768px) {
  .category-info-header {
    font-size: 2rem;
  }
}

.progress-indicator {
  background: #e3f2fd;
  padding: 8px 16px;
  border-radius: 20px;
  color: #1976d2;
  font-weight: bold;
}

@media (min-width: 768px) {
  .progress-indicator {
    padding: 12px 24px;
    font-size: 1.1rem;
  }
}

.mode-switcher {
  text-align: center;
  margin-bottom: 30px;
}

.mode-switch-btn {
  background: #9c27b0;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
  margin-bottom: 10px;
}

.current-mode {
  color: #666;
  font-size: 0.9rem;
}

/* Flashcard区域 */
.flashcard-area {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  position: relative;
  touch-action: pan-y;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: absolute;
  z-index: 10;
}

@media (min-width: 768px) {
  .nav-btn {
    width: 60px;
    height: 60px;
    font-size: 2.5rem;
  }
}

.nav-btn:hover {
  transform: scale(1.1);
  background: #fff;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn-left {
  left: -25px;
}

.nav-btn-right {
  right: -25px;
}

@media (min-width: 768px) {
  .nav-btn-left {
    left: -30px;
  }
  
  .nav-btn-right {
    right: -30px;
  }
}

.flashcard-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .flashcard-container {
    max-width: 600px;
  }
}

.flashcard {
  background: #fff;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

@media (min-width: 768px) {
  .flashcard {
    padding: 40px;
  }
}

/* 单词卡片 */
.card-image-container {
  position: relative;
  margin-bottom: 20px;
}

.card-image {
  width: 100%;
  max-width: 400px;
  height: 250px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .card-image {
    height: 300px;
  }
}

.audio-btn-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.audio-btn-overlay:hover {
  transform: scale(1.1);
  background: #fff;
  }
  
  .word-text {
  font-size: 2rem;
  color: #1976d2;
  font-weight: bold;
  margin: 20px 0;
  text-shadow: 1px 1px 0 #e3f2fd;
}

@media (min-width: 768px) {
  .word-text {
    font-size: 2.5rem;
  }
}

.reveal-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin: 10px 0;
  font-size: 1rem;
}

.word-definition {
  color: #666;
  font-size: 1.1rem;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 12px;
  margin-top: 15px;
}

/* 短句卡片 */
.phrase-card {
  text-align: center;
}

.phrase-content {
  background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.phrase-text {
  font-size: 1.8rem;
  color: #1976d2;
  font-weight: bold;
  margin-bottom: 15px;
}

@media (min-width: 768px) {
  .phrase-text {
    font-size: 2.2rem;
  }
}

.phrase-translation {
  font-size: 1.3rem;
  color: #0277bd;
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
}

.phrase-context {
  background: #81c784;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.9rem;
  margin-top: 10px;
}

.audio-btn-phrase {
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.audio-btn-phrase:hover {
  transform: scale(1.05);
}

/* 底部导航 */
.bottom-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 20px;
}

.bottom-nav-btn {
  background: #ff7043;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 112, 67, 0.3);
  transition: all 0.3s ease;
  flex: 1;
}

.bottom-nav-btn:hover {
  transform: translateY(-2px);
}

.bottom-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .learning-header {
    flex-direction: column;
    text-align: center;
  }
  
  .flashcard-area {
    margin: 20px 0;
  }
  
  .nav-btn {
    display: none; /* 在小屏幕上隐藏侧边按钮，只保留底部按钮 */
  }
  
  .bottom-nav {
    flex-direction: column;
    gap: 15px;
  }
}
</style>

