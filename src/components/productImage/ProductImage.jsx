import { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/getImageUrl";

// Image de remplacement (SVG intégré, aucun fichier à ajouter)
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
       <rect width="100%" height="100%" fill="#e5e7eb"/>
       <text x="50%" y="50%" text-anchor="middle" fill="#6b7280"
             font-family="sans-serif" font-size="20">Pas d'image</text>
     </svg>`,
  );

const ProductImage = ({ src, alt, ...props }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      src={failed || !src ? PLACEHOLDER : getImageUrl(src)}
      alt={alt}
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default ProductImage;
