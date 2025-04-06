import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Nav from "../../components/Nav";


const socket = io("http://localhost:8080", {
  withCredentials: true,
  autoConnect: false,
});

const PlayerPanel = ({ user, opponent, isOpponent, isActive }) => {
  const player = isOpponent ? opponent : user;

  if (!player || !player.name) {
    return (
      <div className="lg:w-1/4 flex flex-col gap-6 text-white opacity-50">
        Loading player...
      </div>
    );
  }

  return (
    <div
      className={`lg:w-1/4 flex flex-col gap-6 transition-opacity ${
        isActive ? "opacity-100" : "opacity-70"
      }`}
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative">
        {isActive && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            Playing
          </div>
        )}
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
              {player.name[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">@{player.name}</h2>
            <div className="text-gray-400">Rating: {player.rating}</div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-3">
          {isOpponent ? "Opponent" : "Your"} Attempts
        </h3>
        {player?.attempts?.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {player.attempts.map((attempt) => (
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
};

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

const Multiplayer = () => {
  const { authUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(60);
  const [expression, setExpression] = useState("");
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [problem, setProblem] = useState("");
  const [matchId, setMatchId] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [gameStatus, setGameStatus] = useState("waiting");
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const [user, setUser] = useState({
    id: authUser?._id || null,
    name: authUser?.userName || "You",
    rating: authUser?.rating || 0,
    avatar: (authUser?.userName?.[0] || "Y").toUpperCase(),
    country: "🇮🇳",
    attempts: [],
  });

  const [opponent, setOpponent] = useState({});

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (location.state) {
      initializeMatch(location.state);
      console.log("intialize");
    }

    socket.on("matchFound", initializeMatch);
    // socket.on("")
    socket.on("opponentAttempt", (attempt) => {
      setOpponent((prev) => ({
        ...prev,
        attempts: [...prev.attempts, attempt],
      }));
    });
    socket.on("turnUpdate", ({ currentPlayerId }) =>
      setCurrentPlayer(currentPlayerId)
    );
    socket.on("matchEnded", ({ winnerId }) => {
      setGameEnded(true);
      setGameStatus("ended");
      if (timerRef.current) clearInterval(timerRef.current);
      setActiveModal(
        winnerId === user.id
          ? "success"
          : winnerId === opponent.id
          ? "opponentWin"
          : "timeUp"
      );
    });

    return () => {
      socket.off("matchFound", initializeMatch);
      socket.off("opponentAttempt");
      socket.off("turnUpdate");
      socket.off("matchEnded");
    };
  }, [location.state, user.id, opponent.id]);

  const initializeMatch = (data) => {
    console.log(data);
    setMatchId(data.matchId);
    setProblem(data.problem);
    setOpponent({
      name: data.opponent.userName,
      rating: data.opponent.rating,
      avatar: data.opponent.avatar,
      attempts: [],
    });
    setCurrentPlayer(null);
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const calculateResult = () => {
    if (!expression) return null;
    if (/\d{2,}/.test(expression)) return "AdjacentDigits";
    try {
      const formatted = expression.replace(/×/g, "*").replace(/÷/g, "/");
      const result = eval(formatted);
      return Math.round(result * 100) / 100;
    } catch {
      return "Invalid";
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleNextNumber = () => {
    if (
      currentNumberIndex < numbers.length &&
      !gameEnded &&
      (expression.length === 0 || !/\d/.test(expression.slice(-1)))
    ) {
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
    if (gameEnded || gameStatus !== "playing") return;
    const result = calculateResult();
    if (result === "Invalid" || result === "AdjacentDigits") {
      setLastResult(
        result === "AdjacentDigits"
          ? "Cannot have adjacent digits!"
          : "Invalid expression!"
      );
      setActiveModal("wrongAnswer");
      return;
    }

    const newAttempt = {
      number: user.attempts.length + 1,
      timestamp: formatTime(60 - timeLeft),
      expression,
      result,
      correct: result === 100,
    };

    setUser((prev) => ({ ...prev, attempts: [...prev.attempts, newAttempt] }));
    socket.emit("playerAttempt", { matchId, attempt: newAttempt });

    if (result === 100) {
      socket.emit("playerWin", { matchId, playerId: user.id });
      setGameEnded(true);
      setActiveModal("success");
    } else {
      setLastResult(`Result: ${result}`);
      setActiveModal("wrongAnswer");
    }

    setExpression("");
    setCurrentNumberIndex(0);
  };

  const handleModalConfirm = () => {
    setActiveModal(null);
    if (["success", "opponentWin", "timeUp"].includes(activeModal)) {
      navigate("/matchresult", {
        state: {
          matchId,
          problem,
          userAttempts: user.attempts,
          opponentAttempts: opponent.attempts,
          result: activeModal === "success" ? "win" : "loss",
        },
      });
    }
  };

  const numbers = problem?.split(" ").filter((char) => /\d/.test(char)) || [];
  const operators = ["+", "-", "×", "÷", "^", "(", ")"];
  const currentResult = calculateResult();

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      <Nav />
      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col lg:flex-row gap-6 max-w-7xl">
        <PlayerPanel
          user={opponent}
          isOpponent
          isActive={currentPlayer === opponent.id && gameStatus === "playing"}
        />

        <div className="lg:w-2/4 flex flex-col gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Sequence:{problem}
              </h2>
              <div
                className={`text-lg font-mono ${
                  timeLeft < 10 ? "text-red-400" : "text-green-400"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              Use operators [+,-,*,/,(,),^] to make the sequence equal 100.
            </p>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="mb-2 text-white font-medium">
                Your Expression:
              </div>
              <div className="bg-gray-700 p-3 rounded mb-3 font-mono text-white min-h-12">
                {expression || "Start building..."}
                {currentResult && (
                  <div className="text-sm text-gray-400 mt-1">
                    Current evaluation: {currentResult}
                  </div>
                )}
              </div>

              <button
                onClick={handleNextNumber}
                disabled={
                  currentNumberIndex >= numbers.length ||
                  (expression.length > 0 && /\d/.test(expression.slice(-1))) ||
                  gameStatus !== "playing"
                }
                className={`w-full py-2 rounded text-white mb-3 ${
                  currentNumberIndex >= numbers.length
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {currentNumberIndex >= numbers.length
                  ? "All numbers used"
                  : `Add Next Number (${numbers[currentNumberIndex]})`}
              </button>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {operators.map((op) => (
                  <button
                    key={op}
                    onClick={() => handleOperatorClick(op)}
                    disabled={gameStatus !== "playing"}
                    className="bg-primary/10 hover:bg-primary/20 text-primary py-2 rounded disabled:opacity-50"
                  >
                    {op}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUndo}
                  disabled={expression.length === 0 || gameStatus !== "playing"}
                  className="flex-1 bg-yellow-600 text-white py-2 rounded disabled:opacity-50"
                >
                  Undo
                </button>
                <button
                  onClick={handleClear}
                  disabled={expression.length === 0 || gameStatus !== "playing"}
                  className="flex-1 bg-red-600 text-white py-2 rounded disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={expression.length === 0 || gameStatus !== "playing"}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <PlayerPanel
          user={user}
          isActive={currentPlayer === user.id && gameStatus === "playing"}
        />
      </div>

      {activeModal && (
        <GameModal
          emoji={
            activeModal === "success"
              ? "🎉"
              : activeModal === "wrongAnswer"
              ? "❌"
              : activeModal === "opponentWin"
              ? "😞"
              : "⏰"
          }
          title={
            activeModal === "success"
              ? "Correct!"
              : activeModal === "wrongAnswer"
              ? "Try Again"
              : activeModal === "opponentWin"
              ? "Opponent Won!"
              : "Time's Up"
          }
          message={
            activeModal === "wrongAnswer"
              ? lastResult
              : activeModal === "opponentWin"
              ? "Better luck next time!"
              : ""
          }
          onConfirm={handleModalConfirm}
          buttonText="Continue"
        />
      )}
    </div>
  );
};

export default Multiplayer;
