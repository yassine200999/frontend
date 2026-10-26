import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Garde d'accès : elle entoure une page et décide si on peut l'afficher.
const AdminRoute = ({ children }) => {
  // On lit le Context d'authentification : connecté ? et quel utilisateur ?
  const { isAuthenticated, user } = useAuth();

  // Pas connecté : on renvoie vers la page de connexion.
  // replace : la page interdite ne reste pas dans l'historique du navigateur.
  if (!isAuthenticated) return <Navigate to="/connexion" replace />;

  // Connecté mais pas admin : retour à l'accueil.
  // "?." évite une erreur si user n'existe pas.
  if (!user?.is_admin) return <Navigate to="/" replace />;

  // Admin : on affiche la page demandée.
  return children;
};

export default AdminRoute;
