import axios from "axios";

export const signin = async (email, password) => {
  try {
    const response = await axios.post("/auth/signin/", { email, password });
    return response.data; // Retourne les données de la réponse (par exemple, le token JWT)
  } catch (error) {
    console.error("Erreur lors de la connexion : ", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post("/api/users/create_user", userData);
    return response.data; // Retourne les données de la réponse (par exemple, le token JWT)
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur : ", error);
    throw error;
  }
};