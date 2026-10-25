import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./componenst/laypout/Layout";
import Catalogue from "./pages/catalogue/Catalogue";
import ProduitDetail from "./pages/produitDetail/ProduitDetail";
import Panier from "./pages/panier/Panier";
import Profil from "./pages/profil/Profils";
import Connexion from "./pages/connection/Connection";
import ProtectedRoute from "./componenst/protectedRoute/ProtectedRoute";
import AdminLayout from "./componenst/AdminLayout";
import AdminRoute from "./componenst/protectedRoute/AdminRoute";
import AdminProduits from "./componenst/AdminProduits";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalogue />} />
        <Route path="/produit/:id" element={<ProduitDetail />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="produits" replace />} />
          <Route path="produits" element={<AdminProduits />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
