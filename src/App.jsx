import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import SchemeDetails from "./pages/SchemeDetails";
import SavedSchemes from "./pages/SavedSchemes";
import ChatAssistant from "./pages/ChatAssistant";

// Simple wrapper component for protecting paths that require login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useApp();
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50 dark:bg-[#0b0f19]">
        <div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      {/* Global blurring glow elements for background */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-200" />
      
      {/* Header Navigation */}
      <Navbar />

      {/* Main Switchboard */}
      <main className="flex-grow flex flex-col items-stretch overflow-x-hidden">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/schemes/:id" 
            element={
              <ProtectedRoute>
                <SchemeDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute>
                <SavedSchemes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatAssistant />
              </ProtectedRoute>
            } 
          />

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
