import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/connexion" replace />;
}
export default ProtectedRoute;
