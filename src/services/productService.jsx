import axios from "axios";

export const getAllProducts = async () => {
  const response = await axios.get("/products/get_all_products/");
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await axios.get(`/products/get_product/${productId}/`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await axios.post("/products/create_product/", formData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`/products/delete_product/${id}/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};
