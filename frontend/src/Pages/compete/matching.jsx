import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setMatch, setOpponent } from "../../redux/matchSlice";
import Nav from "../../components/Nav";

const MatchmakingPage = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.user);

  const [selectedMode, setSelectedMode] = useState(null);
  const [matchmaking, setMatchmaking] = useState(false);
  const [match, setMatch] = useState(null);
  const [opponentInfo, setOpponentInfo] = useState(null);
  const dispatch = useDispatch();
  const [activeModes, setActiveModes] = useState({
    training: { loading: false, matched: false },
    singleplayer: { loading: false, matched: false },
    multiplayer: { loading: false, matched: false, opponent: null },
  });

  const gameModes = [
    {
      id: "multiplayer",
      title: "Ranked Match",
      description: "Compete with players of similar skill level",
      icon: "⚔️",
      color: "bg-gradient-to-br from-purple-500/10 to-purple-500/5",
      border: "border-purple-500/20 hover:border-purple-500/40",
      button: "Find Match",
      redirect: "/game",
    },
    {
      id: "training",
      title: "Training Mode",
      description: "Practice at your own pace with customizable settings",
      icon: "📚",
      color: "bg-gradient-to-br from-orange-500/10 to-orange-500/5",
      border: "border-orange-500/20 hover:border-orange-500/40",
      button: "Start Training",
      redirect: "/training",
    },
    {
      id: "singleplayer",
      title: "Singleplayer",
      description: "Challenge yourself with progressively difficult puzzles",
      icon: "🧠",
      color: "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
      border: "border-blue-500/20 hover:border-blue-500/40",
      button: "Play Solo",
      redirect: "/singleplayer",
    },
  ];
  const handleModeSelect = async (modeObj) => {
    const mode = modeObj.id;
    setSelectedMode(mode);
    console.log(mode);

    if (mode === "training" || mode === "singleplayer") {
      setActiveModes((prev) => ({
        ...prev,
        [mode]: { ...prev[mode], loading: true },
      }));
      setTimeout(() => {
        navigate(modeObj.redirect);
      }, 1000);
    } else if (mode === "multiplayer") {
      setMatchmaking(true);
      setActiveModes((prev) => ({
        ...prev,
        multiplayer: { ...prev.multiplayer, loading: true },
      }));

      try {
        const response = await axios.post(
          "http://localhost:8080/api/match/createOrJoin",
          {},
          { withCredentials: true }
        );

        const data = response.data;
        const match = data.match; // ✅ extract match object
        console.log("Match data:", match);

        setMatch(match); // ✅ store locally if needed
        console.log("Dispatching match:", match);
        dispatch(setMatch(match));

        let opponent = null;
        if (match.player1 && match.player2) {
          const opponentUser =
            match.player1.userName === authUser?.userName
              ? match.player2
              : match.player1;

          opponent = {
            name: opponentUser.userName,
            rating: opponentUser.rating || 0,
            avatar: opponentUser.userName[0].toUpperCase(),
            avatarColor: "bg-purple-600",
          };

          setOpponentInfo(opponent); // local state
          dispatch(setOpponent(opponent)); // ✅ redux state
        }

        setActiveModes((prev) => ({
          ...prev,
          multiplayer: {
            loading: false,
            matched: match.status === "started",
            opponent: opponent,
          },
        }));

        if (match.status === "started") {
          setTimeout(() => {
            navigate("/game");
          }, 2000);
        }
      } catch (err) {
        console.error("Error finding match:", err);
      } finally {
        setMatchmaking(false);
      }
    }
  };

  const cancelMatchmaking = (modeId) => {
    setActiveModes((prev) => ({
      ...prev,
      [modeId]: { loading: false, matched: false, opponent: null },
    }));
  };

  const getButtonState = (mode) => {
    const modeState = activeModes[mode.id];

    if (modeState.loading) {
      return {
        text: mode.id === "multiplayer" ? "Matching..." : "Starting...",
        className: "bg-gray-600 cursor-not-allowed",
        disabled: true,
      };
    }

    if (modeState.matched) {
      return {
        text: "Matched!",
        className: "bg-green-600 cursor-not-allowed",
        disabled: true,
      };
    }

    return {
      text: mode.button,
      className:
        mode.id === "multiplayer"
          ? "bg-purple-600 hover:bg-purple-700"
          : mode.id === "training"
          ? "bg-orange-600 hover:bg-orange-700"
          : "bg-blue-600 hover:bg-blue-700",
      disabled: false,
    };
  };

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>
      <Nav />

      <div className="relative z-10 flex-grow container mx-auto px-4 py-8 flex flex-col">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Choose Your Game Mode
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto">
          {gameModes.map((mode) => {
            const buttonState = getButtonState(mode);
            const modeState = activeModes[mode.id];

            return (
              <motion.div
                key={mode.id}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 flex flex-col ${mode.color} ${mode.border} rounded-2xl p-6 shadow-lg transition-all`}
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">{mode.icon}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  {mode.title}
                </h3>
                <p className="text-gray-300 text-sm mb-6 text-center flex-grow">
                  {mode.description}
                </p>

                <div className="relative">
                  {(modeState.loading || modeState.matched) && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 overflow-hidden"
                      >
                        {modeState.loading ? (
                          <div className="flex flex-col items-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "linear",
                              }}
                              className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent mb-2"
                            />
                            <p className="text-sm text-white">
                              {mode.id === "multiplayer"
                                ? "Finding match..."
                                : "Starting soon..."}
                            </p>
                            <button
                              onClick={() => cancelMatchmaking(mode.id)}
                              className="mt-2 text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : mode.id === "multiplayer" && modeState.opponent ? (
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full ${modeState.opponent.avatarColor} flex items-center justify-center mr-2`}
                              >
                                <span className="text-xs font-bold text-white">
                                  {modeState.opponent.avatar}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-white">
                                  @{modeState.opponent.name}
                                </p>
                                <p className="text-xs text-gray-300">
                                  Rating: {modeState.opponent.rating}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-green-400 font-bold">
                              Matched!
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-center text-sm text-green-400 font-bold">
                            Ready to start!
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}

                  <button
                    onClick={() => handleModeSelect(mode)}
                    disabled={buttonState.disabled}
                    className={`w-full py-3 rounded-xl text-white font-medium transition-colors ${buttonState.className}`}
                  >
                    {buttonState.text}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchmakingPage;
