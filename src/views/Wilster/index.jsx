import React from "react";
import HomeBanner from "../../components/HomeBanner";
import "./Wilster.css"; // Optional: For custom styling

const Wilster = () => {
  return (
    <div>
      {/* Banner */}
      <HomeBanner />

      {/* Coming Soon Content */}
      <section className="wilster-content container">
        <h2 className="wilster-heading">Wilster is Coming Soon</h2>
        <p className="wilster-description">
          A new era of fashion is on its way. Wilster will soon launch with a carefully curated selection of apparel and accessories designed for elegance and comfort.
        </p>
      </section>
    </div>
  );
};

export default Wilster;
