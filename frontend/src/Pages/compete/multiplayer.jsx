import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';

const Multiplayer = () => {
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

    const [user, setUser] = useState({
        name: "You",
        rating: 2100,
        avatar: "ME",
        country: "🇮🇳",
        attempts: []
    });

    const [opponent, setOpponent] = useState({
        name: "MathWizard42",
        rating: 2450,
        avatar: "MW",
        country: "🇺🇸",
        attempts: [
            { number: 1, timestamp: "00:45", result: 13, correct: false },
            { number: 2, timestamp: "02:15", result: 76, correct: false },
            { number: 3, timestamp: "03:30", result: 32, correct: false },
            { number: 4, timestamp: "04:45", result: 126, correct: false },
            { number: 5, timestamp: "04:50", result: 33, correct: false }
        ]
    });

    const numbers = currentProblem.title.split(" ").filter(char => /\d/.test(char));
    const operators = ['+', '-', '×', '÷', '^', '(', ')'];

    useEffect(() => {
        if (timeLeft <= 0) {
            setShowTimeUpModal(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateCurrentResult = () => {
        if (!expression) return null;
        
        // Check if two digits are adjacent (invalid)
        if (/(\d{2,})/.test(expression)) {
            return "AdjacentDigits";
        }
        
        try {
            const formatted = expression.replace(/×/g, "*").replace(/÷/g, "/");
            return eval(formatted);
        } catch {
            return "Invalid";
        }
    };

    const handleNextNumber = () => {
        if (currentNumberIndex < numbers.length) {
            // Check if last character is a digit before adding another
            if (expression.length > 0 && /\d/.test(expression.slice(-1))) {
                return; // Prevent adding adjacent digits
            }
            setExpression(prev => prev + numbers[currentNumberIndex]);
            setCurrentNumberIndex(prev => prev + 1);
        }
    };

    const handleOperatorClick = (char) => {
        if (timeLeft <= 0) return;
        setExpression(prev => prev + char);
    };

    const handleUndo = () => {
        if (timeLeft <= 0) return;
        const lastChar = expression.slice(-1);
        setExpression(prev => prev.slice(0, -1));
        if (currentNumberIndex > 0 && /\d/.test(lastChar)) {
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

        const result = calculateCurrentResult();
        const isCorrect = result === 100;

        if (result === "Invalid") {
            alert("Invalid expression!");
            return;
        }
        
        if (result === "AdjacentDigits") {
            alert("Cannot have adjacent digits in the sequence!");
            return;
        }

        const newAttempt = {
            number: user.attempts.length + 1,
            timestamp: formatTime(5 * 60 - timeLeft),
            expression: expression,
            result: result,
            correct: isCorrect
        };

        setUser(prev => ({
            ...prev,
            attempts: [...prev.attempts, newAttempt]
        }));

        if (isCorrect) {
            alert("Correct! 🎉 Solution submitted!");
            setExpression("");
            setCurrentNumberIndex(0);
        } else {
            alert(`Incorrect solution (Result: ${result}). Try again!`);
        }
    };

    const handleTimeUpConfirm = () => {
        setShowTimeUpModal(false);
        navigate('/play');
    };

    const currentResult = calculateCurrentResult();

    return (
        <div className="min-h-screen bg-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>
            <Nav />

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Left: Opponent Panel */}
                    <div className="lg:w-1/4 flex flex-col gap-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center border-2 border-purple-500/30 mr-4">
                                    <span className="text-2xl font-bold text-purple-400">{opponent.avatar}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">@{opponent.name}</h2>
                                    <div className="flex items-center text-gray-400">
                                        <span>Rating: {opponent.rating}</span>
                                        <span className="mx-2">•</span>
                                        <span>{opponent.country}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Opponent Attempts</h3>
                                <div className="space-y-3">
                                    {opponent.attempts.map((attempt) => (
                                        <div key={attempt.number} className={`bg-gray-900/50 p-3 rounded-lg border ${
                                            attempt.correct ? 'border-green-500/30' : 'border-red-500/30'
                                        }`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-white">Attempt #{attempt.number}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400 text-sm">{attempt.timestamp}</span>
                                                    <span className={`px-2 py-1 text-xs rounded ${
                                                        attempt.correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                                                    }`}>
                                                        {attempt.correct ? '✓' : `✗ (${attempt.result})`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Game Area */}
                    <div className="lg:w-2/4 flex flex-col gap-8">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Sequence: {currentProblem.title}</h2>
                                <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-green-500'}`}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <div className="text-gray-300 whitespace-pre-line">
                                {currentProblem.description}
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <label className="block text-white font-medium mb-2">Your Solution</label>
                            <div className="my-2 p-4 border border-gray-700 rounded bg-gray-700 min-h-12 text-white font-mono text-xl">
                                {expression || "Start building your equation..."}
                            </div>

                            {currentResult === "Invalid" && (
                                <div className="mb-4 p-2 bg-gray-900 rounded text-center">
                                    <span className="text-red-500 font-bold">Invalid expression</span>
                                </div>
                            )}
                            {currentResult === "AdjacentDigits" && (
                                <div className="mb-4 p-2 bg-gray-900 rounded text-center">
                                    <span className="text-red-500 font-bold">Cannot have adjacent digits</span>
                                </div>
                            )}

                            <div className="mb-4">
                                <button
                                    onClick={handleNextNumber}
                                    disabled={currentNumberIndex >= numbers.length || timeLeft <= 0 || (expression.length > 0 && /\d/.test(expression.slice(-1)))}
                                    className={`w-full py-3 mb-4 rounded-lg transition-colors ${
                                        currentNumberIndex >= numbers.length || timeLeft <= 0 || (expression.length > 0 && /\d/.test(expression.slice(-1)))
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white font-medium`}
                                >
                                    {currentNumberIndex >= numbers.length 
                                        ? 'All numbers used' 
                                        : `Add Next Number (${numbers[currentNumberIndex]})`}
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-3 my-4">
                                {operators.map((op) => (
                                    <button 
                                        key={op} 
                                        onClick={() => handleOperatorClick(op)} 
                                        disabled={timeLeft <= 0}
                                        className={`p-3 rounded-lg transition-colors bg-primary/10 hover:bg-primary/20 text-primary ${
                                            timeLeft <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {op}
                                    </button>
                                ))}
                            </div>

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

                        <button
                            onClick={handleSubmit}
                            disabled={timeLeft <= 0 || !expression || currentResult === "Invalid" || currentResult === "AdjacentDigits"}
                            className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {timeLeft <= 0 ? 'Time Expired' : 'Submit Solution'}
                        </button>
                    </div>

                    {/* Right: User Panel */}
                    <div className="lg:w-1/4 flex flex-col gap-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center border-2 border-blue-500/30 mr-4">
                                    <span className="text-2xl font-bold text-blue-400">{user.avatar}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                                    <div className="flex items-center text-gray-400">
                                        <span>Rating: {user.rating}</span>
                                        <span className="mx-2">•</span>
                                        <span>{user.country}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Your Attempts</h3>
                                {user.attempts.length > 0 ? (
                                    <div className="space-y-3">
                                        {user.attempts.map((attempt) => (
                                            <div key={attempt.number} className={`bg-gray-900/50 p-3 rounded-lg border ${
                                                attempt.correct ? 'border-green-500/30' : 'border-red-500/30'
                                            }`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium text-white">Attempt #{attempt.number}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 text-sm">{attempt.timestamp}</span>
                                                        <span className={`px-2 py-1 text-xs rounded ${
                                                            attempt.correct ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                                                        }`}>
                                                            {attempt.correct ? '✓' : `✗ (${attempt.result})`}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-mono bg-gray-800 p-2 rounded mt-1 break-all">
                                                    {attempt.expression}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 italic">No attempts yet</div>
                                )}
                            </div>
                        </div>
                    </div>
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

export default Multiplayer;