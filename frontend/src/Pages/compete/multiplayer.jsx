import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../../components/Nav";
import { io } from "socket.io-client";
import { useSelector } from "react-redux"; // Or use context if you're not using Redux

const socket = io("http://localhost:8080", {
  withCredentials: true,
  autoConnect: false,
});

const Multiplayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useSelector((state) => state.user); // Get from Redux
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 1-minute timer
  const [expression, setExpression] = useState("");
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [problem, setProblem] = useState("");
  const [matchId, setMatchId] = useState(null);
  // const [opponent, setOpponent] = useState(null);
  useEffect(() => {
    socket.on("match_ended", ({ matchId, reason, result }) => {
      setGameEnded(true);
      setActiveModal("timeUp");
      console.log(`💥 Match ${matchId} ended: ${result} (${reason})`);
    });

    return () => {
      socket.off("match_ended");
    };
  }, []);

  useEffect(() => {
    // If user was navigated here from matchmaking
    if (location.state) {
      setMatchId(location.state.matchId);
      setProblem(location.state.problem);
      setOpponent(location.state.opponent);
    }

    socket.on("match", (data) => {
      setMatchId(data.matchId);
      setProblem(data.problem);
      setOpponent(data.opponent);
    });

    return () => {
      socket.off("match");
    };
  }, [location.state]);

  const [currentProblem] = useState({
    title: problem,
    description:
      "Use operators [+,-,*,/,(,),^] to make the sequence equal 100 without changing number order.",
  });

  const [, setUser] = useState({
    name: authUser?.userName || "You",
    rating: authUser?.rating || 2000,
    avatar: authUser?.userName[0].toUpperCase() || "YO",
    country: "🇮🇳",
    attempts: [],
  });

  const [opponent, setOpponent] = useState(() => ({
    name: location.state?.opponent?.userName || "Opponent",
    rating: location.state?.opponent?.rating || 2000,
    avatar: location.state?.opponent?.userName?.[0]?.toUpperCase() || "OP",
    country: "🇺🇸",
    attempts: [],
  }));

  const numbers = currentProblem.title
    .split(" ")
    .filter((char) => /\d/.test(char));
  const operators = ["+", "-", "×", "÷", "^", "(", ")"];

  useEffect(() => {
    if (timeLeft <= 0 && !gameEnded) {
      endGame("timeUp");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameEnded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameEnded) endGame("opponentWin");
    }, 3 * 60 * 1000); // simulate opponent win
    return () => clearTimeout(timer);
  }, [gameEnded]);

  const endGame = (result) => {
    setGameEnded(true);
    setActiveModal(result);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateCurrentResult = () => {
    if (!expression) return null;
    if (/(\d{2,})/.test(expression)) return "AdjacentDigits";
    try {
      const formatted = expression.replace(/×/g, "*").replace(/÷/g, "/");
      const result = eval(formatted);
      return Math.round(result * 100) / 100;
    } catch {
      return "Invalid";
    }
  };

  const handleNextNumber = () => {
    if (currentNumberIndex < numbers.length && !gameEnded) {
      if (expression.length > 0 && /\d/.test(expression.slice(-1))) return;
      setExpression((prev) => prev + numbers[currentNumberIndex]);
      setCurrentNumberIndex((prev) => prev + 1);
    }
  };

  const handleOperatorClick = (char) => {
    if (!gameEnded) setExpression((prev) => prev + char);
  };

  const handleUndo = () => {
    if (expression.length === 0 || gameEnded) return;
    const lastChar = expression.slice(-1);
    setExpression((prev) => prev.slice(0, -1));
    if (/\d/.test(lastChar)) setCurrentNumberIndex((prev) => prev - 1);
  };

  const handleClear = () => {
    if (!gameEnded) {
      setExpression("");
      setCurrentNumberIndex(0);
    }
  };

  const handleSubmit = () => {
    if (gameEnded) return;

    const result = calculateCurrentResult();

    if (result === "Invalid" || result === "AdjacentDigits") {
      setActiveModal("wrongAnswer");
      setLastResult(
        result === "AdjacentDigits"
          ? "Cannot have adjacent digits!"
          : "Invalid expression!"
      );
      return;
    }

    const newAttempt = {
      number: authUser.attempts.length + 1,
      timestamp: formatTime(60 - timeLeft),
      expression,
      result,
      correct: result === 100,
    };

    setUser((prev) => ({ ...prev, attempts: [...prev.attempts, newAttempt] }));

    if (result === 100) {
      endGame("success");
      setExpression("");
      setCurrentNumberIndex(0);
    } else {
      setActiveModal("wrongAnswer");
      setLastResult(result);
    }
  };

  const handleModalConfirm = () => {
    setActiveModal(null);
    if (["success", "opponentWin", "timeUp"].includes(activeModal)) {
      navigate("/matchresult");
    }
  };

  const currentResult = calculateCurrentResult();

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>
      <Nav />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Opponent Panel */}
          <PlayerPanel user={opponent} isOpponent />

          {/* Game Area */}
          <div className="lg:w-2/4 flex flex-col gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  Sequence: {currentProblem.title}
                </h2>
                <div
                  className={`text-2xl font-mono font-bold ${
                    timeLeft < 60 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>
              <p className="text-gray-300">{currentProblem.description}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <label className="block text-white font-medium mb-2">
                Your Solution
              </label>
              <div className="my-2 p-4 border border-gray-700 rounded bg-gray-700 min-h-12 text-white font-mono text-xl">
                {expression || "Start building your equation..."}
              </div>

              {currentResult === "Invalid" && (
                <ErrorMessage message="Invalid expression" />
              )}
              {currentResult === "AdjacentDigits" && (
                <ErrorMessage message="Cannot have adjacent digits" />
              )}

              <button
                onClick={handleNextNumber}
                disabled={
                  currentNumberIndex >= numbers.length ||
                  timeLeft <= 0 ||
                  (expression.length > 0 && /\d/.test(expression.slice(-1)))
                }
                className="w-full py-3 mb-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {currentNumberIndex >= numbers.length
                  ? "All numbers used"
                  : `Add Next Number (${numbers[currentNumberIndex]})`}
              </button>

              <div className="grid grid-cols-4 gap-3 my-4">
                {operators.map((op) => (
                  <button
                    key={op}
                    onClick={() => handleOperatorClick(op)}
                    disabled={timeLeft <= 0}
                    className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {op}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUndo}
                  disabled={expression.length === 0 || timeLeft <= 0}
                  className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Undo
                </button>
                <button
                  onClick={handleClear}
                  disabled={expression.length === 0 || timeLeft <= 0}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                timeLeft <= 0 ||
                !expression ||
                currentResult === "Invalid" ||
                currentResult === "AdjacentDigits"
              }
              className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {timeLeft <= 0 ? "Time Expired" : "Submit Solution"}
            </button>
          </div>

          {/* User Panel */}
          <PlayerPanel user={authUser} />
        </div>
      </div>

      {/* Modals */}
      {activeModal === "timeUp" && (
        <GameModal
          emoji="⏱"
          title="Time's Up!"
          message="The time limit for this challenge has ended."
          onConfirm={handleModalConfirm}
          buttonText="View Match Stats"
        />
      )}
      {activeModal === "success" && (
        <GameModal
          emoji="🎉"
          title="Great Job!"
          message="Your solution is correct! You've won this match."
          onConfirm={handleModalConfirm}
          buttonText="View Match Stats"
        />
      )}
      {activeModal === "opponentWin" && (
        <GameModal
          emoji="😞"
          title="Oops, Too Late!"
          message="Your opponent solved it first! Better luck next time."
          onConfirm={handleModalConfirm}
          buttonText="View Match Stats"
        />
      )}
      {activeModal === "wrongAnswer" && (
        <GameModal
          emoji="❌"
          title="Incorrect Solution"
          message={`Your answer equals ${lastResult}. Try again!`}
          onConfirm={() => setActiveModal(null)}
          buttonText="Try Again"
        />
      )}
    </div>
  );
};

// Player Panel Component
const PlayerPanel = ({ user, isOpponent }) => (
  <div className="lg:w-1/4 flex flex-col gap-6">
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <div
          className={`w-16 h-16 rounded-full ${
            isOpponent
              ? "bg-purple-600/20 border-purple-500/30"
              : "bg-blue-600/20 border-blue-500/30"
          } flex items-center justify-center border-2 mr-4`}
        >
          <span
            className={`text-2xl font-bold ${
              isOpponent ? "text-purple-400" : "text-blue-400"
            }`}
          >
            {user.avatar}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">@{user.name}</h2>
          <div className="text-gray-400">Rating: {user.rating}</div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-3">
        {isOpponent ? "Opponent" : "Your"} Attempts
      </h3>

      {user?.attempts?.length > 0 ? (
        <div className="space-y-3">
          {user.attempts.map((attempt) => (
            <div
              key={attempt.number}
              className={`bg-gray-900/50 p-3 rounded-lg border ${
                attempt.correct ? "border-green-500/30" : "border-red-500/30"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-white">
                  Attempt #{attempt.number}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    attempt.correct
                      ? "bg-green-900/50 text-green-400"
                      : "bg-red-900/50 text-red-400"
                  }`}
                >
                  {attempt.correct ? "✓" : `✗ (${attempt.result})`}
                </span>
              </div>
              {attempt.expression && (
                <div className="text-sm font-mono bg-gray-800 p-2 rounded mt-1 break-all">
                  {attempt.expression}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 italic">No attempts yet</div>
      )}
    </div>
  </div>
);

// Modal Component
const GameModal = ({ emoji, title, message, onConfirm, buttonText }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 text-center">
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 mb-6">{message}</p>
      <button
        onClick={onConfirm}
        className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        {buttonText}
      </button>
    </div>
  </div>
);

// Reusable error message block
const ErrorMessage = ({ message }) => (
  <div className="mb-4 p-2 bg-gray-900 rounded text-center">
    <span className="text-red-500 font-bold">{message}</span>
  </div>
);

export default Multiplayer;
