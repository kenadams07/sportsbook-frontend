import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useSelector((state) => state.Login || {});

  // If isAuthenticated is undefined or null, we might be in a loading state
  if (isAuthenticated === undefined || isAuthenticated === null) {
    // Optionally show a loading indicator here
    return null; // or a loading spinner
  }

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;