import axios from "axios";

const API = "/category";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API}/get_all_categories/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Erreur chargement catégories :", error);
    throw error;
  }
};

export const getAllSubcategories = async () => {
  try {
    const response = await axios.get(`${API}/get_SubCategory_all/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Erreur chargement sous-catégories :", error);
    throw error;
  }
};

export const getSubcategoriesByCategory = async (categoryId) => {
  const subcategories = await getAllSubcategories();
  return subcategories.filter(
    (subcategory) => Number(subcategory.category) === Number(categoryId),
  );
};

export const createCategory = async (data) => {
  try {
    const response = await axios.post(`${API}/create_category/`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Erreur création catégorie :", error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(
      `${API}/update_category/${id}/`,
      data,
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (error) {
    console.error("Erreur modification catégorie :", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API}/delete_category/${id}/`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Erreur suppression catégorie :", error);
    throw error;
  }
};

export const createSubcategory = async (data) => {
  try {
    const response = await axios.post(`${API}/create_SubCategory/`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Erreur création sous-catégorie :", error);
    throw error;
  }
};

export const updateSubcategory = async (id, data) => {
  try {
    const response = await axios.put(
      `${API}/update_SubCategory/${id}/`,
      data,
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (error) {
    console.error("Erreur modification sous-catégorie :", error);
    throw error;
  }
};

export const deleteSubcategory = async (id) => {
  try {
    await axios.delete(`${API}/delete_SubCategory/${id}/`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Erreur suppression sous-catégorie :", error);
    throw error;
  }
};
