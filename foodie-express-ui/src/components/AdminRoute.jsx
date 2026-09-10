import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Check if user is logged in AND has the ROLE_ADMIN role
  if (!user || user.role !== 'ROLE_ADMIN') {
    toast.error("Access Denied: Admin privileges required! 🚫", {
        id: 'admin-denied'
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;