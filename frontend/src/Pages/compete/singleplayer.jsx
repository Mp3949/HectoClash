import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';

const SinglePlayer = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [expression, setExpression] = useState("");
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
    const [currentProblem, setCurrentProblem] = useState({
        id: 1,
        title: "1 2 3 4 5 6",
        description: "By using any of given operator[+,-,*,/,(,),^] make this sequence answer as 100 without changing the sequence"
    });

    // Extract numbers from problem title (single digits only)
    const numbers = currentProblem.title.split(" ").filter(char => /\d/.test(char));
    const operators = ['+', '-', '×', '÷', '^', '(', ')'];

    useEffect(() => {
        if (timeLeft <= 0) {
            setShowTimeUpModal(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNextNumber = () => {
        if (currentNumberIndex < numbers.length) {
            setExpression(prev => prev + numbers[currentNumberIndex]);
            setCurrentNumberIndex(prev => prev + 1);
        }
    };

    const handleOperatorClick = (char) => {
        if (timeLeft <= 0) return;
        setExpression((prev) => prev + char);
    };

    const handleUndo = () => {
        if (timeLeft <= 0) return;
        setExpression((prev) => prev.slice(0, -1));
        // If we undo a number, decrement the index
        if (currentNumberIndex > 0 && /\d/.test(expression.slice(-1))) {
            setCurrentNumberIndex(prev => prev - 1);
        }
    };

    const handleClear = () => {
        if (timeLeft <= 0) return;
        setExpression("");
        setCurrentNumberIndex(0);
    };

    const handleSubmit = () => {
        if (timeLeft <= 0) return;
        try {
            let formattedExpression = expression.replace(/×/g, "*").replace(/÷/g, "/");
            if (eval(formattedExpression) === 100) {
                alert("Correct! 🎉 Solution submitted!");
                setExpression("");
                setCurrentNumberIndex(0);
            } else {
                alert("Incorrect solution. Try again!");
            }
        } catch {
            alert("Invalid expression!");
        }
    };

    const handleTimeUpConfirm = () => {
        setShowTimeUpModal(false);
        navigate('/matchmaking');
    };

    return (
        <div className="min-h-screen bg-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                    {/* Timer */}
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <h2 className="text-2xl font-bold text-white">Time Remaining</h2>
                        <div className={`text-4xl font-mono font-bold ${
                            timeLeft < 60 ? 'text-red-500' : 'text-green-500'
                        }`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Problem Display */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-2">{currentProblem.title}</h2>
                        <div className="text-gray-300 whitespace-pre-line mb-4">
                            {currentProblem.description}
                        </div>
                    </div>

                    {/* Equation Builder */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <label className="block text-white font-medium mb-2">
                            Build Your Solution
                        </label>
                        
                        {/* Current Expression Display */}
                        <div className="my-2 p-4 border border-gray-700 rounded bg-gray-700 min-h-12 text-white font-mono text-xl">
                            {expression || "Start building your equation..."}
                        </div>

                        {/* Next Number Button */}
                        <div className="mb-4">
                            <button
                                onClick={handleNextNumber}
                                disabled={currentNumberIndex >= numbers.length || timeLeft <= 0}
                                className={`w-full py-3 mb-4 rounded-lg transition-colors ${
                                    currentNumberIndex >= numbers.length || timeLeft <= 0
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-medium`}
                            >
                                {currentNumberIndex >= numbers.length 
                                    ? 'All numbers used' 
                                    : `Add Next Number (${numbers[currentNumberIndex]})`}
                            </button>
                        </div>

                        {/* Operators Grid */}
                        <div className="grid grid-cols-4 gap-3 my-4">
                            {operators.map((op) => (
                                <button 
                                    key={op} 
                                    onClick={() => handleOperatorClick(op)} 
                                    disabled={timeLeft <= 0}
                                    className={`p-3 rounded-lg transition-colors ${
                                        'bg-primary/10 hover:bg-primary/20 text-primary'
                                    } ${timeLeft <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {op}
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4">
                            <button 
                                onClick={handleUndo} 
                                disabled={timeLeft <= 0 || expression.length === 0}
                                className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Undo
                            </button>
                            <button 
                                onClick={handleClear} 
                                disabled={timeLeft <= 0 || expression.length === 0}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={timeLeft <= 0 || !expression}
                        className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {timeLeft <= 0 ? 'Time Expired' : 'Submit Solution'}
                    </button>
                </div>
            </div>

            {/* Time Up Modal */}
            {showTimeUpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
                        <div className="text-center">
                            <div className="text-5xl mb-4">⏱️</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Time's Up!</h3>
                            <p className="text-gray-300 mb-6">
                                The time limit for this challenge has ended. You'll be redirected back to matchmaking.
                            </p>
                            <button
                                onClick={handleTimeUpConfirm}
                                className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SinglePlayer;