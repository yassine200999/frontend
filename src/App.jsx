import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Catalogue from "./pages/catalogue/Catalogue";
import ProduitDetail from "./pages/produitDetail/ProduitDetail";
import Panier from "./pages/panier/Panier";
import Profil from "./pages/profil/Profil";
import Connexion from "./pages/connexion/Connexion";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminRoute from "./components/protectedRoute/AdminRoute";
import AdminProduits from "./pages/admin/AdminProduits";
import AdminProduitForm from "./pages/admin/AdminProduitForm";
import AdminProduitModifier from "./pages/admin/AdminProduitModifier";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSousCategories from "./pages/admin/AdminSousCategories";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalogue />} />
        <Route path="/produit/:id" element={<ProduitDetail />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="produits" replace />} />
          <Route path="produits" element={<AdminProduits />} />
          <Route path="produits/nouveau" element={<AdminProduitForm />} />
          <Route
            path="produits/:id/modifier"
            element={<AdminProduitModifier />}
          />
          <Route path="categories" element={<AdminCategories />} />
          <Route
            path="categories/:categoryId/sous-categories"
            element={<AdminSousCategories />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
