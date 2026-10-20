import { Link } from "react-router-dom";
import ProductImage from "../productImage/ProductImage";

function ProductCard({ product }) {
  return (
    <Link to={`/produit/${product.id}`} className="product-card">
      <ProductImage src={product.images?.[0]} alt={product.name} />
      <div className="body">
        {/* Nom du produit */}
        <span className="name">{product.name}</span>

        {/* Prix, suivi de la devise */}
        <span className="price">{product.price} DT</span>

        {/* Rendu conditionnel : "A && B" affiche B seulement si A est vrai.
            Ici : on affiche l'étiquette seulement si le produit a au moins
            une sous-catégorie (sinon rien ne s'affiche, pas d'erreur). */}
        {product.subcategories?.[0] && (
          <span className="tag">{product.subcategories[0]}</span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
