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

export const updateProduct = async (id, formData) => {
  try {
    // PUT vers la route du backend ; on NE met PAS Content-Type : le navigateur le fabrique tout seul
    const response = await axios.put(
      `/api/product/update_product/${id}`,
      formData,
      {
        headers: {
          // le backend exige le token, comme pour la création
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    // le backend répond 200 même quand le prix est invalide : l'erreur est alors dans le corps
    if (response.data?.error) {
      // on fabrique une vraie erreur pour que la page l'affiche dans son catch
      throw new Error(JSON.stringify(response.data.error));
    }

    // sinon tout est bon : on renvoie la réponse du backend
    return response.data;
  } catch (error) {
    // trace pour le développeur dans la console
    console.error("Erreur modification produit :", error);
    // on relance l'erreur pour que la page puisse afficher un message
    throw error;
  }
};
