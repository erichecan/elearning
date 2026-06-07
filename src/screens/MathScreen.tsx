import React, { useState } from 'react';
import { ArrowLeft, Calculator, Grid, MoveRight } from 'lucide-react';
import MakeTenGame from '../components/math/MakeTenGame';
import CarryingGame from '../components/math/CarryingGame';
import { apiFetch } from '../services/api-client';
import { getActiveChildId } from '../services/child-context';

interface MathScreenProps {
    onBack: () => void;
}

type GameType = 'menu' | 'make-10' | 'carrying' | 'exercise';

const ExerciseGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [items, setItems] = useState<Array<{ id: number; question_text?: string; answer_payload?: any }>>([]);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [result, setResult] = useState<string>('');

    React.useEffect(() => {
        const childId = getActiveChildId();
        apiFetch(`/api/public/math-exercises${childId ? `?childId=${encodeURIComponent(childId)}` : ''}`)
            .then((res) => res.json())
            .then((data) => setItems(Array.isArray(data) ? data : []))
            .catch(() => setItems([]));
    }, []);

    const current = items[index];
    const expected = Number(current?.answer_payload?.value ?? NaN);

    const check = () => {
        const correct = Number(answer) === expected;
        setResult(correct ? '正确！' : `再试试（答案：${Number.isFinite(expected) ? expected : '-'})`);
        apiFetch('/api/analytics/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                child_id: null,
                event_type: correct ? 'math_exercise_correct' : 'math_exercise_wrong',
                event_payload: { exerciseId: current?.id }
            })
        }).catch(() => undefined);
    };

    return (
        <div className="h-full w-full bg-blue-50 flex flex-col p-4">
            <header className="flex items-center mb-6">
                <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm mr-4">
                    <ArrowLeft className="text-blue-500" />
                </button>
                <h1 className="text-2xl font-extrabold text-gray-800">题库训练</h1>
            </header>
            <div className="max-w-xl w-full mx-auto bg-white rounded-3xl p-6 shadow-card">
                {current ? (
                    <>
                        <div className="text-lg font-bold text-slate-800 mb-3">{current.question_text || '暂无题目文本'}</div>
                        <input
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full border rounded-xl px-3 py-2 mb-3"
                            placeholder="输入答案"
                        />
                        <div className="flex gap-2">
                            <button onClick={check} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold">提交</button>
                            <button onClick={() => { setIndex((prev) => (prev + 1) % items.length); setAnswer(''); setResult(''); }} className="px-4 py-2 rounded-xl bg-slate-100">下一题</button>
                        </div>
                        <div className="mt-3 text-sm font-semibold text-slate-600">{result}</div>
                    </>
                ) : (
                    <div className="text-slate-500 font-semibold">暂无公开题目，请在管理端发布题库。</div>
                )}
            </div>
        </div>
    );
};

const MathScreen: React.FC<MathScreenProps> = ({ onBack }) => {
    const [currentGame, setCurrentGame] = useState<GameType>('menu');

    if (currentGame === 'make-10') {
        return <MakeTenGame onBack={() => setCurrentGame('menu')} />;
    }

    if (currentGame === 'carrying') {
        return <CarryingGame onBack={() => setCurrentGame('menu')} />;
    }

    if (currentGame === 'exercise') {
        return <ExerciseGame onBack={() => setCurrentGame('menu')} />;
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

                <div
                    onClick={() => setCurrentGame('exercise')}
                    className="bg-white rounded-3xl p-6 shadow-card hover:shadow-float cursor-pointer hover:scale-105 transition-all border-b-4 border-emerald-100"
                >
                    <div className="h-40 bg-emerald-100 rounded-2xl mb-4 flex items-center justify-center">
                        <Calculator size={64} className="text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Exercise Bank</h3>
                    <p className="text-gray-500">Practice published math exercises from the parent panel.</p>
                </div>
            </div>
        </div>
    );
};

export default MathScreen;
