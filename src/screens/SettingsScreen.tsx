import React, { useState } from 'react'
import { ArrowLeft, Volume2, Eye, Clock, Palette, Shield, Info, Play } from 'lucide-react'
import { speechService } from '../services/speech'

interface SettingsScreenProps {
  onBack: () => void
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    autoPlay: true,
    showWord: true,
    showChinese: true,
    dailyLimit: 30,
    theme: 'auto',
    soundVolume: 80,
    speechRate: 0.8,
    speechPitch: 1.0,
    speechLang: 'en-US'
  })

  const [isTestingAudio, setIsTestingAudio] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const testAudio = async () => {
    if (!speechService.isSupported()) {
      alert('您的浏览器不支持语音播放功能')
      return
    }

    try {
      setIsTestingAudio(true)
      await speechService.speakWord('Hello', {
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        volume: settings.soundVolume / 100,
        lang: settings.speechLang
      })
    } catch (error) {
      console.error('音频测试失败:', error)
      alert('音频测试失败，请检查浏览器设置')
    } finally {
      setIsTestingAudio(false)
    }
  }

  return (
    <div className="h-full w-full p-6 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">设置</h1>
        </div>
        <div className="w-12"></div> {/* 占位符保持居中 */}
      </div>

      {/* 设置列表 */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* 学习设置 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Eye size={20} />
            学习设置
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">自动播放发音</p>
                <p className="text-white/60 text-sm">翻转卡片时自动播放单词发音</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoPlay}
                  onChange={(e) => handleSettingChange('autoPlay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">显示英文单词</p>
                <p className="text-white/60 text-sm">在图片下方显示英文单词</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showWord}
                  onChange={(e) => handleSettingChange('showWord', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">显示中文释义</p>
                <p className="text-white/60 text-sm">在卡片背面显示中文释义</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showChinese}
                  onChange={(e) => handleSettingChange('showChinese', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 时间设置 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={20} />
            时间设置
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-medium">每日学习时长限制</p>
                <span className="text-white text-sm">{settings.dailyLimit} 分钟</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="10"
                value={settings.dailyLimit}
                onChange={(e) => handleSettingChange('dailyLimit', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>10分钟</span>
                <span>120分钟</span>
              </div>
            </div>
          </div>
        </div>

        {/* 音频设置 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Volume2 size={20} />
            音频设置
          </h2>
          
          <div className="space-y-4">
            {/* 音量控制 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-medium">音量大小</p>
                <span className="text-white text-sm">{settings.soundVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={settings.soundVolume}
                onChange={(e) => handleSettingChange('soundVolume', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>静音</span>
                <span>最大</span>
              </div>
            </div>

            {/* 语速控制 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-medium">语速控制</p>
                <span className="text-white text-sm">{(settings.speechRate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => handleSettingChange('speechRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>慢速</span>
                <span>快速</span>
              </div>
            </div>

            {/* 音调控制 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-medium">音调高低</p>
                <span className="text-white text-sm">{(settings.speechPitch * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.speechPitch}
                onChange={(e) => handleSettingChange('speechPitch', parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>低音</span>
                <span>高音</span>
              </div>
            </div>

            {/* 语言选择 */}
            <div>
              <p className="text-white font-medium mb-2">语音语言</p>
              <select
                value={settings.speechLang}
                onChange={(e) => handleSettingChange('speechLang', e.target.value)}
                className="w-full p-2 bg-white/20 text-white rounded-lg border border-white/30 focus:border-blue-400 focus:outline-none"
              >
                <option value="en-US" className="text-black">English (US)</option>
                <option value="en-GB" className="text-black">English (UK)</option>
                <option value="en-AU" className="text-black">English (AU)</option>
                <option value="zh-CN" className="text-black">中文 (普通话)</option>
              </select>
            </div>

            {/* 音频测试 */}
            <div className="pt-2">
              <button
                onClick={testAudio}
                disabled={isTestingAudio}
                className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  isTestingAudio 
                    ? 'bg-green-500/50 cursor-not-allowed' 
                    : 'bg-blue-500/70 hover:bg-blue-500/90'
                } text-white font-medium`}
              >
                <Play size={16} />
                {isTestingAudio ? '正在播放...' : '测试语音 (Hello)'}
              </button>
            </div>
          </div>
        </div>

        {/* 主题设置 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Palette size={20} />
            主题设置
          </h2>
          
          <div className="space-y-3">
            {['auto', 'light', 'dark'].map((theme) => (
              <label key={theme} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  checked={settings.theme === theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="sr-only peer"
                />
                <div className={`w-4 h-4 border-2 rounded-full mr-3 ${
                  settings.theme === theme 
                    ? 'border-blue-400 bg-blue-400' 
                    : 'border-white/30'
                }`}></div>
                <span className="text-white capitalize">{theme === 'auto' ? '跟随系统' : theme === 'light' ? '浅色' : '深色'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 家长控制 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield size={20} />
            家长控制
          </h2>
          
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
              <p className="font-medium">内容筛选</p>
              <p className="text-sm opacity-60">设置孩子可以学习的内容分类</p>
            </button>
            
            <button className="w-full text-left p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
              <p className="font-medium">学习报告</p>
              <p className="text-sm opacity-60">查看孩子的学习进度和统计</p>
            </button>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Info size={20} />
            关于应用
          </h2>
          
          <div className="space-y-2 text-white/80">
            <p>版本: 1.0.0</p>
            <p>FlashCard Kids - 儿童英语认知学习</p>
            <p>专为6岁儿童设计的英语学习应用</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsScreen 