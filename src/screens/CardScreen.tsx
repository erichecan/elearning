import React, { useState } from 'react'
import { ArrowLeft, Volume2, Heart, RotateCcw, Play } from 'lucide-react'

interface CardScreenProps {
  word: any
  onBack: () => void
}

const CardScreen: React.FC<CardScreenProps> = ({ word, onBack }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showWord, setShowWord] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handlePlayAudio = () => {
    setIsPlaying(true)
    // 模拟音频播放
    setTimeout(() => setIsPlaying(false), 2000)
  }

  const toggleFavorite = () => {
    // 这里可以添加收藏逻辑
    console.log('Toggle favorite for card:', word.id)
  }

  // 模拟例句数据
  const sentences = [
    { english: `This is a ${word.word.toLowerCase()}.`, chinese: `这是一个${word.chinese}。` },
    { english: `I like ${word.word.toLowerCase()}.`, chinese: `我喜欢${word.chinese}。` }
  ]

  return (
    <div className="h-full w-full p-6 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center text-white">
          <h1 className="text-xl font-bold">卡片学习</h1>
          <p className="text-sm opacity-80">{word.category}</p>
        </div>
        <div className="w-12"></div> {/* 占位符保持居中 */}
      </div>

      {/* 卡片区域 */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div 
          className={`flip-card w-80 h-96 ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="flip-card-inner w-full h-full">
            {/* 卡片正面 */}
            <div className="flip-card-front bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-full flex flex-col">
                {/* 图片区域 */}
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={word.image}
                    alt={word.word}
                    className="w-full h-full object-cover"
                  />
                  {showWord && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h2 className="text-2xl font-bold text-white mb-1">{word.word}</h2>
                      <p className="text-sm text-white/80">/{word.word.toLowerCase()}/</p>
                    </div>
                  )}
                  
                  {/* 操作按钮 */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayAudio()
                      }}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                        isPlaying 
                          ? 'bg-green-500/80 text-white' 
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      {isPlaying ? <Play size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite()
                      }}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                        word.isFavorite 
                          ? 'bg-red-500/80 text-white' 
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Heart size={16} fill={word.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  {/* 显示控制按钮 */}
                  <div className="absolute bottom-3 left-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowWord(!showWord)
                      }}
                      className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs hover:bg-white/30 transition-all"
                    >
                      {showWord ? '隐藏单词' : '显示单词'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 卡片背面 */}
            <div className="flip-card-back bg-white rounded-2xl p-6 shadow-2xl flex flex-col">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{word.word}</h2>
                <p className="text-lg text-gray-600 mb-1">/{word.word.toLowerCase()}/</p>
                <p className="text-xl text-gray-700">{word.chinese}</p>
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-800 mb-3">例句</h3>
                {sentences.map((sentence, index) => (
                  <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-800 font-medium mb-1 text-sm">{sentence.english}</p>
                    <p className="text-gray-600 text-sm">{sentence.chinese}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部控制栏 */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleFlip}
          className="btn-primary flex items-center gap-2"
        >
          <RotateCcw size={20} />
          {isFlipped ? '查看图片' : '查看详情'}
        </button>
      </div>
    </div>
  )
}

export default CardScreen 