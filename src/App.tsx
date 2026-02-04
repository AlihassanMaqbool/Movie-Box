import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AddMovie from '@/pages/AddMovie';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import ProtectedRoute from '@/components/ProtectedRoute';

// Loading component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-[#071F35] flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-[#F58021]/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F58021] animate-spin"></div>
      </div>
      <span className="text-white font-medium tracking-wider">Loading...</span>
    </div>
  </div>
);

// Animated page wrapper
const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      return;
    }
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};

// App content
const AppContent = () => {
  const { loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#071F35]">
        <Navbar />
        <main className="relative">
          <Routes>
            <Route path="/" element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            } />
            <Route path="/login" element={
              <AnimatedPage>
                <Login />
              </AnimatedPage>
            } />
            <Route path="/signup" element={
              <AnimatedPage>
                <Signup />
              </AnimatedPage>
            } />
            <Route path="/add-movie" element={
              // <ProtectedRoute adminOnly>
                <AnimatedPage>
                  <AddMovie />
                </AnimatedPage>
              // </ProtectedRoute>
            } />
            <Route path="/about" element={
              <AnimatedPage>
                <About />
              </AnimatedPage>
            } />
            <Route path="/contact" element={
              <AnimatedPage>
                <Contact />
              </AnimatedPage>
            } />
            <Route path="/privacy" element={
              <AnimatedPage>
                <Privacy />
              </AnimatedPage>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#071F35',
              color: '#fff',
              border: '1px solid #F58021',
            },
          }}
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
