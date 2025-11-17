// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // We will create this context next

const PrivateRoute = () => {
  // We will get the 'token' from our AuthContext
  const { token } = useAuth();

  // If there is a token, render the child component's route
  // Otherwise, navigate them to the /login page
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;