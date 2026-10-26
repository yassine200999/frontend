import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productService";
import { getAllSubcategories } from "../../services/categoryService";
import { getErrorMessage } from "../../services/errors";

const AdminProduitNouveau = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const data = await getAllSubcategories();
        setSubcategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de charger les sous-catégories."));
      } finally {
        setLoadingCategories(false);
      }
    };
    loadSubcategories();
  }, []);

  const handleSubcategoriesChange = (event) => {
    setSelectedSubcategories(
      Array.from(event.target.selectedOptions, (option) => option.value),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Le nom du produit est obligatoire.");
      return;
    }
    if (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0) {
      setError("Saisissez un prix valide.");
      return;
    }
    if (selectedSubcategories.length === 0) {
      setError("Choisissez au moins une sous-catégorie.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    selectedSubcategories.forEach((id) => formData.append("subcategory", id));
    images.forEach((image) => formData.append("images", image));

    setSaving(true);
    try {
      await createProduct(formData);
      navigate("/admin/produits");
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de créer le produit."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <p className="breadcrumb">
        <Link to="/admin/produits">Produits</Link> / Ajouter
      </p>
      <h1>Ajouter un produit</h1>

      {error && <p className="error-box">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product-name">Nom du produit</label>
          <input
            id="product-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-price">Prix (DT)</label>
          <input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-subcategories">Sous-catégories</label>
          <select
            id="product-subcategories"
            multiple
            value={selectedSubcategories}
            onChange={handleSubcategoriesChange}
            disabled={loadingCategories || subcategories.length === 0}
            required
          >
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          {loadingCategories && <p className="muted">Chargement des sous-catégories...</p>}
          {!loadingCategories && subcategories.length === 0 && (
            <p className="muted">Créez d'abord une sous-catégorie dans la section Catégories.</p>
          )}
          <p className="muted">Maintenez Ctrl pour sélectionner plusieurs sous-catégories.</p>
        </div>

        <div className="form-group">
          <label htmlFor="product-images">Images du produit</label>
          <input
            id="product-images"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setImages(Array.from(event.target.files || []))}
          />
          {images.length > 0 && (
            <p className="muted">{images.length} image(s) sélectionnée(s).</p>
          )}
        </div>

        <div className="row">
          <button type="submit" className="btn btn-primary" disabled={saving || loadingCategories}>
            {saving ? "Enregistrement..." : "Ajouter le produit"}
          </button>
          <Link to="/admin/produits" className="btn">
            Annuler
          </Link>
        </div>
      </form>
    </>
  );
};

export default AdminProduitNouveau;
