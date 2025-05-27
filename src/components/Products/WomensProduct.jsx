import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedProduct } from "../../redux/slices/productSlice";
import SingleProduct from "./SingleProduct";
import useProductManager from "../../hooks/useProductManager"; // Import the hook

function WomensProducts({ wilster = false }) {
  const dispatch = useDispatch();
  const { products, loading, error } = useProductManager(); // Use the hook

  const addToBag = (id) => {
    console.log(`Added product ${id} to cart`);
  };
  console.log(products)

  const handleProductClick = (product) => {
    dispatch(setSelectedProduct(product));
  };

  // Filter products for Men's department
  const womensProducts = products.filter((product) => product.department === "wilster");
  console.log(womensProducts)
  // Decide which products to display based on home prop
  const displayedProducts = wilster ? womensProducts.slice(0, 9) : mensProducts;

  return (
    <div className="mens-products-page">
      <div
        className="products-banner"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1507680432347-45e84e0436c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)`,
        }}
      >
        <div className="products-banner-overlay">
          <h1>Wilster's Fashion Collection</h1>
          <p>Discover the latest in style and sophistication.</p>
        </div>
      </div>

      <div className="container products-container" data-aos="fade-up">
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
            <h4>No products available.</h4>
          </div>
        ) : (
          <div className="row">
            {displayedProducts.map((product) => (
              <div
                key={product.id} // Use id from Firestore instead of _id
                className="col-lg-4 col-md-6 col-sm-12"
                data-aos="fade-up"
                data-aos-delay={displayedProducts.indexOf(product) * 100}
              >
                <SingleProduct
                  productItem={product}
                  addToBag={addToBag}
                  onProductClick={() => handleProductClick(product)}
                />
              </div>
            ))}
          </div>
        )}

        {wilster && womensProducts.length > 9 && (
          <div className="view-more-link" style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link
              to="/womensProduct"
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

export default WomensProducts;