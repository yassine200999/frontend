import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./componenst/laypout/Layout";
import Catalogue from "./pages/catalogue/Catalogue";
import ProduitDetail from "./pages/produitDetail/ProduitDetail";
import Panier from "./pages/panier/Panier";
import Profil from "./pages/profil/Profils";
import Connexion from "./pages/connection/Connection";
import ProtectedRoute from "./componenst/protectedRoute/ProtectedRoute";
import AdminProduitsList from "./componenst/AdminLayout";
import AdminRoute from "./componenst/protectedRoute/AdminRoute";
import AdminProduitForm from "./componenst/AdminProduits";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalogue />} />
        <Route path="/produit/:id" element={<ProduitDetail />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Navigate to="/admin/produits" replace /></AdminRoute>} />
        <Route path="/admin/produits" element={<AdminRoute><AdminProduitsList /></AdminRoute>} />
        <Route path="/admin/produits/nouveau" element={<AdminRoute><AdminProduitForm /></AdminRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
