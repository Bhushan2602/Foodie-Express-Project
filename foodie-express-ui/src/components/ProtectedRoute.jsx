import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // We use a toast so the user knows why they were redirected
    toast.error("Please login to access this page!", {
      id: "protected-route-gate" // Ensures only one toast shows at a time
    });
    
    // Send them to login page
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, return the page they were trying to visit
  return children;
};

export default ProtectedRoute;