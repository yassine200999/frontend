export function getErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;
  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([field, messages]) => {
        const value = Array.isArray(messages) ? messages.join(" ") : String(messages);
        return `${field}: ${value}`;
      })
      .join(" ");
  }

  if (error?.message === "Network Error") {
    return "Impossible de contacter le serveur. Vérifiez que Django fonctionne.";
  }

  return error?.message || "Une erreur inattendue est survenue.";
}
