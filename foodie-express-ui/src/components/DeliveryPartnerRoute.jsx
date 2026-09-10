import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DeliveryPartnerRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || (user.role !== 'ROLE_DELIVERY_PARTNER' && user.role !== 'ROLE_ADMIN')) {
    toast.error("Access Denied: Delivery Partner access required!", {
      id: 'delivery-denied'
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DeliveryPartnerRoute;
