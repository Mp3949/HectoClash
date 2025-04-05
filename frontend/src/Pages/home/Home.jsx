import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Nav from '../../components/Nav';

const Home = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.user);
  const username = authUser?.userName || 'Hectoclash';

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>

      <Nav />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex justify-center items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back, <span className="text-primary">{username}!</span>
            </h1>
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
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      index < 3 ? 'bg-primary' : 'bg-gray-700'
                    }`}
                  >
                    <span className="text-xs text-white">{day}</span>
                  </div>
                  <div
                    className={`w-1 h-1 rounded-full ${
                      index < 3 ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  ></div>
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
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="text-gray-400 text-sm">1,240 / 2,000 XP to next level</p>
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
              <button
                onClick={() => navigate('/leaderboard')}
                className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
