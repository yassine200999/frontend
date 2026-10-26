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

export const createCategory = async (data) => {
  try {
    const response = await axios.post("/api/category/create_category", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (e) {
    console.error("Erreur création catégorie :", error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(
      `/api/category/update_category/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (e) {
    console.error("Erreur modification catégorie :", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await axios.delete(`/api/category/delete_category/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  } catch (error) {
    console.error("Erreur suppression catégorie :", error);
    // le backend renvoie 204 AVEC un corps : le proxy plante alors que la suppression a réussi
    // on vérifie donc si la catégorie a vraiment disparu
    try {
      await axios.get(`/api/category/category_by_id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (checkError) {
      // 404 = introuvable = bien supprimée : c'est un succès
      if (checkError.response?.status === 404) return;
    }
    // la catégorie existe encore : vraie erreur
    throw error;
  }
};

// Lit TOUTES les sous-catégories (utile pour compter ou vérifier)
export const getAllSubcategories = async () => {
  try {
    const response = await axios.get("/api/category/all_subcategories", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    // le backend renvoie directement un tableau
    return response.data;
  } catch (error) {
    console.error("Erreur chargement sous-catégories :", error);
    throw error;
  }
};

// Crée une sous-catégorie ; data = { name, category } où category est l'ID de la catégorie
export const createSubcategory = async (data) => {
  try {
    const response = await axios.post(
      "/api/category/create_subcategory",
      data,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    // le backend renvoie seulement un message, pas l'objet créé : la page recharge la liste
    return response.data;
  } catch (error) {
    console.error("Erreur création sous-catégorie :", error);
    throw error;
  }
};

// Modifie une sous-catégorie ; data = { name, category } (TOUS les champs)
export const updateSubcategory = async (id, data) => {
  try {
    const response = await axios.put(
      `/api/category/update_subcategory/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );

    if (!response.data?.message) {
      throw new Error(JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Erreur modification sous-catégorie :", error);
    throw error;
  }
};

export const deleteSubcategory = async (id) => {
  try {
    await axios.delete(`/api/category/delete_subcategory/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  } catch (error) {
    console.error("Erreur suppression sous-catégorie :", error);
    // même astuce : 204 avec corps = proxy en erreur mais suppression réussie
    try {
      await axios.get(`/api/category/subcategory_by_id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (checkError) {
      // 404 = introuvable = bien supprimée : c'est un succès
      if (checkError.response?.status === 404) return;
    }
    // elle existe encore : vraie erreur
    throw error;
  }
};
