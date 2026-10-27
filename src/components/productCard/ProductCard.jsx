import { Link } from "react-router-dom";
import ProductImage from "../productImage/ProductImage";
import { useCart } from "../../context/CartContext.jsx";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <Link to={`/produit/${product.id}`}>
        <ProductImage
          src={product.images?.[0]?.image_url ?? product.images?.[0]}
          alt={product.name}
        />
        <div className="body">
          <span className="name">{product.name}</span>
          <span className="price">{Number(product.price || 0).toFixed(2)} DT</span>
          {product.subcategories?.[0] && (
            <span className="tag">{product.subcategories[0]}</span>
          )}
        </div>
      </Link>

      <div className="body">
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => addToCart(product)}
        >
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
