import { Route, Routes } from "react-router-dom";
import Compete from "./pages/compete/multiplayer.jsx";
import LeaderboardPage from "./pages/Leaderboard/leaderboard.jsx";
import Profile from "./pages/Profile/profile.jsx";
import Home from "./pages/home/Home.jsx";
import SignIn from "./pages/login/signIn.jsx";
import MatchmakingPage from "./pages/compete/matching.jsx";
import SinglePlayer from "./pages/compete/singleplayer.jsx";
import Multiplayer from "./pages/compete/multiplayer.jsx";
import Training from "./pages/compete/training.jsx";
import SpectatorPage from "./pages/Spectetor/LiveMatch.jsx";
import LiveMatches from "./pages/Spectetor/LiveMatch.jsx";
import SpectatorMode from "./pages/Spectetor/sepectetormode.jsx";

function App() {
  return (
    // Remove the Router component
    <div className="min-h-screen bg-gray-900 text-white w-full">
  
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn/>} />
          <Route path='/compete' element={<Compete />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
          <Route path='/livematches' element={<LiveMatches />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matching" element={<MatchmakingPage />} />
          <Route path="/singleplayer" element={<SinglePlayer />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/training" element={<Training />} />
          <Route path="/spectmatch" element={<SpectatorMode />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;