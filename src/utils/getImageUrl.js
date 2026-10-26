const getImageUrl = (src) => {
  if (!src) return "";

  const value = String(src).split("\\").join("/");

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  const mediaIndex = value.toLowerCase().indexOf("/media/");
  if (mediaIndex >= 0) {
    return value.slice(mediaIndex);
  }

  if (value.toLowerCase().startsWith("media/")) {
    return \`/\${value}\`;
  }

  let path = value;
  while (path.startsWith("/")) {
    path = path.slice(1);
  }
  return \`/\${path}\`;
};

export { getImageUrl };
export default getImageUrl;
