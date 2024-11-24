// sonar.ignore
/* istanbul ignore file */
import React from "react";
import { Navigate } from "react-router-dom";
import { useProfileContext } from "../contexts/ProfileContext"; // Importa el contexto

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { profile, isLoading } = useProfileContext();

  if (isLoading) {
    return null;
  }

  if (!profile || !profile.user) {
    return <Navigate to="/signin" />;
  }

  const userRole = profile.user.role?.split("-")[1] || "";

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
