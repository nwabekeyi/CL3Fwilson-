import React from "react";
import Banner1 from "../../assets/images/voting.jpg";
import { Link } from "react-router-dom";

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
          <h1>About CL3Fwilson</h1>
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
            Founded in 2020, we have remained one of the pioneers in classic custom-fit, made-to-order suits. We remain unique in our approach to fashion.
            </p>
            <p>
            Our customers cut across the middle class corporate Africans to High class,our watch words are excellence and satisfactory service. To ensure that we stay true to our promise to customers, every single suit we make represents true value for your money.
            </p>
            <p>
            We produce the perfect suit for any occasion in a comprehensive range of fits and Big and Tall sizes.
 
            You can build the perfect outfit for any occasion with minimal effort whether it's prom Suits,Wedding suit,dinner suits or a Tweed jacket for that special weekend away.
              
            If you're stuck for ideas we've got style tips and suggestions for you.
            
            The CL3FWILSON signature, the tailored suit. Timeless,classy and refined, every piece is masterfully constructed by our in-house tailors using the finest fabrics with impeccable attention to detail.
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
            To empower individuals to express confidence, sophistication, and timeless elegance through meticulously crafted suits and dresses that blend modern design with classic tailoring. We are committed to excellence in craftsmanship, sustainable practices, and creating garments that make every moment feel exceptional.            </p>
          </div>
        </div>
      </div>

      {/* Pageant Initiative Section */}
      <div className="container about-pageant-container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="section_title">
              <h2>Project Cl3fwilson</h2>
            </div>
            <p>
            Project Cl3fwilson is a semi-annual fashion workshop/competition that creates a platform for fashion designers. It works to educate fashion designers about sustainable theories.
            </p>
            <p>
            Project cl3fwilson is a Workshop that educates emerging fashion designers on Fashion Business, Branding, and Marketing.
            </p>
            <div className="red_button shop_now_button">
              <Link to='/workshop'>Explore workshop</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;