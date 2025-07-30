import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loader-page">
        <Loader size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/cuenta/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
