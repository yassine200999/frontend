import axios from "axios";

const API = "/products";

function normalizeProducts(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.["list product"])) return payload["list product"];
  if (Array.isArray(payload?.results)) return payload.results;
  throw new Error(
    "Réponse API invalide : vérifiez que /products/get_all_products/ renvoie du JSON et que le proxy Vite est actif.",
  );
}

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API}/get_all_products/`);
    return normalizeProducts(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API}/get_product/${productId}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post(`${API}/create_product/`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur création produit :", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API}/delete_product/${id}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  } catch (error) {
    console.error("Erreur suppression produit :", error);
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.patch(`${API}/update_product/${id}/`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.data?.error) throw new Error(JSON.stringify(response.data.error));
    return response.data;
  } catch (error) {
    console.error("Erreur modification produit :", error);
    throw error;
  }
};
