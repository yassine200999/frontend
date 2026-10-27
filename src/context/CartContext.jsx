import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "maboutique_cart";

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    if (!product?.id) return;
    setItems((current) => {
      const existing = current.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return current.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const firstImage = product.images?.[0];
      return [
        ...current,
        {
          id: product.id,
          name: product.name || "Produit",
          price: Number(product.price) || 0,
          image: typeof firstImage === "string"
            ? firstImage
            : firstImage?.image_url || firstImage?.url || firstImage?.image || null,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id, quantity) => {
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    setItems((current) =>
      current.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: safeQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setItems((current) => current.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({ items, addToCart, updateQuantity, removeFromCart, clearCart, totalCount, totalPrice }),
    [items, totalCount, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider.");
  return context;
}
