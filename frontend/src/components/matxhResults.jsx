import React from 'react';
import { useNavigate } from 'react-router-dom';

const tempUser = {
  name: 'Alice',
  avatar: '🧠',
  rating: 1450,
  attempts: [
    { number: 1, expression: '2 + 2 = 4', correct: true, result: '4' },
    { number: 2, expression: '5 * 3 = 15', correct: true, result: '15' },
    { number: 3, expression: '10 / 2 = 4', correct: false, result: '5' },
  ],
};

const tempOpponent = {
  name: 'Bob',
  avatar: '🤖',
  rating: 1500,
  attempts: [
    { number: 1, expression: '2 + 3 = 5', correct: true, result: '5' },
    { number: 2, expression: '4 * 4 = 16', correct: true, result: '16' },
    { number: 3, expression: '8 - 3 = 6', correct: false, result: '5' },
  ],
};

const tempResult = 'win'; // 'win' | 'loss' | 'draw'

const MatchResult = () => {
  const navigate = useNavigate();

  const user = tempUser;
  const opponent = tempOpponent;
  const result = tempResult;

  const calculateStats = () => {
    const userCorrect = user.attempts.filter(a => a.correct).length;
    const opponentCorrect = opponent.attempts.filter(a => a.correct).length;

    const userAccuracy = Math.round((userCorrect / user.attempts.length) * 100);
    const opponentAccuracy = Math.round((opponentCorrect / opponent.attempts.length) * 100);

    let ratingChange = 0;
    if (result === 'win') ratingChange = 100;
    else if (result === 'loss') ratingChange = -100;
    else ratingChange = -50;

    return {
      userCorrect,
      opponentCorrect,
      userAccuracy,
      opponentAccuracy,
      ratingChange,
      matchResult: result,
      newUserRating: user.rating + ratingChange,
      newOpponentRating: opponent.rating - ratingChange,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Match Statistics</h1>

        {/* Result Banner */}
        <div
          className={`p-4 rounded-lg mb-8 text-center ${
            stats.matchResult === 'win'
              ? 'bg-green-900'
              : stats.matchResult === 'loss'
              ? 'bg-red-900'
              : 'bg-yellow-900'
          }`}
        >
          <h2 className="text-2xl font-bold">
            {stats.matchResult === 'win'
              ? '🎉 You Won!'
              : stats.matchResult === 'loss'
              ? '😞 You Lost'
              : '🤝 Match Draw'}
          </h2>
          <p className="mt-2">
            {stats.ratingChange > 0 ? '+' : ''}
            {stats.ratingChange} Rating ({user.rating} → {stats.newUserRating})
          </p>
        </div>

        {/* Player Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center border-2 border-blue-500/30 mr-4">
                <span className="text-2xl font-bold text-blue-400">{user.avatar}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Rating: {user.rating}</span>
                  <span className={stats.ratingChange > 0 ? 'text-green-500' : 'text-red-500'}>
                    {stats.ratingChange > 0 ? `+${stats.ratingChange}` : stats.ratingChange}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Attempts:</span>
                <span>{user.attempts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Correct Solutions:</span>
                <span>{stats.userCorrect}</span>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span>{stats.userAccuracy}%</span>
              </div>
            </div>
          </div>

          {/* Opponent */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center border-2 border-purple-500/30 mr-4">
                <span className="text-2xl font-bold text-purple-400">{opponent.avatar}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{opponent.name}</h3>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Rating: {opponent.rating}</span>
                  <span className={stats.ratingChange > 0 ? 'text-red-500' : 'text-green-500'}>
                    {stats.ratingChange > 0 ? `-${stats.ratingChange}` : `+${-stats.ratingChange}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Attempts:</span>
                <span>{opponent.attempts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Correct Solutions:</span>
                <span>{stats.opponentCorrect}</span>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span>{stats.opponentAccuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Your Attempts */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-4">Your Attempts</h3>
          <div className="space-y-3">
            {user.attempts.length > 0 ? (
              user.attempts.map(attempt => (
                <div
                  key={attempt.number}
                  className={`p-3 rounded-lg ${
                    attempt.correct
                      ? 'bg-green-900/30 border border-green-800'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Attempt #{attempt.number}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        attempt.correct
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {attempt.correct ? 'Correct' : `Incorrect (${attempt.result})`}
                    </span>
                  </div>
                  <div className="text-sm font-mono bg-gray-900 p-2 rounded mt-1 break-all">
                    {attempt.expression}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No attempts made</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/play')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex-1"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex-1"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchResult;
