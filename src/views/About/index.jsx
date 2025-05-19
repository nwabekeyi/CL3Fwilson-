import React from "react";
import Banner1 from "../../assets/images/banner_1.jpg";

function AboutUsPage() {
  return (
    <div className="about-us-page">
      {/* Fixed Background Banner */}
      <div
        className="about-banner"
        style={{
          backgroundImage: `url(${Banner1})`,
        }}
      >
        <div className="about-banner-overlay">
          <h1>About MenStyle</h1>
          <p>Elevating men’s fashion and celebrating style through creativity and community.</p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container about-story-container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="section_title">
              <h2>Our Story</h2>
            </div>
            <p>
              Founded in 2018, MenStyle was born from a passion for redefining men’s fashion in Nigeria and beyond. We believe that style is more than clothing—it’s a statement of identity, confidence, and individuality. Our curated collections blend timeless elegance with modern trends, offering premium suits, casual wear, and accessories crafted for the modern man.
            </p>
            <p>
              What sets us apart is our commitment to quality and community. Every piece is designed with precision, using sustainable materials whenever possible. We’re not just a brand; we’re a movement to empower men to express themselves through fashion.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="container about-mission-container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="section_title">
              <h2>Our Mission</h2>
            </div>
            <p>
              At MenStyle, our mission is to inspire confidence through exceptional fashion. We aim to provide high-quality, stylish clothing that fits every man’s lifestyle while fostering a community that celebrates creativity and self-expression. Through our online platform, we make premium fashion accessible, affordable, and sustainable.
            </p>
          </div>
        </div>
      </div>

      {/* Pageant Initiative Section */}
      <div className="container about-pageant-container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="section_title">
              <h2>Our Style Pageant</h2>
            </div>
            <p>
              Launched in 2020, the MenStyle Pageant is our way of celebrating the diverse expressions of style across Nigeria. This unique initiative invites men aged 18-35 to showcase their fashion sense and personality. Users can vote for their favorite contestants on our platform, with winners featured in our campaigns and awarded exclusive fashion prizes.
            </p>
            <p>
              The pageant is more than a competition—it’s a platform for creativity, confidence, and community. Join us in crowning the next style icon by registering or voting today!
            </p>
            <div className="red_button shop_now_button">
              <a href="/pageant">Explore the Pageant</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;