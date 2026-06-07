// 语音服务 - 使用Web Speech API
import { buildApiUrl } from './api-client'

export class SpeechService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initVoices();
  }

  private pickDefaultVoice() {
    const voices = this.synth.getVoices();
    return voices.find(voice =>
      voice.lang.startsWith('en') && voice.name.includes('Microsoft') && voice.name.includes('Online')
    ) || voices.find(voice =>
      voice.lang.startsWith('en') && voice.name.includes('Microsoft')
    ) || voices.find(voice =>
      voice.lang.startsWith('en') && voice.name.includes('Natural')
    ) || voices.find(voice =>
      voice.lang.startsWith('en')
    ) || voices[0] || null;
  }

  private initVoices() {
    // 等待语音加载完成
    const loadVoices = () => {
      this.pickDefaultVoice();
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

      const useEdgeTts = true;
      if (useEdgeTts) {
        fetch(buildApiUrl(`/api/tts?text=${encodeURIComponent(word)}`))
          .then((res) => res.json())
          .then((data) => {
            if (data?.url) {
              const audio = new Audio(buildApiUrl(data.url));
              audio.onended = () => resolve();
              audio.onerror = () => this.speakWithWebSpeech(word, options).then(resolve).catch(reject);
              audio.play().catch(() => this.speakWithWebSpeech(word, options).then(resolve).catch(reject));
            } else {
              this.speakWithWebSpeech(word, options).then(resolve).catch(reject);
            }
          })
          .catch(() => this.speakWithWebSpeech(word, options).then(resolve).catch(reject));
        return;
      }

      this.speakWithWebSpeech(word, options).then(resolve).catch(reject);
    });
  }

  private speakWithWebSpeech(word: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(word);

      // 设置语音参数
      utterance.rate = options.rate ?? 0.8;  // 稍微慢一点，便于学习
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.lang = options.lang ?? 'en-US';

      const preferred = this.pickDefaultVoice();
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis failed: ${event.error}`));

      this.synth.speak(utterance);
    });
  }

  /**
   * 播放预生成的音频文件（推荐使用）
   * @param audioUrl 音频文件URL
   * @param word 单词（用于备用语音合成）
   */
  public playAudio(audioUrl: string | null, word: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 如果有音频URL，使用预生成的MP3
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => resolve();
        audio.onerror = () => {
          // MP3加载失败，回退到语音合成
          console.warn('Audio file failed, falling back to speech synthesis');
          this.speakWord(word).then(resolve).catch(reject);
        };
        audio.play().catch(() => {
          // 播放失败，回退到语音合成
          this.speakWord(word).then(resolve).catch(reject);
        });
      } else {
        // 没有MP3，使用语音合成
        this.speakWord(word).then(resolve).catch(reject);
      }
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
