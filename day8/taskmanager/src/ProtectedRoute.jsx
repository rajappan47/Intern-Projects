import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ redirectIfAuthenticated = false }) => {
  const { user } = useAuth();

  if (redirectIfAuthenticated && user) {
    return <Navigate to="/dashboard/tasks" replace />;
  }

  if (!redirectIfAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};