import React from "react";
import HomeBanner from "../../components/HomeBanner";
import "./Wilster.css"; // Optional: For custom styling

const Wilster = () => {
  return (
    <div>

      {/* Banner for Women's Fashion */}
      <HomeBanner />

      {/* Additional Content Section */}
      <section className="wilster-content container">
        <h2 className="wilster-heading">Explore Women's Fashion</h2>
        <p className="wilster-description">
          Discover the latest trends in women's fashion at Fashion Cube. From elegant dresses to stylish bags, we have
          everything you need to elevate your wardrobe.
        </p>
        <div className="wilster-products">
          {/* Placeholder for product listing */}
          <div className="product-card">
            <img src="/assets/images/wilster-product-1.jpg" alt="Women's Dress" />
            <h3>Elegant Evening Dress</h3>
            <p>$89.99</p>
            <a href="/shop/wilster" className="btn btn-primary">
              Shop Now
            </a>
          </div>
          <div className="product-card">
            <img src="/assets/images/wilster-product-2.jpg" alt="Designer Bag" />
            <h3>Designer Handbag</h3>
            <p>$149.99</p>
            <a href="/shop/wilster" className="btn btn-primary">
              Shop Now
            </a>
          </div>
          <div className="product-card">
            <img src="/assets/images/wilster-product-3.jpg" alt="Casual Top" />
            <h3>Casual Summer Top</h3>
            <p>$39.99</p>
            <a href="/shop/wilster" className="btn btn-primary">
              Shop Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wilster;