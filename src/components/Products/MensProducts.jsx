import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedProduct } from "../../redux/slices/productSlice";
import SingleProduct from "./SingleProduct";
import useProductManager from "../../hooks/useProductManager"; // Import product hook
import useConversionRate from "../../hooks/useConversionRate"; // Import conversion rate hook

function MensProducts({ home = false }) {
  const dispatch = useDispatch();
  const { products, loading, error } = useProductManager(); // Use product hook
  const { conversionRates, loading: rateLoading, error: rateError } = useConversionRate(); // Use conversion rate hook
  const addToBag = (id) => {
    console.log(`Added product ${id} to cart`);
  };

  const handleProductClick = (product) => {
    dispatch(setSelectedProduct(product));
  };

  // Filter products for Men's department
  const mensProducts = products.filter((product) => product.department === "cl3fwilson");
  // Decide which products to display based on home prop
  const displayedProducts = home ? mensProducts.slice(0, 9) : mensProducts;

  return (
    <div className="mens-products-page">
      <div
        className="products-banner"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1507680432347-45e84e0436c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)`,
        }}
      >
        <div className="products-banner-overlay">
          <h1>Men's Fashion Collection</h1>
          <p>Discover the latest in style and sophistication.</p>
        </div>
      </div>

      <div className="container products-container" data-aos="fade-up">
        {rateLoading && (
          <div className="text-center my-5">
            <h4>Loading conversion rates...</h4>
          </div>
        )}
        {rateError && (
          <div className="alert alert-danger my-5" role="alert">
            {rateError}
          </div>
        )}
        {loading ? (
          <div className="text-center my-5">
            <h4>Loading products...</h4>
          </div>
        ) : error ? (
          <div className="alert alert-danger my-5" role="alert">
            {error}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center my-5">
            <h4>No men's products available.</h4>
          </div>
        ) : (
          <div className="row">
            {displayedProducts.map((product) => (
              <div
                key={product.id} // Use id from Firestore
                className="col-lg-4 col-md-6 col-sm-12"
                data-aos="fade-up"
                data-aos-delay={displayedProducts.indexOf(product) * 100}
              >
                <SingleProduct
                  productItem={product}
                  addToBag={addToBag}
                  onProductClick={() => handleProductClick(product)}
                  conversionRates={conversionRates} // Pass conversionRates
                />
              </div>
            ))}
          </div>
        )}

        {home && mensProducts.length > 9 && (
          <div className="view-more-link" style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link
              to="/mensProduct"
              style={{
                textDecoration: "none",
                color: "#1E1E27",
                fontSize: "1.1rem",
              }}
            >
              View More →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MensProducts;