import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = Boolean(
    user?.is_admin || user?.admin || user?.is_staff || user?.is_superuser
  );

  if (!isAuthenticated) return <Navigate to="/connexion" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
