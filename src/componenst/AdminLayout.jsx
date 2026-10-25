import { useEffect, useState } from "react";
import ProductImage from "./productedImage/ProductImage";
import { deleteProduct, getAllProducts } from "../services/productService";
import { getErrorMessage } from "../services/errors";
import { Link } from "react-router-dom";

const AdminProduits = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data : data["list product"] ?? []);
      } catch (err) {
        setLoadError(getErrorMessage(err, "Impossible de charger les produits."));
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer « ${product.name} » ?`)) return;
    setActionError("");
    setSuccess("");
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((p) => p.id !== product.id));
      setSuccess(`Produit « ${product.name} » supprimé.`);
    } catch (err) {
      setActionError(getErrorMessage(err, "Suppression impossible (erreur du serveur)."));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="muted">Chargement des produits...</p>;
  if (loadError) return <p className="error-box">{loadError}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Produits ({products.length})</h1>
        <Link to="/admin/produits/nouveau" className="btn btn-primary">Ajouter un produit</Link>
      </div>
      {actionError && <p className="error-box">{actionError}</p>}
      {success && <p className="success">{success}</p>}
      {products.length === 0 ? (
        <p className="muted">Aucun produit pour le moment.</p>
      ) : (
        <table className="table">
          <thead><tr><th>Image</th><th>Nom</th><th>Prix</th><th>Sous-catégories</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td><ProductImage src={product.images?.[0]?.image_url} alt={product.name} width={60} /></td>
                <td>{product.name}</td>
                <td>{product.price} DT</td>
                <td>{product.subcategories?.join(", ")}</td>
                <td>
                  <button type="button" className="btn btn-dark" onClick={() => handleDelete(product)} disabled={deletingId === product.id}>
                    {deletingId === product.id ? "Suppression..." : "Supprimer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProduits;
