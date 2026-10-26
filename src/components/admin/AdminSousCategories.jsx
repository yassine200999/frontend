import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAllCategories,
  getSubcategoriesByCategory,
} from "../../services/categoryService";
import { getErrorMessage } from "../../services/errors";

const AdminSousCategories = () => {
  // identifiant de la catégorie parente, pris dans l'adresse (toujours du texte)
  const { categoryId } = useParams();

  // ---------- données de la page ----------
  const [category, setCategory] = useState(null); // la catégorie parente (pour afficher son nom)
  const [subcategories, setSubcategories] = useState([]); // ses sous-catégories
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // ---------- formulaire ----------
  const [name, setName] = useState(""); // champ nom
  const [editing, setEditing] = useState(null); // null = ajout ; sinon la sous-catégorie modifiée
  const [saving, setSaving] = useState(false);

  // ---------- messages ----------
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fonction réutilisée au chargement ET après un ajout : relire les sous-catégories
  const loadSubcategories = async () => {
    setSubcategories(await getSubcategoriesByCategory(categoryId));
  };

  useEffect(() => {
    const load = async () => {
      try {
        // on cherche le parent dans la liste des catégories (l'adresse ne donne que son id)
        const categories = await getAllCategories();
        // Number() : l'id de l'adresse est du texte, celui de l'API est un nombre
        setCategory(
          categories.find((c) => c.id === Number(categoryId)) || null,
        );
        // puis ses sous-catégories (le backend répond 404 si la catégorie n'existe pas)
        await loadSubcategories();
      } catch (err) {
        setLoadError(
          getErrorMessage(err, "Impossible de charger cette catégorie."),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryId]);
  const handleSubmit = async (e) => {};
  const startEdit = (sub) => {};
  const resetForm = () => {};
  const handleDelete = async (sub) => {};

  if (loading) return <p className="muted">Chargement...</p>;
  if (loadError) return <p className="error-box">{loadError}</p>;

  return (
    <>
      <p className="breadcrumb">
        <Link to="/admin/categories">Catégories</Link> / {category?.name}
      </p>
      {/* ?. : au cas où la catégorie n'a pas été trouvée */}
      <h1>
        Sous-catégories de « {category?.name} » ({subcategories.length})
      </h1>

      {actionError && <p className="error-box">{actionError}</p>}
      {success && <p className="success">{success}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <h3>
          {editing
            ? `Modifier « ${editing.name} »`
            : "Ajouter une sous-catégorie"}
        </h3>
        <div className="form-group">
          <label>Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="row">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Ajouter"}
          </button>
          {editing && (
            <button type="button" className="btn" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* liste vide : message plutôt qu'un tableau vide */}
      {subcategories.length === 0 ? (
        <p className="muted">Aucune sous-catégorie pour le moment.</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.name}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => startEdit(sub)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      disabled={deletingId === sub.id}
                      onClick={() => handleDelete(sub)}
                    >
                      {deletingId === sub.id ? "Suppression..." : "Supprimer"}
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

export default AdminSousCategories;
