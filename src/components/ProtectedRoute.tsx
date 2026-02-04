import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = true }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // console.log('ProtectedRoute - adminOnly:', adminOnly, 'user:', user?.id, 'profile:', profile, 'role:', profile?.role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071F35]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#F58021] animate-spin" />
          <span className="text-white/70">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
