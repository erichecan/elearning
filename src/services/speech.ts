// 语音服务 - 使用Web Speech API
export class SpeechService {
  private synth: SpeechSynthesis;
  private defaultVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initVoices();
  }

  private initVoices() {
    // 等待语音加载完成
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // 优先选择英语语音
      this.defaultVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Natural')
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0] || null;
    };

    // 某些浏览器需要等待onvoiceschanged事件
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }

  /**
   * 播放英文单词发音
   * @param word 要发音的单词
   * @param options 发音选项
   */
  public speakWord(word: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      // 取消当前正在播放的语音
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      
      // 设置语音参数
      utterance.rate = options.rate ?? 0.8;  // 稍微慢一点，便于学习
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.lang = options.lang ?? 'en-US';
      
      if (this.defaultVoice) {
        utterance.voice = this.defaultVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis failed: ${event.error}`));

      this.synth.speak(utterance);
    });
  }

  /**
   * 播放中文翻译
   * @param chinese 中文翻译
   * @param options 发音选项
   */
  public speakChinese(chinese: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(chinese);
      
      utterance.rate = options.rate ?? 0.8;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.lang = 'zh-CN';

      // 尝试找到中文语音
      const voices = this.synth.getVoices();
      const chineseVoice = voices.find(voice => voice.lang.startsWith('zh'));
      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis failed: ${event.error}`));

      this.synth.speak(utterance);
    });
  }

  /**
   * 停止当前播放
   */
  public stop(): void {
    this.synth.cancel();
  }

  /**
   * 检查浏览器是否支持语音合成
   */
  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * 获取可用的语音列表
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }
}

// 创建单例实例
export const speechService = new SpeechService(); 