import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../services/categoryService";
import { getErrorMessage } from "../../services/errors";

const AdminCategories = () => {
  // ---------- données de la page ----------
  const [categories, setCategories] = useState([]); // la liste affichée dans le tableau
  const [loading, setLoading] = useState(true); // true pendant le premier chargement
  const [loadError, setLoadError] = useState(""); // erreur de chargement

  // ---------- formulaire ----------
  const [name, setName] = useState(""); // champ nom
  const [description, setDescription] = useState(""); // champ description
  const [editing, setEditing] = useState(null); // null = mode ajout ; sinon la catégorie en cours de modification
  const [saving, setSaving] = useState(false); // true pendant l'enregistrement

  // ---------- messages ----------
  const [actionError, setActionError] = useState(""); // erreur d'une action (ajout, modif, suppression)
  const [success, setSuccess] = useState(""); // message de réussite
  const [deletingId, setDeletingId] = useState(null); // id en cours de suppression

  // Chargement de la liste, une seule fois au démarrage de la page
  useEffect(() => {
    const load = async () => {
      try {
        // le backend renvoie directement un tableau
        setCategories(await getAllCategories());
      } catch (err) {
        setLoadError(
          getErrorMessage(err, "Impossible de charger les catégories."),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Envoi du formulaire : ajout OU modification selon « editing »
  const handleSubmit = async (e) => {
    e.preventDefault(); // pas de rechargement de page
    setActionError("");
    setSuccess("");

    // validation : le nom est obligatoire
    if (!name.trim()) return setActionError("Le nom est obligatoire.");

    // on prépare les données à envoyer (TOUS les champs, même pour la modification)
    const data = { name: name.trim(), description: description.trim() };

    setSaving(true);
    try {
      if (editing) {
        // ----- MODIFICATION -----
        await updateCategory(editing.id, data);
        // le backend renvoie juste un message : on met à jour la ligne avec nos valeurs
        setCategories(
          categories.map((c) => (c.id === editing.id ? { ...c, ...data } : c)),
        );
        setSuccess("Catégorie modifiée.");
      } else {
        // ----- AJOUT -----
        const created = await createCategory(data);
        // le backend renvoie la catégorie créée (avec son id) : on l'ajoute au tableau
        setCategories([...categories, created]);
        setSuccess("Catégorie ajoutée.");
      }
      resetForm(); // formulaire vide, retour en mode ajout
    } catch (err) {
      setActionError(getErrorMessage(err, "Enregistrement impossible."));
    } finally {
      setSaving(false);
    }
  };
  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(null);
  };
  // Clic sur « Modifier » : on copie la catégorie dans le formulaire
  const startEdit = (category) => {
    setEditing(category); // on passe en mode modification
    setName(category.name); // préremplissage du nom
    setDescription(category.description || ""); // préremplissage de la description
    setActionError("");
    setSuccess("");
  };

  // Suppression d'une catégorie
  const handleDelete = async (category) => {
    // confirmation claire sur la conséquence
    const ok = window.confirm(
      `Supprimer la catégorie « ${category.name} » ? Ses sous-catégories seront probablement supprimées aussi.`,
    );
    if (!ok) return; // l'admin a annulé

    setActionError("");
    setSuccess("");
    setDeletingId(category.id); // désactive le bouton de cette ligne
    try {
      await deleteCategory(category.id);
      // on retire la ligne du tableau sans recharger toute la liste
      setCategories(categories.filter((c) => c.id !== category.id));
      // si on éditait justement cette catégorie, on vide le formulaire
      if (editing?.id === category.id) resetForm();
      setSuccess(`Catégorie « ${category.name} » supprimée.`);
    } catch (err) {
      setActionError(getErrorMessage(err, "Suppression impossible."));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="muted">Chargement...</p>;
  if (loadError) return <p className="error-box">{loadError}</p>;

  return (
    <>
      <h1>Catégories ({categories.length})</h1>

      {/* messages */}
      {actionError && <p className="error-box">{actionError}</p>}
      {success && <p className="success">{success}</p>}

      {/* formulaire : le titre change selon le mode */}
      <form className="form" onSubmit={handleSubmit}>
        <h3>
          {editing ? `Modifier « ${editing.name} »` : "Ajouter une catégorie"}
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label>Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Ajouter"}
          </button>
          {/* le bouton Annuler n'apparaît qu'en mode modification */}
          {editing && (
            <button type="button" className="btn" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* tableau des catégories */}
      {categories.length === 0 ? (
        <p className="muted">Aucune catégorie pour le moment.</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  {/* .actions : boutons alignés à droite avec un petit espace entre eux */}
                  <td className="actions">
                    {/* page des sous-catégories de cette catégorie */}
                    <Link
                      to={`/admin/categories/${category.id}/sous-categories`}
                      className="btn btn-sm"
                    >
                      Sous-catégories
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => startEdit(category)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      disabled={deletingId === category.id}
                      onClick={() => handleDelete(category)}
                    >
                      {deletingId === category.id
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

export default AdminCategories;
