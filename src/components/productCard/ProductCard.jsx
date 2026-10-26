import { Link } from "react-router-dom";
import ProductImage from "../productImage/ProductImage";

function ProductCard({ product }) {
  return (
    <Link to={`/produit/${product.id}`} className="product-card">
      <ProductImage src={product.images?.[0]?.image_url ?? product.images?.[0]} alt={product.name} />
      <div className="body">
        <span className="name">{product.name}</span>
        <span className="price">{product.price} DT</span>
        {product.subcategories?.[0] && <span className="tag">{product.subcategories[0]}</span>}
      </div>
    </Link>
  );
}

export default ProductCard;
