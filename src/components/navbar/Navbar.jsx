import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { logout } from "../../services/authService.jsx";

function Navbar() {
  const { isAuthenticated, user, setUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = Boolean(
    user?.is_admin || user?.admin || user?.is_staff || user?.is_superuser
  );

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setUser(null);
      navigate("/connexion");
    }
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">MaBoutique</Link>
      <nav>
        <NavLink to="/" end>Catalogue</NavLink>
        <NavLink to="/panier">Panier</NavLink>
        {isAuthenticated ? (
          <>
            {isAdmin && <NavLink to="/admin">Administration</NavLink>}
            <NavLink to="/profil">Profil</NavLink>
            <button type="button" className="btn btn-sm" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <NavLink to="/connexion" className="btn btn-primary btn-sm">
            Connexion
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
