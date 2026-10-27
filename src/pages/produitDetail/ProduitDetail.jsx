import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { getErrorMessage } from "../../services/errors";
import ProductImage from "../../components/productImage/ProductImage";
import { useCart } from "../../context/CartContext.jsx";

function ProduitDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

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

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
  };

  return (
    <section className="product-detail">
      <div className="gallery">
        <Link to="/">← Retour au catalogue</Link>
        <ProductImage
          src={images[currentImage]?.image_url ?? images[currentImage]}
          alt={product.name}
          className="gallery-main"
        />

        {images.length > 1 && (
          <div className="gallery-thumbs">
            {images.map((img, index) => (
              <button
                key={img.id ?? index}
                type="button"
                onClick={() => setCurrentImage(index)}
                aria-label={`Afficher l’image ${index + 1}`}
              >
                <ProductImage
                  src={img.image_url ?? img}
                  alt=""
                  className={index === currentImage ? "active" : ""}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">{Number(product.price || 0).toFixed(2)} DT</p>

        {product.subcategories?.length > 0 && (
          <p>Sous-catégories : {product.subcategories.join(", ")}</p>
        )}

        <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
          Ajouter au panier
        </button>

        {added && (
          <p className="success">
            Produit ajouté au panier.
            {" "}
            <Link to="/panier">Voir le panier</Link>
          </p>
        )}
      </div>
    </section>
  );
}

export default ProduitDetail;
