import React, { useState, useEffect } from 'react';
import { ArrowRight, Box, ArrowDown } from 'lucide-react';

interface CarryingGameProps {
    onBack: () => void;
}

const CarryingGame: React.FC<CarryingGameProps> = ({ onBack }) => {
    const [num1, setNum1] = useState(0); // e.g. 15
    const [num2, setNum2] = useState(0); // e.g. 7
    const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
    // 0: Init, 1: Combine Ones, 2: Regroup (Carry), 3: Final Answer

    const startNewRound = () => {
        // Generate problem requiring carry
        // Ones digit of num1 + num2 >= 10
        const tens1 = Math.floor(Math.random() * 2) + 1; // 1 or 2 (10-20s)
        const ones1 = Math.floor(Math.random() * 4) + 6; // 6-9
        const ones2 = Math.floor(Math.random() * 5) + (10 - ones1); // ensure sum >= 10

        setNum1(tens1 * 10 + ones1);
        setNum2(ones2);
        setStep(0);
    };

    useEffect(() => {
        startNewRound();
    }, []);

    const tens1 = Math.floor(num1 / 10);
    const ones1 = num1 % 10;
    const ones2 = num2;

    const totalOnes = ones1 + ones2;
    const newTens = tens1 + 1;
    const newOnes = totalOnes - 10;

    return (
        <div className="flex flex-col items-center justify-center min-h-full bg-purple-50 p-4">
            <div className="w-full max-w-2xl flex justify-between items-center mb-8">
                <button onClick={onBack} className="text-gray-500 font-bold hover:text-purple-600">
                    Quit
                </button>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm text-purple-600 font-bold">
                    Addition Adventure
                </div>
            </div>

            <div className="flex gap-8 mb-8">
                {/* Visual Board */}
                <div className="bg-white p-6 rounded-3xl shadow-lg flex gap-4">
                    {/* Tens Column */}
                    <div className="flex flex-col items-center w-24 border-r-2 border-dashed border-gray-200 pr-4">
                        <h3 className="text-gray-400 font-bold mb-4">TENS</h3>
                        <div className="flex flex-col-reverse gap-2 min-h-[150px]">
                            {/* Existing Tens */}
                            {Array.from({ length: tens1 }).map((_, i) => (
                                <div key={`t1-${i}`} className="w-8 h-20 bg-blue-500 rounded border-2 border-blue-600"></div>
                            ))}
                            {/* Carried Ten */}
                            {step >= 2 && (
                                <div className="w-8 h-20 bg-green-500 rounded border-2 border-green-600 animate-bounce"></div>
                            )}
                        </div>
                        <div className="mt-4 text-2xl font-bold text-gray-700">
                            {step >= 2 ? newTens : tens1}
                        </div>
                    </div>

                    {/* Ones Column */}
                    <div className="flex flex-col items-center w-32">
                        <h3 className="text-gray-400 font-bold mb-4">ONES</h3>
                        <div className="flex flex-wrap gap-2 content-end min-h-[150px] w-full justify-center p-2 relative">

                            {/* Ones from Num1 */}
                            {step < 2 && Array.from({ length: ones1 }).map((_, i) => (
                                <div key={`o1-${i}`} className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500"></div>
                            ))}

                            {/* Ones from Num2 */}
                            {step < 2 && Array.from({ length: ones2 }).map((_, i) => (
                                <div key={`o2-${i}`} className="w-6 h-6 bg-orange-400 rounded-full border-2 border-orange-500"></div>
                            ))}

                            {/* Regrouping Visual */}
                            {step >= 2 && (
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {/* Remaining Ones */}
                                    {Array.from({ length: newOnes }).map((_, i) => (
                                        <div key={`rem-${i}`} className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500"></div>
                                    ))}
                                </div>
                            )}

                            {/* The Group that flies away */}
                            {step === 1 && (
                                <div className="absolute inset-0 border-4 border-green-400 rounded-xl bg-green-50/50 flex items-center justify-center animate-pulse">
                                    <span className="bg-white px-2 py-1 rounded text-green-600 font-bold shadow">10 Ones!</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 text-2xl font-bold text-gray-700">
                            {step >= 2 ? newOnes : totalOnes}
                        </div>
                    </div>
                </div>

                {/* Vertical Math */}
                <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center text-4xl font-mono font-bold text-gray-700 w-32">
                    <div className="flex flex-col items-end w-full">
                        <div>{num1}</div>
                        <div className="border-b-4 border-gray-700 w-full text-right flex justify-end gap-2">
                            <span>+</span> {num2}
                        </div>
                        <div className="pt-2 text-purple-600">
                            {step === 3 ? (num1 + num2) : '?'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 w-full max-w-md">
                {step === 0 && (
                    <button
                        onClick={() => setStep(1)}
                        className="w-full py-4 bg-purple-500 text-white rounded-2xl font-bold text-xl shadow-float hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
                    >
                        Add Ones <ArrowDown />
                    </button>
                )}

                {step === 1 && (
                    <button
                        onClick={() => setStep(2)}
                        className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-xl shadow-float hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                        Group 10 & Move <ArrowRight />
                    </button>
                )}

                {step === 2 && (
                    <button
                        onClick={() => setStep(3)}
                        className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-float hover:bg-blue-600 transition-all"
                    >
                        Check Answer
                    </button>
                )}

                {step === 3 && (
                    <button
                        onClick={startNewRound}
                        className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold text-xl shadow-float hover:bg-gray-900 transition-all"
                    >
                        Next Problem
                    </button>
                )}

                <div className="text-center text-gray-400 text-sm mt-2 min-h-[20px]">
                    {step === 0 && "Look at the columns..."}
                    {step === 1 && `We have ${totalOnes} ones. That's too many!`}
                    {step === 2 && "We moved 10 ones to make 1 new ten."}
                    {step === 3 && "Great job!"}
                </div>
            </div>
        </div>
    );
};

export default CarryingGame;
