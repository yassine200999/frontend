const getImageUrl = (src) => {
  if (!src) return "";

  const value = String(src).replace(/\\/g, "/");

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `/${value}`;
};

export { getImageUrl };
export default getImageUrl;
