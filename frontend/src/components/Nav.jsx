import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BellIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setAuthUser } from "../redux/userSlice";
import SignIn from "../pages/login/signIn";
import SignUp from "../pages/signup/signUp";

const Nav = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.authUser);
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users/me", { withCredentials: true });
        if (res.data.success) {
          dispatch(setAuthUser(res.data.user));
        }
      } catch (err) {
        console.error("User not logged in:", err);
      }
    };
    checkLoginStatus();
  }, [dispatch]);

  const handleNavigation = (path, requiresAuth = false) => {
    console.log(`Navigating to: ${path}, Auth required: ${requiresAuth}, LoggedIn: ${isLoggedIn}`);
    if (requiresAuth && !isLoggedIn) {
      console.log('Authentication required, showing sign in modal');
      localStorage.setItem('redirectAfterLogin', path);
      setShowSignIn(true);
      return;
    }
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    }
  };

  const handleSignUpSuccess = (userData) => {
    dispatch(setAuthUser(userData));
    setShowSignUp(false);
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    console.log('Signup successful, redirect path:', redirectPath);
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center rounded-lg border border-gray-700 shadow-lg bg-gray-900/80 backdrop-blur-sm px-4 py-3">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-white font-bold text-xl">
                HectoClash
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-12 items-center">
              <button
                onClick={() => handleNavigation('/')}
                className={`text-white hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary font-semibold' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/play')}
                className={`text-white hover:text-primary transition-colors ${location.pathname === '/compete' ? 'text-primary font-semibold' : ''}`}
              >
                Play
              </button>
              <button
                onClick={() => handleNavigation('/leaderboard')}
                className={`text-white hover:text-primary transition-colors ${location.pathname === '/leaderboard' ? 'text-primary font-semibold' : ''}`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => handleNavigation('/livematches')}
                className={`text-white hover:text-primary transition-colors ${location.pathname === '/spectate' ? 'text-primary font-semibold' : ''}`}
              >
                Spectator Mode
              </button>
              
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <button
                    className="text-white hover:text-primary transition-colors"
                    onClick={() => navigate("/notifications")}
                  >
                    <BellIcon className="h-6 w-6" />
                  </button>

                  <Link to="/profile">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 cursor-pointer shadow-md"
                      whileHover={{
                        scale: 1.2,
                        rotate: 10,
                        boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.5)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      <motion.span
                        className="text-xl font-bold text-primary"
                        whileHover={{
                          textShadow: "0px 0px 10px rgba(59, 130, 246, 0.8)",
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || "H"}
                      </motion.span>
                    </motion.div>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    className="hidden md:block text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowSignIn(true);
                    }}
                  >
                    Sign in
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button 
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-primary transition-colors"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-b-lg shadow-lg mx-4">
              <button
                onClick={() => handleNavigation('/')}
                className="block w-full text-left text-white hover:text-primary py-2 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/compete', true)}
                className="block w-full text-left text-white hover:text-primary py-2 transition-colors"
              >
                Compete
              </button>
              <button
                onClick={() => handleNavigation('/leaderboard')}
                className="block w-full text-left text-white hover:text-primary py-2 transition-colors"
              >
                Leaderboard
              </button>
              <button
                onClick={() => handleNavigation('/spectate')}
                className="block w-full text-left text-white hover:text-primary py-2 transition-colors"
              >
                Spectator Mode
              </button>
              <button
                onClick={() => handleNavigation('/profile', true)}
                className="block w-full text-left text-white hover:text-primary py-2 transition-colors"
              >
                Profile
              </button>
              {!isLoggedIn && (
                <div className="space-y-2">
                  <button
                    className="w-full text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowSignIn(true);
                    }}
                  >
                    Sign in
                  </button>
                  <button
                    className="w-full text-white bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowSignUp(true);
                    }}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {showSignIn && (
        <SignIn
          onClose={() => setShowSignIn(false)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
        />
      )}

      {showSignUp && (
        <SignUp
          onClose={() => setShowSignUp(false)}
          onSignUpSuccess={handleSignUpSuccess}
          onSwitchToSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
        />
      )}
    </>
  );
};

export default Nav;
