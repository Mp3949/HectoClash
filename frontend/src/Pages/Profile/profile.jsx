import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';

const Profile = () => {
  const navigate = useNavigate();
  
  // Sample user data
  const user = {
    id: 'MathWizard42',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    rating: 2450,
    rank: 15,
    totalGames: 127,
    wins: 89,
    solutionsSubmitted: 215,
    joinDate: '2023-05-15',
    lastActive: '2024-01-20',
    achievements: [
      'Fast Solver (10 problems in <1 min)',
      'Perfect Streak (5 wins in a row)',
      'Top 20 Player'
    ]
  };

  const winPercentage = Math.round((user.wins / user.totalGames) * 100);

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/20 to-dark"></div>
      <Nav />

      <div className="relative z-10 flex-grow container mx-auto px-4 py-8">
        <div className="h-full flex flex-col">
          <div className="flex-grow">
            <div className="max-w-7xl mx-auto h-full">
              <div className="h-full flex flex-col md:flex-row gap-8">
                {/* Profile Card - Takes full height on mobile, 1/3 width on desktop */}
                <div className="w-full md:w-1/3 h-full">
                  <div className="h-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col">
                    <div className="flex flex-col items-center flex-grow">
                      <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/50 mb-4">
                        <span className="text-5xl font-bold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                      <p className="text-gray-400">@{user.id}</p>
                      <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                      
                      <div className="mt-6 w-full">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>Rating</span>
                          <span className="text-white font-bold">{user.rating}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                            style={{ width: `${(user.rating / 3000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                        <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">{user.rank}</div>
                          <div className="text-xs text-gray-400">RANK</div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-500">{winPercentage}%</div>
                          <div className="text-xs text-gray-400">WIN RATE</div>
                        </div>
                      </div>

                      <div className="mt-6 w-full flex-grow">
                        <h4 className="text-lg font-bold text-white mb-3">Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Member Since</span>
                            <span className="text-white">{new Date(user.joinDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Last Active</span>
                            <span className="text-white">{new Date(user.lastActive).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Section - Takes 2/3 width on desktop */}
                <div className="w-full md:w-2/3 h-full">
                  <div className="h-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6">Player Statistics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <StatCard 
                        title="Total Games Played" 
                        value={user.totalGames} 
                        icon="🎮"
                        color="text-blue-400"
                      />
                      <StatCard 
                        title="Games Won" 
                        value={user.wins} 
                        icon="🏆"
                        color="text-green-400"
                      />
                      <StatCard 
                        title="Solutions Submitted" 
                        value={user.solutionsSubmitted} 
                        icon="✍️"
                        color="text-yellow-400"
                      />
                      <StatCard 
                        title="Win Percentage" 
                        value={`${winPercentage}%`} 
                        icon="📊"
                        color="text-purple-400"
                      />
                    </div>

                    {/* Achievements */}
                    <div className="mt-8">
                      <h4 className="text-lg font-bold text-white mb-4">Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.achievements.map((achievement, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-8 flex-grow">
                      <h4 className="text-lg font-bold text-white mb-4">Recent Activity</h4>
                      <div className="space-y-3">
                        <ActivityItem 
                          title="Solved 'Fibonacci Sequence' problem"
                          time="2 hours ago"
                          icon="✅"
                        />
                        <ActivityItem 
                          title="Reached new rating high: 2450"
                          time="1 day ago"
                          icon="📈"
                        />
                        <ActivityItem 
                          title="Competed in Weekly Challenge"
                          time="3 days ago"
                          icon="⚔️"
                        />
                        <ActivityItem 
                          title="Solved 'Prime Numbers' challenge"
                          time="5 days ago"
                          icon="✅"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Log Out
            </button>
            <Link 
              to="/profile/edit"
              className="bg-primary hover:bg-primary/80 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-gray-900/50 p-4 rounded-lg">
    <div className="flex items-center gap-3">
      <span className={`text-2xl ${color}`}>{icon}</span>
      <div>
        <h4 className="text-gray-400 text-sm">{title}</h4>
        <p className="text-white font-bold text-xl">{value}</p>
      </div>
    </div>
  </div>
);

// Reusable Activity Item Component
const ActivityItem = ({ title, time, icon }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-white">{title}</p>
      <p className="text-gray-400 text-xs">{time}</p>
    </div>
  </div>
);

export default Profile;