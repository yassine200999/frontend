import { useEffect, useState } from "react";
import { getProductById } from "../../services/productService";
import { getErrorMessage } from "../../services/errors";
import { Link, useParams } from "react-router-dom";
import ProductImage from "../../componenst/productedImage/ProductImage";

function ProduitDetail() {
  const { id } = useParams(); // lit le :id de l'URL /produit/:id
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product); // la réponse est { product: {...} }
      } catch (err) {
        setError(getErrorMessage(err, "Produit introuvable."));
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <p className="muted">Chargement...</p>;
  if (error) return <p className="error-box">{error}</p>;
  if (!product) return null;

  return (
    <div>
      <Link to="/">← Retour au catalogue</Link>

      <h1>{product.name}</h1>
      <p className="price">{product.price} DT</p>

      {/* Image principale */}
      <ProductImage
        src={product.images?.[currentImage]}
        alt={product.name}
        style={{ maxWidth: 400, width: "100%" }}
      />

      {/* Miniatures cliquables */}
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        {product.images?.map((img, index) => (
          <ProductImage
            key={index}
            src={img}
            alt=""
            width={70}
            style={{
              cursor: "pointer",
              opacity: index === currentImage ? 1 : 0.5,
            }}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>

      <p>Sous-catégories : {product.subcategories?.join(", ")}</p>
    </div>
  );
}
export default ProduitDetail;
