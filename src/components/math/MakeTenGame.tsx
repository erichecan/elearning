import React, { useState, useEffect } from 'react';
import { Star, RefreshCw, CheckCircle2 } from 'lucide-react';

interface MakeTenGameProps {
    onBack: () => void;
}

const MakeTenGame: React.FC<MakeTenGameProps> = ({ onBack }) => {
    const [initialCount, setInitialCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [level, setLevel] = useState(1);

    // Initialize a new round
    const startNewRound = () => {
        // Random number between 1 and 9
        const rand = Math.floor(Math.random() * 9) + 1;
        setInitialCount(rand);
        setUserCount(0);
        setIsSuccess(false);
    };

    useEffect(() => {
        startNewRound();
    }, [level]);

    useEffect(() => {
        if (initialCount + userCount === 10) {
            setIsSuccess(true);
        } else {
            setIsSuccess(false);
        }
    }, [userCount, initialCount]);

    const handleNext = () => {
        setLevel(prev => prev + 1);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full bg-blue-50 p-4">
            {/* Header / Score */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-8">
                <button onClick={onBack} className="text-gray-500 font-bold hover:text-blue-600">
                    Quit
                </button>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    <Star className="text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-700">Level {level}</span>
                </div>
            </div>

            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Make 10!</h1>
            <p className="text-blue-600 mb-8">Fill the grid to make 10 friends.</p>

            {/* Ten Frame Grid */}
            <div className="bg-white p-6 rounded-3xl shadow-float mb-8">
                <div className="grid grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, index) => {
                        const isInitial = index < initialCount;
                        const isUserFilled = index >= initialCount && index < (initialCount + userCount);

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    if (isUserFilled) setUserCount(prev => prev - 1);
                                    else if (!isInitial && !isUserFilled) setUserCount(prev => prev + 1);
                                }}
                                disabled={isInitial || isSuccess}
                                className={`
                            w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300
                            ${isInitial ? 'bg-blue-500 border-blue-600 cursor-not-allowed' : ''}
                            ${isUserFilled ? 'bg-green-400 border-green-500 scale-105 shadow-lg' : ''}
                            ${!isInitial && !isUserFilled ? 'bg-gray-100 border-gray-200 hover:border-green-300' : ''}
                        `}
                            >
                                {/* Icons */}
                                {(isInitial || isUserFilled) && (
                                    <div className="text-white font-bold text-2xl">
                                        {isInitial ? '🍎' : '🐸'}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Equation */}
            <div className="bg-white px-8 py-4 rounded-2xl shadow-sm mb-8 flex items-center gap-4 text-4xl font-bold text-gray-700">
                <span className="text-blue-500">{initialCount}</span>
                <span>+</span>
                <span className={`transition-colors ${isSuccess ? 'text-green-500 scale-110' : 'text-gray-400'}`}>
                    {Math.max(0, userCount)}
                </span>
                <span>=</span>
                <span>10</span>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={() => setUserCount(0)}
                    className="p-4 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors"
                    disabled={isSuccess}
                >
                    <RefreshCw />
                </button>

                {isSuccess && (
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-all font-bold flex items-center gap-2 animate-bounce"
                    >
                        Next Level <CheckCircle2 />
                    </button>
                )}
            </div>

            {/* Instructions */}
            {!isSuccess && (
                <p className="mt-8 text-gray-400 text-sm">Tap empty circles to add frogs!</p>
            )}
        </div>
    );
};

export default MakeTenGame;
