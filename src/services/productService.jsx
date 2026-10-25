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

export const createProduct = async (formData) => {
  try {
    const response = await axios.post("/api/product/create", formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data; // { message: "product added successfully" } (statut 201)
  } catch (error) {
    console.error("Erreur création produit :", error);
    throw error;
  }
};

// Suppression : méthode DELETE, l'id est dans l'URL. La réponse a le statut 204 et un corps vide.
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`/api/product/delete_product/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  } catch (error) {
    console.error("Erreur suppression produit :", error);

    // Le backend renvoie 204 AVEC un corps JSON (interdit en HTTP) : le proxy plante
    // alors que la suppression a réussi. On vérifie le résultat réel :
    // si le produit n'existe plus (404), c'est un succès.
    try {
      await axios.get(`/api/product/product_details/${id}`);
    } catch (checkError) {
      if (checkError.response?.status === 404) return;
    }
    throw error; // le produit existe encore : vraie erreur
  }
};
