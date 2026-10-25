import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllCategories,
  getSubcategoriesByCategory,
} from "../services/categoryService";
import { createProduct } from "../services/productService";
import { getErrorMessage } from "../services/errors";

const AdminProduitForm = () => {
  const [form, setForm] = useState({ name: "", price: "" });

  // ---------- Catégories et sous-catégories ----------
  const [categories, setCategories] = useState([]); // les  catégories
  const [selectedCategory, setSelectedCategory] = useState(""); // id de la catégorie choisie
  const [subcategories, setSubcategories] = useState([]); // sous-catégories de la catégorie choisie
  const [selectedSubs, setSelectedSubs] = useState([]); // sous-catégories cochées : [{id, name}]

  // ---------- Fichiers ----------
  const [images, setImages] = useState([]); // tableau d'objets File
  const [fileInputKey, setFileInputKey] = useState(0); // sert à vider le champ fichier

  // ---------- Messages et chargement ----------
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Au démarrage : charger les catégories pour le menu déroulant
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de charger les catégories."));
      }
    };
    loadCategories();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Quand on choisit une catégorie : on charge ses sous-catégories : // input de type select
  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    setSubcategories([]);
    if (categoryId === "") return; // "Choisir..." : rien à charger

    try {
      const data = await getSubcategoriesByCategory(Number(categoryId));
      setSubcategories(data);
    } catch (err) {
      setError(
        getErrorMessage(err, "Impossible de charger les sous-catégories."),
      );
    }
  };

  // Coche ou décoche une sous-catégorie
  const toggleSubcategory = (sub) => {
    const alreadySelected = selectedSubs.some((s) => s.id === sub.id);
    if (alreadySelected) {
      // décocher : on garde toutes les autres
      setSelectedSubs(selectedSubs.filter((s) => s.id !== sub.id));
    } else {
      // cocher : on ajoute à la fin (nouveau tableau, jamais push)
      setSelectedSubs([...selectedSubs, { id: sub.id, name: sub.name }]);
    }
  };

  // Champ fichier : event.target.files est une FileList, on la convertit en vrai tableau
  const handleFilesChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  // Envoi du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Validations côté client
    if (!form.name.trim() || form.price === "") {
      setError("Le nom et le prix sont obligatoires.");
      return;
    }
    if (Number(form.price) <= 0) {
      setError("Le prix doit être supérieur à 0.");
      return;
    }
    if (selectedSubs.length === 0) {
      setError("Choisissez au moins une sous-catégorie.");
      return;
    }
    if (images.length === 0) {
      setError("Ajoutez au moins une image.");
      return;
    }

    // FormData : le "colis" multipart que le backend attend
    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("price", form.price);
    // Clé répétée : une ligne "subcategories" par id (comme dans Postman)
    selectedSubs.forEach((sub) => formData.append("subcategories", sub.id));
    // Idem pour les images : une ligne "images" par fichier
    images.forEach((file) => formData.append("images", file));

    setLoading(true);
    try {
      await createProduct(formData);
      setSuccess("Produit ajouté avec succès.");
      // On remet le formulaire à zéro pour en ajouter un autre
      setForm({ name: "", price: "" });
      setSelectedSubs([]);
      setImages([]);
      setFileInputKey(fileInputKey + 1); // change la key : React recrée le champ fichier, vide
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'ajouter le produit."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ajouter un produit</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Prix (DT)</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01" // autorise les centimes
            value={form.price}
            onChange={handleChange}
          />
        </div>
        {/* Niveau 1 : la catégorie */}
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Choisir...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {/* Niveau 2 : les sous-catégories de la catégorie choisie (cases à cocher) */}
        {subcategories.length > 0 && (
          <div className="form-group">
            <label>Sous-catégories</label>
            {subcategories.map((sub) => (
              <label key={sub.id} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={selectedSubs.some((s) => s.id === sub.id)}
                  onChange={() => toggleSubcategory(sub)}
                />{" "}
                {sub.name}
              </label>
            ))}
          </div>
        )}
        {/* Récapitulatif des sous-catégories choisies, toutes catégories confondues */}
        {selectedSubs.length > 0 && (
          <p className="muted">
            Choisies : {selectedSubs.map((s) => s.name).join(", ")}
          </p>
        )}
        <div className="form-group">
          <label htmlFor="images">Images</label>
          {/* multiple : plusieurs fichiers ; accept : seulement des images */}
          <input
            key={fileInputKey}
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFilesChange}
          />
          {images.length > 0 && (
            <p className="muted">
              {images.map((file) => file.name).join(", ")}
            </p>
          )}
        </div>
        {error && <p className="error-box">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Envoi..." : "Ajouter le produit"}
        </button>{" "}
        <Link to="/admin/produits" className="btn btn-dark">
          Retour à la liste
        </Link>
      </form>
    </div>
  );
};

export default AdminProduitForm;
