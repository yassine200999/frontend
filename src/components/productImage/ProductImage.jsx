import { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/getImageUrl";

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

  const imagePath =
    typeof src === "string" ? src : src?.image_url || src?.url || src?.image;

  useEffect(() => {
    setFailed(false);
  }, [imagePath]);

  return (
    <img
      src={!imagePath || failed ? PLACEHOLDER : getImageUrl(imagePath)}
      alt={alt || ""}
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default ProductImage;
