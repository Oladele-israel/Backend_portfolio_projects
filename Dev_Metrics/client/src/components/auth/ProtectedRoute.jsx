import { useAuthContext } from "../../contexts/authContext.jsx";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userDetails, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while checking authentication
  }

  if (!userDetails) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return children ? children : <Outlet />; // Render the protected component if authenticated
};

export default ProtectedRoute;
