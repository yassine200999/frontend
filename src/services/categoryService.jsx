import axios from "axios";

const API = "/category";
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAllCategories = async () => {
  const response = await axios.get(`${API}/get_all_categories/`, authConfig());
  if (!Array.isArray(response.data)) {
    throw new Error("La réponse des catégories n'est pas une liste valide.");
  }
  return response.data;
};

export const createCategory = async (data) => {
  const response = await axios.post(`${API}/create_category/`, data, authConfig());
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await axios.put(`${API}/update_category/${id}/`, data, authConfig());
  return response.data;
};

export const deleteCategory = async (id) => {
  await axios.delete(`${API}/delete_category/${id}/`, authConfig());
};

export const getAllSubcategories = async () => {
  const response = await axios.get(`${API}/get_SubCategory_all/`, authConfig());
  if (!Array.isArray(response.data)) {
    throw new Error("La réponse des sous-catégories n'est pas une liste valide.");
  }
  return response.data;
};

export const getSubcategoriesByCategory = async (categoryId) => {
  const subcategories = await getAllSubcategories();
  return subcategories.filter(
    (subcategory) => Number(subcategory.category) === Number(categoryId),
  );
};

export const createSubcategory = async (data) => {
  const response = await axios.post(
    `${API}/create_SubCategory/`,
    { name: data.name, category: Number(data.category) },
    authConfig(),
  );
  return response.data;
};

export const updateSubcategory = async (id, data) => {
  const response = await axios.put(
    `${API}/update_SubCategory/${id}/`,
    { name: data.name, category: Number(data.category) },
    authConfig(),
  );
  return response.data;
};

export const deleteSubcategory = async (id) => {
  await axios.delete(`${API}/delete_SubCategory/${id}/`, authConfig());
};
