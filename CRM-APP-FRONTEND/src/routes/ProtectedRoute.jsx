import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
  const currentUser = localStorage.getItem("currentUser");

  if (!token || !currentUser) {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("currentUser");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
