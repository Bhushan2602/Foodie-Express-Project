import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RestaurantOwnerRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || (user.role !== 'ROLE_RESTAURANT_OWNER' && user.role !== 'ROLE_ADMIN')) {
    toast.error("Access Denied: Restaurant Owner access required!", {
      id: 'owner-denied'
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RestaurantOwnerRoute;
