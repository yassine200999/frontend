import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { getErrorMessage } from "../../services/errors";
import ProductImage from "../../componenst/productedImage/ProductImage";

function ProduitDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProductById(id);
        if (active) {
          setProduct(data);
          setCurrentImage(0);
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err, "Impossible de charger ce produit."));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p className="muted">Chargement du produit...</p>;
  if (error) return <p className="error-box">{error}</p>;
  if (!product) return <p className="muted">Produit introuvable.</p>;

  const images = product.images ?? [];

  return (
    <section className="product-detail">
      <Link to="/">← Retour au catalogue</Link>
      <h1>{product.name}</h1>
      <p className="price">{product.price} DT</p>

      <ProductImage
        src={images[currentImage]?.image_url}
        alt={product.name}
        style={{ maxWidth: 400, width: "100%" }}
      />

      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, margin: "12px 0", flexWrap: "wrap" }}>
          {images.map((img, index) => (
            <button
              key={img.id ?? index}
              type="button"
              onClick={() => setCurrentImage(index)}
              aria-label={`Afficher l’image ${index + 1}`}
              style={{ border: 0, padding: 0, background: "transparent", cursor: "pointer" }}
            >
              <ProductImage
                src={img.image_url}
                alt=""
                width={70}
                style={{ opacity: index === currentImage ? 1 : 0.55 }}
              />
            </button>
          ))}
        </div>
      )}

      {product.subcategories?.length > 0 && (
        <p>Sous-catégories : {product.subcategories.join(", ")}</p>
      )}
    </section>
  );
}

export default ProduitDetail;
