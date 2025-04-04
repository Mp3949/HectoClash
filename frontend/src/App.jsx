import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/home";
// import Compete from "./pages/compete/multiplayer.jsx";
// import LeaderboardPage from "./pages/Leaderboard/leaderboard.jsx";
// import SpectatePage from "./pages/Spectetor/SpectMatch.jsx";
// import Profile from "./pages/Profile/profile.jsx";

function App() {
  return (
    // Remove the Router component
    <div className="min-h-screen bg-gray-900 text-white w-full">
  
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home/>} />
          {/* <Route path="/login" element={<SignIn/>} />
          <Route path='/compete' element={<Compete />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
          <Route path='/spectate' element={<SpectatePage />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;