const getImageUrl = (src) => {
  if (!src) return "";

  const value = String(src).replace(/\\\\/g, "/");

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  const mediaIndex = value.toLowerCase().indexOf("/media/");
  if (mediaIndex >= 0) {
    return value.slice(mediaIndex);
  }

  if (value.toLowerCase().startsWith("media/")) {
    return `/${value}`;
  }

  return `/${value.replace(/^\\/+/, "")}`;
};

export { getImageUrl };
export default getImageUrl;
