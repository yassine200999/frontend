import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createSubcategory,
  deleteSubcategory,
  getAllCategories,
  getSubcategoriesByCategory,
  updateSubcategory,
} from "../../services/categoryService";
import { getErrorMessage } from "../../services/errors";

const AdminSousCategories = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadSubcategories = useCallback(async () => {
    const data = await getSubcategoriesByCategory(categoryId);
    setSubcategories(Array.isArray(data) ? data : []);
  }, [categoryId]);

  useEffect(() => {
    const load = async () => {
      try {
        const categories = await getAllCategories();
        setCategory(
          categories.find((item) => Number(item.id) === Number(categoryId)) || null,
        );
        await loadSubcategories();
      } catch (error) {
        setLoadError(
          getErrorMessage(error, "Impossible de charger cette catégorie."),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryId, loadSubcategories]);

  const resetForm = () => {
    setName("");
    setEditing(null);
    setActionError("");
  };

  const startEdit = (subcategory) => {
    setEditing(subcategory);
    setName(subcategory.name);
    setActionError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionError("");
    setSuccess("");

    if (!name.trim()) {
      setActionError("Le nom est obligatoire.");
      return;
    }

    setSaving(true);
    const data = { name: name.trim(), category: Number(categoryId) };

    try {
      if (editing) {
        await updateSubcategory(editing.id, data);
        setSuccess("Sous-catégorie modifiée.");
      } else {
        await createSubcategory(data);
        setSuccess("Sous-catégorie ajoutée.");
      }
      await loadSubcategories();
      resetForm();
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Enregistrement de la sous-catégorie impossible."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subcategory) => {
    if (!window.confirm(`Supprimer la sous-catégorie « ${subcategory.name} » ?`)) {
      return;
    }

    setActionError("");
    setSuccess("");
    setDeletingId(subcategory.id);
    try {
      await deleteSubcategory(subcategory.id);
      setSubcategories((items) => items.filter((item) => item.id !== subcategory.id));
      if (editing?.id === subcategory.id) resetForm();
      setSuccess(`Sous-catégorie « ${subcategory.name} » supprimée.`);
    } catch (error) {
      setActionError(
        getErrorMessage(error, "Suppression de la sous-catégorie impossible."),
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="muted">Chargement...</p>;
  if (loadError) return <p className="error-box">{loadError}</p>;

  return (
    <>
      <p className="breadcrumb">
        <Link to="/admin/categories">Catégories</Link> / {category?.name}
      </p>
      <h1>
        Sous-catégories de « {category?.name} » ({subcategories.length})
      </h1>

      {actionError && <p className="error-box">{actionError}</p>}
      {success && <p className="success">{success}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <h3>
          {editing ? `Modifier « ${editing.name} »` : "Ajouter une sous-catégorie"}
        </h3>
        <div className="form-group">
          <label htmlFor="subcategory-name">Nom</label>
          <input
            id="subcategory-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
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
              {subcategories.map((subcategory) => (
                <tr key={subcategory.id}>
                  <td>{subcategory.name}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => startEdit(subcategory)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      disabled={deletingId === subcategory.id}
                      onClick={() => handleDelete(subcategory)}
                    >
                      {deletingId === subcategory.id ? "Suppression..." : "Supprimer"}
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
