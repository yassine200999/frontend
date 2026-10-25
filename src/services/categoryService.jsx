import axios from "axios";

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAllCategories = async () => {
  const response = await axios.get("/category/get_all_categories/", authConfig());
  return response.data;
};

export const getSubcategoriesByCategory = async (categoryId) => {
  const response = await axios.get("/category/get_SubCategory_all/", authConfig());
  return response.data.filter((subcategory) => String(subcategory.category) === String(categoryId));
};
