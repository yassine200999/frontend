import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { getErrorMessage } from "../../services/errors";
import ProductCard from "../../componenst/productCard/ProductCard.jsx";
function Catalogue() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Filtres ----------
  const [search, setSearch] = useState("");
  const [subcategory, setSubcategory] = useState(""); // "" = toutes
  const [maxPrice, setMaxPrice] = useState("");

  // Chargement au démarrage de la page (une seule fois grâce à [])
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data : data["list product"] ?? []);
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de charger les produits."));
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Liste des sous-catégories déduite des produits (sans doublons)
  const subcategories = [
    ...new Set(products.flatMap((p) => p.subcategories ?? [])),
  ];

  // Application des filtres
  const filteredProducts = products.filter((product) => {
    const matchName = String(product.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchSub =
      subcategory === "" || product.subcategories?.includes(subcategory);
    const matchPrice =
      maxPrice === "" || Number(product.price) <= Number(maxPrice);
    return matchName && matchSub && matchPrice;
  });

  // Réinitialisation des filtres
  const resetFilters = () => {
    setSearch("");
    setSubcategory("");
    setMaxPrice("");
  };

  if (loading) return <p className="muted">Chargement...</p>;
  if (error) return <p className="error-box">{error}</p>;

  return (
    <>
      <section className="hero">
        <h1>Bienvenue sur MaBoutique</h1>
        <p>Découvrez nos produits</p>
      </section>

      {/* ---------- Barre de filtres  ---------- */}
      <div className="filters-bar">
        <div className="form-group">
          <label htmlFor="search">Rechercher</label>
          <input
            id="search"
            value={search}
            placeholder="Nom du produit..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subcategory">Sous-catégorie</label>
          <select
            id="subcategory"
            value={subcategory}
            onChange={(event) => setSubcategory(event.target.value)}
          >
            <option value="">Toutes</option>
            {subcategories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="maxPrice">Prix maximum (DT)</label>
          <input
            id="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>

        <button type="button" className="btn btn-dark" onClick={resetFilters}>
          Réinitialiser
        </button>
      </div>

      {/* ---------- Résultats ---------- */}
      <p className="muted">{filteredProducts.length} produit(s)</p>

      {filteredProducts.length === 0 ? (
        <p className="muted">Aucun produit ne correspond.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
export default Catalogue;
