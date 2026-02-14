import React, { useState } from 'react';
import { ArrowLeft, Calculator, Grid, MoveRight } from 'lucide-react';
import MakeTenGame from '../components/math/MakeTenGame';
import CarryingGame from '../components/math/CarryingGame';

interface MathScreenProps {
    onBack: () => void;
}

type GameType = 'menu' | 'make-10' | 'carrying';

const MathScreen: React.FC<MathScreenProps> = ({ onBack }) => {
    const [currentGame, setCurrentGame] = useState<GameType>('menu');

    if (currentGame === 'make-10') {
        return <MakeTenGame onBack={() => setCurrentGame('menu')} />;
    }

    if (currentGame === 'carrying') {
        return <CarryingGame onBack={() => setCurrentGame('menu')} />;
    }

    return (
        <div className="h-full w-full bg-blue-50 flex flex-col p-4">
            {/* Header */}
            <header className="flex items-center mb-8">
                <button
                    onClick={onBack}
                    className="p-3 bg-white rounded-2xl shadow-sm hover:bg-blue-100 transition-colors mr-4"
                >
                    <ArrowLeft className="text-blue-500" />
                </button>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-sm">
                    <div className="bg-blue-100 p-2 rounded-xl">
                        <Calculator className="text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-800">Math Zone</h1>
                </div>
            </header>

            {/* Game Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
                {/* Make 10 Game Card */}
                <div
                    onClick={() => setCurrentGame('make-10')}
                    className="bg-white rounded-3xl p-6 shadow-card hover:shadow-float cursor-pointer hover:scale-105 transition-all border-b-4 border-blue-100"
                >
                    <div className="h-40 bg-blue-100 rounded-2xl mb-4 flex items-center justify-center">
                        <Grid size={64} className="text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Make 10</h3>
                    <p className="text-gray-500">Find the missing number to make a perfect 10!</p>
                </div>

                {/* Carrying Game Card */}
                <div
                    onClick={() => setCurrentGame('carrying')}
                    className="bg-white rounded-3xl p-6 shadow-card hover:shadow-float cursor-pointer hover:scale-105 transition-all border-b-4 border-purple-100"
                >
                    <div className="h-40 bg-purple-100 rounded-2xl mb-4 flex items-center justify-center">
                        <MoveRight size={64} className="text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Addition Adventure</h3>
                    <p className="text-gray-500">Learn how to carry numbers to the next column!</p>
                </div>
            </div>
        </div>
    );
};

export default MathScreen;
