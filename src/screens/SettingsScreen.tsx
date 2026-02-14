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
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const testAudio = async () => {
    if (!speechService.isSupported()) {
      alert('Browser does not support speech')
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
      console.error('Test failed:', error)
    } finally {
      setIsTestingAudio(false)
    }
  }

  return (
    <div className="h-full w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-3 bg-white text-secondary-600 rounded-2xl shadow-soft hover:shadow-md transition-all border border-secondary-50"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-2xl font-extrabold text-primary-900 tracking-tight">Parent Settings</h1>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-8 custom-scrollbar px-1">

        {/* Learning Settings */}
        <section className="bg-white rounded-3xl p-6 shadow-card border border-primary-50">
          <h2 className="text-lg font-bold text-primary-800 mb-6 flex items-center gap-2">
            <div className="p-2 bg-primary-100 rounded-xl text-primary-600"><Eye size={20} strokeWidth={2.5} /></div>
            Learning Experience
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-bold">Auto-play Audio</p>
                <p className="text-gray-400 text-sm font-medium">Hear pronunciation on flip</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoPlay}
                  onChange={(e) => handleSettingChange('autoPlay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:shadow-sm after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-bold">Show Text</p>
                <p className="text-gray-400 text-sm font-medium">Display English words</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showWord}
                  onChange={(e) => handleSettingChange('showWord', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:shadow-sm after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Audio Settings */}
        <section className="bg-white rounded-3xl p-6 shadow-card border border-primary-50">
          <h2 className="text-lg font-bold text-primary-800 mb-6 flex items-center gap-2">
            <div className="p-2 bg-secondary-100 rounded-xl text-secondary-600"><Volume2 size={20} strokeWidth={2.5} /></div>
            Sound & Speech
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-900 font-bold">Volume</span>
                <span className="text-secondary-500 font-bold">{settings.soundVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.soundVolume}
                onChange={(e) => handleSettingChange('soundVolume', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-secondary-500"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={testAudio}
                disabled={isTestingAudio}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl transition-all shadow-sm font-bold ${isTestingAudio
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-secondary-200'
                  }`}
              >
                <Play size={20} fill="currentColor" />
                {isTestingAudio ? 'Playing...' : 'Test Audio'}
              </button>
            </div>
          </div>
        </section>

        {/* Parent Control */}
        <section className="bg-white rounded-3xl p-6 shadow-card border border-primary-50">
          <h2 className="text-lg font-bold text-primary-800 mb-6 flex items-center gap-2">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-500"><Shield size={20} strokeWidth={2.5} /></div>
            Parent Controls
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="p-4 bg-gray-50 rounded-2xl text-left hover:bg-primary-50 hover:text-primary-700 transition-colors group">
              <p className="font-bold text-gray-900 group-hover:text-primary-900">Content Filter</p>
              <p className="text-sm text-gray-400 group-hover:text-primary-400/80">Restrict categories</p>
            </button>
            <button className="p-4 bg-gray-50 rounded-2xl text-left hover:bg-primary-50 hover:text-primary-700 transition-colors group">
              <p className="font-bold text-gray-900 group-hover:text-primary-900">Progress Report</p>
              <p className="text-sm text-gray-400 group-hover:text-primary-400/80">View learning stats</p>
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}

export default SettingsScreen