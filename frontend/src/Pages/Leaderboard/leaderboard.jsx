import React from 'react';
import Nav from '../../components/Nav';

const LeaderboardPage = () => {
    const leaderboardData = [
        { id: 'CodeMaster42', rating: 2850, rank: 1 },
        { id: 'AlgorithmQueen', rating: 2750, rank: 2 },
        { id: 'BinaryNinja', rating: 2650, rank: 3 },
        { id: 'DataWizard', rating: 2550, rank: 4 },
        { id: 'SyntaxSamurai', rating: 2450, rank: 5 },
        { id: 'LogicLegend', rating: 2350, rank: 6 },
        { id: 'ByteBard', rating: 2250, rank: 7 },
        { id: 'PixelPirate', rating: 2150, rank: 8 },
        { id: 'Bob', rating: 2110, rank: 9 },
        { id: 'Alice', rating: 2100, rank: 10 },
    ];

    const getRankStyle = (rank) => {
        switch(rank) {
            case 1:
                return {
                    background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                    color: '#000',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
                };
            case 2:
                return {
                    background: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
                    color: '#000',
                    boxShadow: '0 4px 15px rgba(192, 192, 192, 0.4)'
                };
            case 3:
                return {
                    background: 'linear-gradient(135deg, #CD7F32 0%, #A67C52 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(205, 127, 50, 0.4)'
                };
            default:
                return {
                    backgroundColor: '#1F2937',
                    color: '#fff'
                };
        }
    };

    const getRankIcon = (rank) => {
        switch(rank) {
            case 1: return '👑';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return rank;
        }
    };

    return (
        <div className="min-h-screen bg-dark relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>
            <Nav />

            <div className="relative z-10 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center text-white mb-2">
                        Hectoclash Champions
                    </h1>
                    <p className="text-gray-400 text-center mb-12">
                        Top performers this week
                    </p>

                    {/* Podium Visualization - Now at the top */}
                    <div className="mb-16 grid grid-cols-3 gap-4 h-64 items-end">
                        {/* 2nd Place */}
                        <div 
                            className="bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg flex flex-col items-center justify-end pb-4 relative"
                            style={{ height: '70%' }}
                        >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl">🥈</div>
                            <div className="text-4xl opacity-0">🥈</div> {/* Spacer */}
                            <div className="font-bold text-black text-lg">AlgorithmQueen</div>
                            <div className="text-black font-mono font-bold">2750</div>
                            <div className="absolute -bottom-6 left-0 right-0 text-center font-bold text-gray-300">
                                2nd
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div 
                            className="bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-lg flex flex-col items-center justify-end pb-4 relative"
                            style={{ height: '100%' }}
                        >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl">👑</div>
                            <div className="text-4xl opacity-0">👑</div> {/* Spacer */}
                            <div className="font-bold text-black text-lg">CodeMaster42</div>
                            <div className="text-black font-mono font-bold">2850</div>
                            <div className="absolute -bottom-6 left-0 right-0 text-center font-bold text-gray-300">
                                1st
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div 
                            className="bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-lg flex flex-col items-center justify-end pb-4 relative"
                            style={{ height: '50%' }}
                        >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl">🥉</div>
                            <div className="text-4xl opacity-0">🥉</div> {/* Spacer */}
                            <div className="font-bold text-white text-lg">BinaryNinja</div>
                            <div className="text-white font-mono font-bold">2650</div>
                            <div className="absolute -bottom-6 left-0 right-0 text-center font-bold text-gray-300">
                                3rd
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard List */}
                    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="grid grid-cols-12 bg-gray-800 p-4 font-bold text-gray-300">
                            <div className="col-span-1 text-center">Rank</div>
                            <div className="col-span-8 pl-4">Player</div>
                            <div className="col-span-3 text-right pr-4">Rating</div>
                        </div>

                        {/* Leaderboard Items */}
                        {leaderboardData.map((player) => (
                            <div 
                                key={player.id}
                                className="grid grid-cols-12 items-center p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-all"
                                style={getRankStyle(player.rank)}
                            >
                                <div className="col-span-1 text-center font-bold text-xl">
                                    {getRankIcon(player.rank)}
                                </div>
                                <div className="col-span-8 pl-4 font-medium flex items-center">
                                    <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                        {player.rank}
                                    </span>
                                    {player.id}
                                </div>
                                <div className="col-span-3 text-right pr-4 font-bold">
                                    {player.rating}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;