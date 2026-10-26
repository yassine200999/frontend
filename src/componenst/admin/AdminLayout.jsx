import { Link, NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Menu à gauche, fond sombre */}
      <aside className="sidebar">
        <div className="brand">
          MaBoutique <span>Admin</span>
        </div>

        <p className="group-title">Catalogue</p>
        {/* end : le lien "Produits" n'est actif que sur /admin/produits exactement,
            pas aussi sur /admin/produits/nouveau */}
        <NavLink to="/admin/produits" end>
          Produits
        </NavLink>
        <NavLink to="/admin/produits/nouveau">Ajouter un produit</NavLink>
        <NavLink to="/admin/categories">Catégories</NavLink>

        {/* Link (et non NavLink) : ce lien ne doit jamais apparaître "actif".
            La classe "back" le place tout en bas du menu. */}
        <Link to="/" className="back">
          ← Retour au site
        </Link>
      </aside>

      {/* Contenu à droite. Outlet : l'emplacement où s'affiche la page enfant choisie par l'URL */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
