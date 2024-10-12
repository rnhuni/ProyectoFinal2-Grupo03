import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); 

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
