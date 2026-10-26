import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllSubcategories } from "../../services/categoryService";
import { getProductById, updateProduct } from "../../services/productService";
import { getErrorMessage } from "../../services/errors";

const AdminProduitModifier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getProductById(id), getAllSubcategories()])
      .then(([product, allSubcategories]) => {
        if (!active) return;
        setName(product.name ?? "");
        setPrice(String(product.price ?? ""));
        setSelectedSubcategories((product.subcategory ?? []).map(String));
        setSubcategories(allSubcategories);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Impossible de charger le produit."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  const toggleSubcategory = (subcategoryId) => {
    setSelectedSubcategories((current) =>
      current.includes(subcategoryId)
        ? current.filter((value) => value !== subcategoryId)
        : [...current, subcategoryId],
    );
  };

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
    selectedSubcategories.forEach((value) => formData.append("subcategory", value));
    images.forEach((image) => formData.append("images", image));
    try {
      await updateProduct(id, formData);
      navigate("/admin/produits");
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de modifier le produit."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Chargement du produit...</p>;

  return (
    <section>
      <div className="row-between">
        <h1>Modifier le produit</h1>
        <Link to="/admin/produits" className="btn">Retour aux produits</Link>
      </div>
      {error && <p className="error-box">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="edit-product-name">Nom du produit</label>
        <input id="edit-product-name" value={name} onChange={(event) => setName(event.target.value)} required />
        <label htmlFor="edit-product-price">Prix (DT)</label>
        <input id="edit-product-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required />
        <fieldset>
          <legend>Sous-catégories</legend>
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
        </fieldset>
        <label htmlFor="edit-product-images">Ajouter des images (facultatif)</label>
        <input id="edit-product-images" type="file" accept="image/*" multiple onChange={(event) => setImages(Array.from(event.target.files ?? []))} />
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </section>
  );
};

export default AdminProduitModifier;
