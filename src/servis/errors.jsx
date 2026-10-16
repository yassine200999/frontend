export const getErrorMessage = (
  error,
  fallback = "Une erreur inconnue est survenue",
) => {
  // CAS 1 : la requête est partie mais AUCUNE réponse n'est revenue.
  // Causes possibles : Django éteint, MySQL éteint, mauvais port, proxy non rechargé.
  // error.request existe (la demande est partie), error.response n'existe pas.
  if (error.request && !error.response) {
    return "Impossible de joindre le serveur. Le backend est-il lancé ?";
  }

  // CAS 2 : pas de réponse ET pas de requête = erreur dans NOTRE code JavaScript

  if (!error.response) {
    return error.message || fallback;
  }

  // CAS 3 : le serveur a répondu avec une erreur (400, 401, 403, 404, 500...).
  // Le backend met son message dans "error", "message" ou "detail".
  // "??" prend la première valeur qui existe ; "?." évite un plantage si data est vide.
  const data = error.response.data;
  const message = data?.error ?? data?.message ?? data?.detail;

  // Cas 3a : le message est un simple texte -> on le renvoie tel quel
  // Exemple : { "error": "Email ou mot de passe incorrect" }

  if (typeof message === "string") return message;

  // Cas 3b : le message est un objet avec des listes d'erreurs par champ
  // Exemple : { "error": { "email": ["Cet email existe déjà"], "password": ["Trop court"] } }
  // Object.values() récupère les listes, flat() les aplatit, join(" ") les colle en une phrase.
  if (message && typeof message === "object") {
    return Object.values(message).flat().join(" ");
  }

  // CAS 4 : rien d'exploitable -> message par défaut donné par la page
  return fallback;
};