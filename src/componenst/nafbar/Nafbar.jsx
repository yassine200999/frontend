import { Link, NavLink } from "react-router-dom";
function Nafbar() {
  return (
    <header className="Nafbar">
      <Link to="/" className="logo">
        Ma Boutique
      </Link>
      <nav>
        <NavLink to="/" end>
          Catalogue
        </NavLink>
        <NavLink to="/panier">
          Panier <span className="cart-count">0</span>
        </NavLink>
        <NavLink to="/connexion">Connexion</NavLink>
        <NavLink to="/profil">Profil</NavLink>
      </nav>
    </header>
  );
}
export default Nafbar;