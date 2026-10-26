import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllSubcategories } from "../../services/categoryService";
import { getProductById, updateProduct } from "../../services/productService";
import { getImageUrl } from "../../utils/getImageUrl";

const getMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  "Une erreur est survenue.";

const AdminProduitModifier = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [data, allSubcategories] = await Promise.all([
          getProductById(id),
          getAllSubcategories(),
        ]);
        const product = data?.product ?? data;

        if (!active) return;
        setName(product.name ?? "");
        setPrice(String(product.price ?? ""));
        setSelectedSubcategories((product.subcategory ?? []).map(String));
        setCurrentImages(product.images ?? []);
        setSubcategories(allSubcategories);
      } catch (err) {
        if (active) setError(getMessage(err) || "Impossible de charger le produit.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const toggleSubcategory = (subcategoryId) => {
    setSelectedSubcategories((current) =>
      current.includes(subcategoryId)
        ? current.filter((value) => value !== subcategoryId)
        : [...current, subcategoryId],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Le nom du produit est obligatoire.");
      return;
    }
    if (price === "" || !Number.isFinite(Number(price)) || Number(price) <= 0) {
      setError("Le prix doit être supérieur à 0.");
      return;
    }
    if (selectedSubcategories.length === 0) {
      setError("Choisissez au moins une sous-catégorie.");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    selectedSubcategories.forEach((value) => formData.append("subcategory", value));
    newImages.forEach((image) => formData.append("images", image));

    try {
      await updateProduct(id, formData);
      navigate("/admin/produits");
    } catch (err) {
      setError(getMessage(err) || "Impossible de modifier le produit.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="muted">Chargement du produit...</p>;

  return (
    <section>
      <div className="row-between">
        <h1>Modifier le produit</h1>
        <Link to="/admin/produits" className="btn">
          Retour aux produits
        </Link>
      </div>

      {error && <p className="error-box">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="edit-product-name">Nom du produit</label>
        <input
          id="edit-product-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="edit-product-price">Prix (DT)</label>
        <input
          id="edit-product-price"
          type="number"
          min="0.01"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <fieldset>
          <legend>Sous-catégories</legend>
          {subcategories.map((subcategory) => (
            <label
              key={subcategory.id}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={selectedSubcategories.includes(String(subcategory.id))}
                onChange={() => toggleSubcategory(String(subcategory.id))}
              />
              {subcategory.name}
            </label>
          ))}
        </fieldset>

        {currentImages.length > 0 && (
          <div>
            <p>Images actuelles</p>
            <div className="previews">
              {currentImages.map((image, index) => {
                const src =
                  typeof image === "string"
                    ? image
                    : image.image_url || image.url || image.image;
                if (!src) return null;
                return (
                  <img
                    key={image.id ?? src ?? index}
                    src={getImageUrl(src)}
                    alt={name}
                    style={{ width: 90, height: 90, objectFit: "contain" }}
                  />
                );
              })}
            </div>
          </div>
        )}

        <label htmlFor="edit-product-images">Ajouter des images (facultatif)</label>
        <input
          id="edit-product-images"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => setNewImages(Array.from(event.target.files ?? []))}
        />

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </section>
  );
};

export default AdminProduitModifier;
