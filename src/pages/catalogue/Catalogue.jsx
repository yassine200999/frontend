import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { getErrorMessage } from "../../services/errors";
import ProductCard from "../../componenst/productCard/ProductCard";
function Catalogue() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Filtres ----------
  const [search, setSearch] = useState("");
  const [subcategory, setSubcategory] = useState(""); // "" = toutes
  const [maxPrice, setMaxPrice] = useState("");

  // Nombre de produits affichés par page
  const PRODUCTS_PER_PAGE = 8;
  // Numéro de la page affichée (on commence à 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Chargement au démarrage de la page (une seule fois grâce à [])
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data["list product"] ?? []); // la clé contient un espace
      } catch (err) {
        setError(getErrorMessage(err, "Impossible de charger les produits."));
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, subcategory, maxPrice]);

  // Liste des sous-catégories déduite des produits (sans doublons)
  const subcategories = [
    ...new Set(products.flatMap((p) => p.subcategories ?? [])),
  ];

  // Application des filtres
  const filteredProducts = products.filter((product) => {
    const matchName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchSub =
      subcategory === "" || product.subcategories?.includes(subcategory);
    const matchPrice =
      maxPrice === "" || Number(product.price) <= Number(maxPrice);
    return matchName && matchSub && matchPrice;
  });

  // Nombre total de pages : ceil arrondit au supérieur (21 produits / 8 = 2,6 -> 3 pages).
  // Math.max(1, ...) : toujours au moins 1 page, même si la liste est vide.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  // Index du premier produit de la page : page 1 -> 0, page 2 -> 8, page 3 -> 16...
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  // slice(début, fin) découpe le tableau : seulement les 8 produits de la page.
  const pageProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <>
          <div className="products-grid">
            {/* On affiche pageProducts (8 produits) et non plus filteredProducts */}
            {pageProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Les boutons n'apparaissent que s'il y a plus d'une page */}
          {totalPages > 1 && (
            <div className="pagination">
              {/* disabled : bouton grisé sur la première page */}
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </button>

              {/* Un bouton par numéro de page : Array.from crée [1, 2, 3, ... totalPages] */}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={
                      page === currentPage ? "btn btn-primary" : "btn btn-dark"
                    }
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                className="btn btn-dark"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default Catalogue;
