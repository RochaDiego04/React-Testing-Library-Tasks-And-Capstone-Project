import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedComponent = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <div>Protected Content</div>;
};

export default ProtectedComponent;
