export function getErrorMessage(error, fallback = "Une erreur inattendue est survenue.") {
  const data = error?.response?.data;

  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;
  if (data && typeof data === "object") {
    const message = Object.entries(data)
      .map(([field, messages]) => {
        const value = Array.isArray(messages) ? messages.join(" ") : String(messages);
        return `${field}: ${value}`;
      })
      .join(" ");
    if (message) return message;
  }

  if (error?.message === "Network Error") {
    return "Impossible de contacter le serveur. Vérifiez que Django fonctionne.";
  }

  return error?.message || fallback;
}
