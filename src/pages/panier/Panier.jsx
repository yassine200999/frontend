import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import ProductImage from "../../components/productImage/ProductImage";

function Panier() {
  const { items, updateQuantity, removeFromCart, clearCart, totalCount, totalPrice } = useCart();

  const formatPrice = (price) => `${Number(price || 0).toFixed(2)} DT`;

  return (
    <section>
      <div className="row-between">
        <h1>Mon panier</h1>
        {items.length > 0 && (
          <button type="button" className="btn btn-danger" onClick={clearCart}>
            Vider le panier
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card">
          <h2>Votre panier est vide</h2>
          <p className="muted">Ajoutez des produits depuis le catalogue.</p>
          <Link to="/" className="btn btn-primary">Continuer mes achats</Link>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <article className="cart-line" key={item.id}>
              <ProductImage src={item.image} alt={item.name} />
              <div className="info">
                <h3>{item.name}</h3>
                <p className="price">{formatPrice(item.price)}</p>
                <div className="qty">
                  <button
                    type="button"
                    aria-label="Diminuer la quantité"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >−</button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Augmenter la quantité"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                <p>Sous-total : <strong>{formatPrice(item.price * item.quantity)}</strong></p>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </article>
          ))}

          <div className="cart-total">
            <div>
              <p>Articles : {totalCount}</p>
              <h2>Total : {formatPrice(totalPrice)}</h2>
            </div>
          </div>

          <Link to="/" className="btn btn-primary">Continuer mes achats</Link>
        </>
      )}
    </section>
  );
}

export default Panier;
