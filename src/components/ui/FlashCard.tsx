import React, { useState } from 'react'
import { Volume2, RotateCw } from 'lucide-react'

interface FlashCardProps {
    word: string
    chinese: string
    phonetic?: string
    imageUrl?: string
    width?: string
    height?: string
    onFlip?: (isFlipped: boolean) => void
    onPlayAudio?: () => void
}

export const FlashCard: React.FC<FlashCardProps> = ({
    word,
    chinese,
    phonetic,
    imageUrl,
    width = 'w-full',
    height = 'h-96',
    onFlip,
    onPlayAudio
}) => {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        const newState = !isFlipped
        setIsFlipped(newState)
        onFlip?.(newState)
    }

    const handleAudioClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onPlayAudio?.()
    }

    return (
        <div className={`flip-card ${width} ${height} group perspective-1000`}>
            <div
                className={`flip-card-inner relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'flipped' : ''}`}
                onClick={handleFlip}
            >
                {/* Front Face */}
                <div className="flip-card-front absolute w-full h-full backface-hidden rounded-4xl bg-white shadow-float border-2 border-primary-50 flex flex-col overflow-hidden">
                    {/* Image Area */}
                    <div className="flex-1 relative bg-primary-50 p-6 flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={word}
                                className="w-full h-full object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <span className="text-6xl">🖼️</span>
                        )}
                        <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-full">
                            <RotateCw className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </div>
                    </div>

                    {/* Word Area */}
                    <div className="h-1/3 bg-white p-6 flex flex-col items-center justify-center relative">
                        <h2 className="text-4xl font-black text-primary-900 mb-2 tracking-tight">{word}</h2>
                        {phonetic && (
                            <span className="text-lg text-primary-400 font-mono bg-primary-50 px-3 py-1 rounded-full">
                                {phonetic}
                            </span>
                        )}

                        <button
                            onClick={handleAudioClick}
                            className="absolute -top-8 bg-accent-500 hover:bg-accent-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
                        >
                            <Volume2 size={28} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Back Face */}
                <div className="flip-card-back absolute w-full h-full backface-hidden rounded-4xl bg-gradient-to-br from-secondary-400 to-secondary-600 shadow-float rotate-y-180 flex flex-col items-center justify-center p-8 text-white border-2 border-secondary-300">
                    <div className="text-center">
                        <span className="text-6xl mb-6 block drop-shadow-md">✨</span>
                        <h3 className="text-2xl font-bold opacity-80 mb-2 uppercase tracking-widest">Meaning</h3>
                        <h2 className="text-6xl font-black mb-8 drop-shadow-md">{chinese}</h2>

                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 inline-block">
                            <p className="text-lg font-medium">Tap to flip back</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
