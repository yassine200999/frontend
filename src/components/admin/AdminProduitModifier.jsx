<<<<<<< HEAD
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
=======
import { Link, useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../../services/productService";
import {
  getAllCategories,
  getSubcategoriesByCategory,
} from "../../services/categoryService";

const AdminProduitModifier = () => {
  // id du produit pris dans l'adresse /admin/produits/:id/modifier
  const { id } = useParams();

  const navigate = useNavigate();
  // ----- états d'affichage -----
  const [loading, setLoading] = useState(true); // true tant que le produit n'est pas arrivé
  const [loadError, setLoadError] = useState(""); // message si le chargement échoue
  const [saving, setSaving] = useState(false); // true pendant l'enregistrement
  const [error, setError] = useState(""); // message d'erreur du formulaire

  // ----- états du formulaire -----
  const [name, setName] = useState(""); // champ nom
  const [price, setPrice] = useState(""); // champ prix
  const [keptImages, setKeptImages] = useState([]); // URLs des images qu'on garde
  const [currentSubs, setCurrentSubs] = useState([]); // noms des sous-catégories actuelles (texte seul)

  // ----- états pour CHANGER les sous-catégories (facultatif) -----
  const [categories, setCategories] = useState([]); // toutes les catégories
  const [selectedCategory, setSelectedCategory] = useState(""); // catégorie choisie dans la liste
  const [subcategories, setSubcategories] = useState([]); // ses sous-catégories (cases à cocher)
  const [selectedSubs, setSelectedSubs] = useState([]); // ids cochés

  // Effet 1 : charger le produit et les catégories ; se relance si l'id change
  useEffect(() => {
    const load = async () => {
      try {
        // on demande le produit au backend avec l'id lu dans l'adresse
        const data = await getProductById(id);
        // le backend range le produit dans la clé "product" : on la prend si elle existe,
        // sinon on garde la réponse telle quelle (?? = "si vide, alors cette valeur")
        const product = data.product ?? data;
        // on préremplit chaque champ avec les valeurs actuelles du produit
        setName(product.name);
        setPrice(product.price);
        setKeptImages(product.images || []);
        setCurrentSubs(product.subcategories || []);
        // on charge aussi les catégories pour la liste déroulante
        setCategories(await getAllCategories());
      } catch (err) {
        setLoadError("Impossible de charger ce produit.");
      } finally {
        // dans tous les cas, le chargement est fini
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Effet 2 : quand on choisit une catégorie, charger SES sous-catégories
  useEffect(() => {
    // pas de catégorie choisie : liste vide, on s'arrête
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    const loadSubs = async () => {
      try {
        setSubcategories(await getSubcategoriesByCategory(selectedCategory));
      } catch (err) {
        setSubcategories([]);
      }
    };
    loadSubs();
  }, [selectedCategory]);

  const removeImage = (url) => {
    // on garde toutes les images sauf celle-là
    setKeptImages(keptImages.filter((image) => image !== url));
  };

  // Changer de catégorie : on oublie les cases cochées de l'ancienne
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubs([]);
  };
  // Cocher / décocher une sous-catégorie
  const toggleSub = (subId) => {
    setSelectedSubs(
      selectedSubs.includes(subId)
        ? selectedSubs.filter((s) => s !== subId) // déjà cochée : on l'enlève
        : [...selectedSubs, subId], // sinon on l'ajoute
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page
    setError("");

    // ----- validations -----
    if (!name.trim()) return setError("Le nom est obligatoire.");
    if (price === "" || Number(price) <= 0)
      return setError("Le prix doit être supérieur à 0.");
    if (keptImages.length === 0) return setError("Gardez au moins une photo.");

    setSaving(true);
    try {
      // FormData = format « formulaire avec fichiers » attendu par le backend
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", price);

      // nouvelles sous-catégories : envoyées SEULEMENT si l'admin en a coché
      selectedSubs.forEach((subId) => formData.append("subcategories", subId));

      // pour chaque photo gardée : la retélécharger et la renvoyer comme fichier
      for (const url of keptImages) {
        // 1) télécharger l'image (via le proxy /media)
        const response = await fetch(getImageUrl(url));
        // 2) la transformer en blob (contenu brut du fichier)
        const blob = await response.blob();
        // 3) retrouver le nom du fichier : dernier morceau du chemin
        const fileName = url.replace(/\\/g, "/").split("/").pop();
        // 4) fabriquer un vrai fichier avec le même nom et l'ajouter
        formData.append(
          "images",
          new File([blob], fileName, { type: blob.type }),
        );
      }

      // envoi au backend (le service vérifie aussi l'erreur de prix cachée dans un 200)
      await updateProduct(id, formData);
      // succès : retour à la liste
      navigate("/admin/produits");
    } catch (err) {
      setError("Modification impossible : " + err.message);
    } finally {
      // dans tous les cas, on réactive le bouton
      setSaving(false);
    }
  };

  // ----- affichage (classes de TON styles.css : muted, error-box, form, form-group, previews, row) -----
  if (loading) return <p className="muted">Chargement...</p>;
  if (loadError) return <p className="error-box">{loadError}</p>;
  return (
    <>
      <h1>Modifier le produit</h1>
      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="error-box">{error}</p>}

        <div className="form-group">
          <label>Nom</label>
          {/* champ contrôlé : sa valeur vient de l'état */}
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Prix (DT)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Photos conservées</label>
          {/* .previews affiche les images en 72px sur une ligne */}
          <div className="previews">
            {keptImages.map((url) => (
              <div key={url}>
                <img src={getImageUrl(url)} alt={name} />
                {/* type="button" : sinon le bouton enverrait le formulaire */}
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeImage(url)}
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Sous-catégories actuelles</label>
          {/* texte seul : l'API ne donne pas leurs ids */}
          <p className="muted">
            {currentSubs.length ? currentSubs.join(", ") : "Aucune"}
          </p>
        </div>

        <div className="form-group">
          <label>Remplacer les sous-catégories (facultatif)</label>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">-- Ne pas changer --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {subcategories.map((s) => (
            <label key={s.id} className="row">
              {/* ton CSS met input { width: 100% } : on remet une largeur normale pour la case */}
              <input
                type="checkbox"
                style={{ width: "auto" }}
                checked={selectedSubs.includes(s.id)}
                onChange={() => toggleSub(s.id)}
              />
              {s.name}
            </label>
          ))}
        </div>

        <div className="row">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <Link>Annuler</Link>
        </div>
      </form>
    </>
>>>>>>> 07421a4 (Complete merge)
  );
};

export default AdminProduitModifier;
