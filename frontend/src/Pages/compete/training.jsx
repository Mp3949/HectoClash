import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';

const Training = () => {
    const navigate = useNavigate();
    const [expression, setExpression] = useState("");
    const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
    const [currentProblem, setCurrentProblem] = useState({
        id: 1,
        title: "1 2 3 4 5 6",
        description: "By using any of given operator[+,-,*,/,(,),^] make this sequence answer as 100 without changing the sequence"
    });

    // Extract numbers from problem title (single digits only)
    const numbers = currentProblem.title.split(" ").filter(char => /\d/.test(char));
    const operators = ['+', '-', '×', '÷', '^', '(', ')'];

    const handleNextNumber = () => {
        if (currentNumberIndex < numbers.length) {
            setExpression(prev => prev + numbers[currentNumberIndex]);
            setCurrentNumberIndex(prev => prev + 1);
        }
    };

    const handleOperatorClick = (char) => {
        setExpression((prev) => prev + char);
    };

    const handleUndo = () => {
        setExpression((prev) => prev.slice(0, -1));
        // If we undo a number, decrement the index
        if (currentNumberIndex > 0 && /\d/.test(expression.slice(-1))) {
            setCurrentNumberIndex(prev => prev - 1);
        }
    };

    const handleClear = () => {
        setExpression("");
        setCurrentNumberIndex(0);
    };

    const handleSubmit = () => {
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

    return (
        <div className="min-h-screen bg-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>
            <Nav />

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 max-w-4xl mx-auto">
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
                                disabled={currentNumberIndex >= numbers.length}
                                className={`w-full py-3 mb-4 rounded-lg transition-colors ${
                                    currentNumberIndex >= numbers.length
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
                                    className="p-3 rounded-lg transition-colors bg-primary/10 hover:bg-primary/20 text-primary"
                                >
                                    {op}
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4">
                            <button 
                                onClick={handleUndo} 
                                disabled={expression.length === 0}
                                className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Undo
                            </button>
                            <button 
                                onClick={handleClear} 
                                disabled={expression.length === 0}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!expression}
                        className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        Submit Solution
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Training;