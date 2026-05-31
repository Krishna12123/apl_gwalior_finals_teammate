import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  Menu, X, Settings, LogOut, User, Sparkles, BookMarked, LayoutDashboard, Key, Eye, EyeOff
} from "lucide-react";

export default function Navbar() {
  const { 
    user, 
    logoutUser, 
    isDemoMode, 
    geminiKey, 
    firebaseConfigStr, 
    saveCustomSettings 
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Settings Form State
  const [tempGeminiKey, setTempGeminiKey] = useState(geminiKey);
  const [tempFirebaseConfig, setTempFirebaseConfig] = useState(firebaseConfigStr);
  const [showKey, setShowKey] = useState(false);

  const activeLink = (path) => {
    return location.pathname === path
      ? "text-brand-600 dark:text-brand-400 font-semibold bg-brand-50/50 dark:bg-brand-950/20 px-3 py-2 rounded-lg"
      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 transition-colors";
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setShowDropdown(false);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveCustomSettings(tempGeminiKey, tempFirebaseConfig);
    setShowSettings(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-blue-500 dark:from-brand-400 dark:to-blue-400 bg-clip-text text-transparent">
                  SchemeAI
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <>
                  <Link to="/dashboard" className={activeLink("/dashboard")}>
                    <div className="flex items-center gap-1">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </div>
                  </Link>
                  <Link to="/chat" className={activeLink("/chat")}>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      AI Assistant
                    </div>
                  </Link>
                  <Link to="/saved" className={activeLink("/saved")}>
                    <div className="flex items-center gap-1">
                      <BookMarked className="h-4 w-4" />
                      Saved
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* Right Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Demo Mode Badge */}
              <div 
                className={`text-xs px-2.5 py-1 rounded-full font-medium border flex items-center gap-1 ${
                  isDemoMode 
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" 
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${isDemoMode ? "bg-amber-500" : "bg-emerald-500"}`} />
                {isDemoMode ? "Demo Mode" : "Live Mode"}
              </div>

              {/* Settings Gear */}
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Configure API Keys"
              >
                <Settings className="h-5 w-5" />
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate pr-1">
                      {user.displayName || "User"}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User className="h-4 w-4" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/profile"
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-md hover:shadow-brand-500/20 hover:opacity-95 transition-all"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={() => setShowSettings(true)}
                className="p-1.5 text-slate-500 rounded-lg"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-500 dark:text-slate-400 rounded-lg"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  AI Assistant
                </Link>
                <Link
                  to="/saved"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Saved Schemes
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-t border-slate-200 dark:border-slate-800 mt-2"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-base font-medium text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2.5 bg-brand-600 text-white rounded-xl text-base font-medium"
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Settings Dialog Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white mb-4">
              SchemeAI Setup
            </h3>

            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">System Mode</span>
                <span className="text-xs text-slate-500">How the app connects to services</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isDemoMode 
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" 
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              }`}>
                {isDemoMode ? "Demo Mode (Offline)" : "Live Mode (Firebase)"}
              </span>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Gemini API Key */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5" />
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={tempGeminiKey}
                    onChange={(e) => setTempGeminiKey(e.target.value)}
                    placeholder="Enter your Gemini API key (e.g. AIzaSy...)"
                    className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showKey ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Obtained from Google AI Studio. Left empty to use the simulated mock assistant.
                </p>
              </div>

              {/* Firebase Config JSON */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  Firebase Config Object (JSON)
                </label>
                <textarea
                  value={tempFirebaseConfig}
                  onChange={(e) => setTempFirebaseConfig(e.target.value)}
                  placeholder={`{\n  "apiKey": "...",\n  "authDomain": "...",\n  "projectId": "..."\n}`}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Paste the JSON configuration object from your Firebase Console. If blank, LocalStorage is used.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-200 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700"
                >
                  Save and Reload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
