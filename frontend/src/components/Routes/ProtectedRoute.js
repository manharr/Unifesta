import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminLoggedIn);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem("adminId")) {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    setIsAuthenticated(isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
