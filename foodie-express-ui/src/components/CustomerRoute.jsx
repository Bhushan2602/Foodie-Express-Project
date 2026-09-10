import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CustomerRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'ROLE_USER') {
    toast.error("This page is for customers only!", {
      id: 'customer-denied'
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CustomerRoute;
