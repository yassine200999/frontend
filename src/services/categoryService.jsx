import axios from "axios";

// Toutes ces routes exigent un token : on le lit dans localStorage à chaque appel.
export const getAllCategories = async () => {
  try {
    const response = await axios.get("/api/category/all_categories", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data; // un tableau : [ {id, name, ...}, ... ]
  } catch (error) {
    console.error("Erreur chargement catégories :", error);
    throw error;
  }
};

// Route en POST : le corps contient l'id de la catégorie choisie.
export const getSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await axios.post(
      "/api/category/get_subcategories_by_category",
      { category_id: categoryId }, // le corps de la requête
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    return response.data; // un tableau de sous-catégories
  } catch (error) {
    console.error("Erreur chargement sous-catégories :", error);
    throw error;
  }
};
