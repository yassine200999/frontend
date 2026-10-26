import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productService";
import { getErrorMessage } from "../../services/errors";

const AdminProduitNouveau = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    if (subcategory.trim()) {
      formData.append("subcategory", subcategory.trim());
    }
    images.forEach((image) => formData.append("images", image));

    try {
      await createProduct(formData);
      navigate("/admin/produits");
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de créer le produit."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="row-between">
        <h1>Ajouter un produit</h1>
        <Link to="/admin/produits" className="btn">Retour aux produits</Link>
      </div>

      {error && <p className="error-box">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="product-name">Nom du produit</label>
        <input id="product-name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="product-price">Prix</label>
        <input id="product-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label htmlFor="product-subcategory">ID de la sous-catégorie</label>
        <input id="product-subcategory" type="number" min="1" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required />

        <label htmlFor="product-images">Images du produit</label>
        <input id="product-images" type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files ?? []))} />

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : "Créer le produit"}
        </button>
      </form>
    </section>
  );
};

export default AdminProduitNouveau;
