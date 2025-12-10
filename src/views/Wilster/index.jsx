import React from "react";
import HomeBanner from "../../components/HomeBanner";
import "./Wilster.css"; // Optional: For custom styling
import WomensProducts from "../../components/Products/WomensProduct";
const Wilster = () => {
  return (
    <div>
      {/* Banner */}
      <HomeBanner />
      <WomensProducts wilster/>
    </div>
  );
};

export default Wilster;
