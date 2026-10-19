import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { logout } from "../../services/authService.jsx";
function Navbar() {
  const { isAuthenticated, clearSession } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Même si l'API répond par une erreur, on déconnecte côté React
    }
    clearSession();
    navigate("/connexion");
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        MaBoutique
      </Link>

      <nav>
        <NavLink to="/" end>
          Catalogue
        </NavLink>

        <NavLink to="/panier">
          Panier <span className="cart-count">0</span>
        </NavLink>

        {isAuthenticated ? (
          <>
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
