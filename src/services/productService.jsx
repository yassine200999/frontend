import axios from "axios";

export const getAllProducts = async () => {
  try {
    const response = await axios.get("/api/product/all_products");
    return response.data; // Retourne les données de la réponse
  } catch (error) {
    console.error("Erreur lors de la récupération des produits : ", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `/api/product/product_details/${productId}`,
    );
    return response.data; // Retourne les données de la réponse
  } catch (error) {
    console.error("Erreur lors de la récupération du produit : ", error);
    throw error;
  }
};
