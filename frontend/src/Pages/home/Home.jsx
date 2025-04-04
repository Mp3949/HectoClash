import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';

const Home = () => {
    const navigate = useNavigate();
    const [activeModes, setActiveModes] = useState({
        training: { loading: false, matched: false, active: false },
        singleplayer: { loading: false, matched: false },
        multiplayer: { loading: false, matched: false, opponent: null },
        friends: { loading: false, matched: false }
    });

    const gameModes = [
        {
            id: 'training',
            title: 'Training Mode',
            description: 'Practice at your own pace',
            icon: '📚',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/30',
            hoverBorder: 'hover:border-primary/50',
            buttonColor: 'bg-primary hover:bg-primary/90',
            buttonText: 'Start Training',
            redirect: '/training'
        },
        {
            id: 'singleplayer',
            title: 'Singleplayer',
            description: 'Challenge yourself',
            icon: '🧠',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/30',
            hoverBorder: 'hover:border-primary/50',
            buttonColor: 'bg-primary hover:bg-primary/90',
            buttonText: 'Play Solo',
            redirect: '/singleplayer'
        },
        {
            id: 'multiplayer',
            title: 'Multiplayer',
            description: 'Compete with others',
            icon: '👥',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/30',
            hoverBorder: 'hover:border-primary/50',
            buttonColor: 'bg-primary hover:bg-primary/90',
            buttonText: 'Find Match',
            redirect: '/multiplayer'
        },
        {
            id: 'friends',
            title: 'With Friends',
            description: 'Invite your friends',
            icon: '👋',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/30',
            hoverBorder: 'hover:border-primary/50',
            buttonColor: 'bg-primary hover:bg-primary/90',
            buttonText: 'Create Room',
            redirect: '/friends'
        }
    ];

    const handleModeSelect = (mode) => {
        // Set active state for training mode
        if (mode.id === 'training') {
            setActiveModes(prev => ({
                ...prev,
                training: { ...prev.training, active: true }
            }));
            
            // Remove active state after animation completes
            setTimeout(() => {
                setActiveModes(prev => ({
                    ...prev,
                    training: { ...prev.training, active: false }
                }));
            }, 1000);
        }

        // Set loading state for this mode
        setActiveModes(prev => ({
            ...prev,
            [mode.id]: { ...prev[mode.id], loading: true }
        }));

        // Simulate matchmaking process
        setTimeout(() => {
            setActiveModes(prev => ({
                ...prev,
                [mode.id]: { 
                    ...prev[mode.id], 
                    loading: false, 
                    matched: true,
                    opponent: mode.id === 'multiplayer' ? {
                        name: 'MathWizard42',
                        rating: 2450,
                        avatar: 'MW',
                        status: 'Ready',
                        avatarColor: 'bg-purple-600'
                    } : null
                }
            }));

            // Redirect after a short delay to show matched state
            setTimeout(() => {
                navigate(mode.redirect);
                // Reset state after navigation
                setActiveModes(prev => ({
                    ...prev,
                    [mode.id]: { loading: false, matched: false, opponent: null, active: false }
                }));
            }, 1000);
        }, 2000);
    };

    const cancelMatchmaking = (modeId) => {
        setActiveModes(prev => ({
            ...prev,
            [modeId]: { loading: false, matched: false, opponent: null, active: false }
        }));
    };

    const getButtonState = (mode) => {
        const modeState = activeModes[mode.id];
        
        if (modeState.loading) {
            return {
                text: 'Matching...',
                className: 'bg-gray-600 cursor-not-allowed',
                disabled: true
            };
        }
        
        if (modeState.matched) {
            return {
                text: 'Matched!',
                className: 'bg-green-600 cursor-not-allowed',
                disabled: true
            };
        }
        
        return {
            text: mode.buttonText,
            className: mode.buttonColor,
            disabled: false
        };
    };

    return (
        <div className="min-h-screen bg-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>

            <Nav />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="flex justify-center items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, <span className="text-primary">Mp3949!</span></h1>
                        <p className="text-gray-400">Ready for today's challenge?</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Streak Card */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">🔥 Current Streak</h2>
                            <span className="text-primary text-sm font-medium">3 days</span>
                        </div>
                        <div className="flex justify-between">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${index < 3 ? 'bg-primary' : 'bg-gray-700'}`}>
                                        <span className="text-xs text-white">{day}</span>
                                    </div>
                                    <div className={`w-1 h-1 rounded-full ${index < 3 ? 'bg-primary' : 'bg-gray-600'}`}></div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 text-xs text-primary hover:text-primary/80 font-medium flex items-center">
                            Extend streak →
                        </button>
                    </div>

                    {/* XP Card */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-white">⭐ Your XP</h2>
                            <span className="text-primary text-sm font-medium">Level 5</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                            <div className="bg-primary h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <p className="text-gray-400 text-sm">1,240/2,000 XP to next level</p>
                        <button className="mt-2 text-xs text-primary hover:text-primary/80 font-medium flex items-center">
                            How to earn more →
                        </button>
                    </div>

                    {/* Leaderboard Card */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">🏆 Your Rank</h2>
                            <span className="text-primary text-sm font-medium">#124</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                    <span className="text-primary">124</span>
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">Top 15%</p>
                                    <p className="text-gray-400 text-xs">Global ranking</p>
                                </div>
                            </div>
                            <button className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full">
                                View Leaderboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* Game Modes Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Choose Your Game Mode</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {gameModes.map((mode) => {
                            const buttonState = getButtonState(mode);
                            const modeState = activeModes[mode.id];
                            
                            return (
                                <motion.div
                                    key={mode.id}
                                    whileHover={{ y: -5 }}
                                    animate={
                                        mode.id === 'training' && modeState.active 
                                            ? { 
                                                y: -10,
                                                scale: 1.03,
                                                boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.3)"
                                            } 
                                            : {}
                                    }
                                    transition={
                                        mode.id === 'training' && modeState.active 
                                            ? { 
                                                type: "spring", 
                                                stiffness: 500, 
                                                damping: 15 
                                            } 
                                            : {}
                                    }
                                    className={`aspect-square flex flex-col ${mode.bgColor} border ${mode.borderColor} ${mode.hoverBorder} rounded-xl p-6 transition-all relative ${
                                        mode.id === 'training' && modeState.active ? 'ring-2 ring-primary/50' : ''
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4`}>
                                        <span className="text-2xl">{mode.icon}</span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-white mb-2">{mode.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{mode.description}</p>
                                    
                                    <div className="mt-auto relative">
                                        {modeState.loading || modeState.matched ? (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 overflow-hidden"
                                                >
                                                    {modeState.loading ? (
                                                        <div className="flex flex-col items-center">
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                                className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent mb-2"
                                                            />
                                                            <p className="text-sm text-white">Finding match...</p>
                                                            <button
                                                                onClick={() => cancelMatchmaking(mode.id)}
                                                                className="mt-2 text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : modeState.matched && modeState.opponent ? (
                                                        <motion.div
                                                            initial={{ scale: 0.8 }}
                                                            animate={{ scale: 1 }}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center">
                                                                <div className={`w-8 h-8 rounded-full ${modeState.opponent.avatarColor} flex items-center justify-center mr-2`}>
                                                                    <span className="text-xs font-bold text-white">{modeState.opponent.avatar}</span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-medium text-white">@{modeState.opponent.name}</p>
                                                                    <p className="text-xs text-gray-300">Rating: {modeState.opponent.rating}</p>
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
                                        ) : null}
                                        
                                        <button
                                            onClick={() => handleModeSelect(mode)}
                                            disabled={buttonState.disabled}
                                            className={`w-full py-3 text-white rounded-lg transition-colors ${buttonState.className}`}
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
        </div>
    );
};

export default Home;