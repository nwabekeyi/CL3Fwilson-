import React from "react";
import Banner1 from "../../assets/images/womenCategory.jpg"; // Women's banner
import Banner3 from "../../assets/images/menCategory.jpg";
import { Link } from "react-router-dom";

function CategoryBanner() {
  return (
    <div className="banner">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="banner_item" data-aos="fade-right">
              <div
                className="banner_background"
                style={{
                  backgroundImage: `url(${Banner3})`, // Men's banner first
                }}
              ></div>
              <div className="banner_category">
                <Link to="/mensProduct">men's</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="banner_item" data-aos="fade-left">
              <div
                className="banner_background"
                style={{
                  backgroundImage: `url(${Banner1})`, // Women's banner second
                }}
              ></div>
              <div className="banner_category">
                <Link to="/about/wilster">women's by wilster</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryBanner;