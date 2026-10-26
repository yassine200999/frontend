import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productService";
import { getAllSubcategories } from "../../services/categoryService";
import { getErrorMessage } from "../../services/errors";

const AdminProduitNouveau = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getAllSubcategories()
      .then((data) => {
        if (active) setSubcategories(data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Impossible de charger les sous-catégories."));
      })
      .finally(() => {
        if (active) setLoadingSubcategories(false);
      });
    return () => { active = false; };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (selectedSubcategories.length === 0) {
      setError("Choisissez au moins une sous-catégorie.");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    selectedSubcategories.forEach((id) => formData.append("subcategory", id));
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

  const toggleSubcategory = (id) => {
    setSelectedSubcategories((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  return (
    <section>
      <div className="row-between">
        <h1>Ajouter un produit</h1>
        <Link to="/admin/produits" className="btn">Retour aux produits</Link>
      </div>

      {error && <p className="error-box">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="product-name">Nom du produit</label>
        <input id="product-name" value={name} onChange={(event) => setName(event.target.value)} required />

        <label htmlFor="product-price">Prix (DT)</label>
        <input id="product-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required />

        <fieldset>
          <legend>Sous-catégories</legend>
          {loadingSubcategories ? (
            <p className="muted">Chargement des sous-catégories...</p>
          ) : subcategories.length === 0 ? (
            <p className="muted">Aucune sous-catégorie disponible.</p>
          ) : (
            <div className="form-group">
              {subcategories.map((subcategory) => (
                <label key={subcategory.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedSubcategories.includes(String(subcategory.id))}
                    onChange={() => toggleSubcategory(String(subcategory.id))}
                  />
                  {subcategory.name}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <label htmlFor="product-images">Images du produit</label>
        <input id="product-images" type="file" accept="image/*" multiple onChange={(event) => setImages(Array.from(event.target.files ?? []))} />

        <button type="submit" className="btn btn-primary" disabled={saving || loadingSubcategories}>
          {saving ? "Enregistrement..." : "Créer le produit"}
        </button>
      </form>
    </section>
  );
};

export default AdminProduitNouveau;
