import { useEffect, useState } from "react";
import ProductImage from "../../components/productImage/ProductImage";
import { deleteProduct, getAllProducts } from "../../services/productService";
import { getErrorMessage } from "../../services/errors";
import { Link } from "react-router-dom";

const AdminProduits = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState(""); // erreur d'une suppression
  const [success, setSuccess] = useState(""); // message de réussite
  const [deletingId, setDeletingId] = useState(null); // id du produit en cours de suppression

  // ---------- Chargement de la liste au démarrage ----------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data["list product"] ?? []);
      } catch (err) {
        setLoadError(
          getErrorMessage(err, "Impossible de charger les produits."),
        );
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    // window.confirm ouvre une boîte Oui/Non. Non -> on s'arrête, rien n'est supprimé.
    if (!window.confirm(`Supprimer « ${product.name} » ?`)) return;

    setActionError("");
    setSuccess("");
    setDeletingId(product.id); // sert à désactiver le bouton pendant l'appel

    try {
      await deleteProduct(product.id);
      // Succès : on retire le produit de la liste affichée, sans rappeler l'API.
      // filter garde tous les produits SAUF celui qu'on vient de supprimer.
      setProducts(products.filter((p) => p.id !== product.id));
      setSuccess(`Produit « ${product.name} » supprimé.`);
    } catch (err) {
      // Si le backend plante (500), le corps n'est pas du JSON lisible :
      // getErrorMessage renvoie alors le message par défaut ci-dessous.
      setActionError(
        getErrorMessage(err, "Suppression impossible (erreur du serveur)."),
      );
    } finally {
      setDeletingId(null); // dans tous les cas, on réactive le bouton
    }
  };

  return (
    <>
      {/* .row-between existe dans ton CSS : titre à gauche, bouton à droite */}
      <div className="row-between">
        <h1>Produits ({products.length})</h1>
        <Link to="/admin/produits/nouveau" className="btn btn-primary">
          Ajouter un produit
        </Link>
      </div>

      {actionError && <p className="error-box">{actionError}</p>}
      {success && <p className="success">{success}</p>}

      {products.length === 0 ? (
        <p className="muted">Aucun produit pour le moment.</p>
      ) : (
        // .table-wrapper : cadre blanc arrondi, avec défilement horizontal si l'écran est étroit
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Sous-catégories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Une ligne par produit ; key = id unique */}
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <ProductImage
                      src={product.images?.[0]}
                      alt={product.name}
                      width={60}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price} DT</td>
                  {/* join assemble le tableau en texte séparé par des virgules */}
                  <td>{product.subcategories?.join(", ")}</td>
                  {/* .actions : boutons alignés à droite, avec un petit espace entre eux */}
                  <td className="actions">
                    <Link
                      to={`/admin/produits/${product.id}/modifier`}
                      className="btn btn-sm"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product)}
                      // désactivé seulement pour la ligne en cours de suppression
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id
                        ? "Suppression..."
                        : "Supprimer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminProduits;
