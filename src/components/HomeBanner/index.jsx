import React from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

import WilsterImage1 from "../../assets/images/wilster1.jpg";
import WilsterImage2 from "../../assets/images/wilster2.jpg";
import WilsterImage3 from "../../assets/images/wilster3.jpg";
import WorkshopImage1 from "../../assets/images/workshop1.jpg";
import WorkshopImage2 from "../../assets/images/workshop2.jpg";
import WorkshopImage3 from "../../assets/images/workshop3.jpg";


const currentYear = new Date().getFullYear();

function HomeBanner() {
  const location = useLocation();

  const homeContent = [
    {
      background:
        "https://res.cloudinary.com/diym28aqy/image/upload/f_auto,q_auto/v1751880254/heroImage_l519fl.jpg",
      subtitle: `Men's Spring / Summer Collection ${currentYear}`,
      title: "Upgrade Your Wardrobe with Up to 30% Off",
      link: "/mensProduct",
    },
    {
      background:
        "https://res.cloudinary.com/diym28aqy/image/upload/f_auto,q_auto/v1751880197/heroImage2_sn4sxt.jpg",
      subtitle: `Latest Trends in Men's Fashion ${currentYear}`,
      title: "Stylish Fits for Every Occasion",
      link: "/mensProduct",
    },
    {
      background:
        "https://res.cloudinary.com/diym28aqy/image/upload/f_auto,q_auto/v1751880356/heroImage3_co6kny.jpg",
      subtitle: `Men's Premium Collection ${currentYear}`,
      title: "Discover Timeless Styles and Modern Comfort",
      link: "/mensProduct",
    },
  ];

  const wilsterContent = [
    {
      background: WilsterImage1,
      subtitle: `Women's Fashion ${currentYear}`,
      title: "Elegant Dresses and Stylish Bags",
      link: "/wilster",
    },
    {
      background: WilsterImage2,
      subtitle: `New Arrivals in Female Wear ${currentYear}`,
      title: "Explore Trendy Outfits and Accessories",
      link: "/wilster",
    },
    {
      background: WilsterImage3,
      subtitle: `Luxury Bags Collection ${currentYear}`,
      title: "Complete Your Look with Designer Bags",
      link: "/wilster",
    },
  ];

  const workshopContent = [
    {
      background: WorkshopImage1,
      subtitle: `Fashion Bootcamp ${currentYear}`,
      title: "Join Our Annual Fashion Design Bootcamp",
      link: "#registration-form",
    },
    {
      background: WorkshopImage2,
      subtitle: `Bootcamp Registration Now Open`,
      title: "Learn from Other Fashion Designers",
      link: "#registration-form",
    },
    {
      background: WorkshopImage3,
      subtitle: `Project Cl3fwilson ${currentYear}`,
      title: "Showcase Your Designs",
      link: "#registration-form",
    },
  ];

  let contentToDisplay;
  switch (location.pathname) {
    case "/":
      contentToDisplay = homeContent;
      break;
    case "/wilster":
      contentToDisplay = wilsterContent;
      break;
    case "/workshop":
      contentToDisplay = workshopContent;
      break;
    default:
      contentToDisplay = homeContent;
  }

  const handleScrollToForm = (e) => {
    e.preventDefault();
    const formElement = document.querySelector("#registration-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Carousel fade controls={true} indicators={true} interval={4000}>
      {contentToDisplay.map((item, index) => {
        const linkText =
          location.pathname === "/wilster"
            ? "coming soon"
            : location.pathname === "/workshop"
            ? "Register"
            : "shop now";

        return (
          <Carousel.Item key={index} className="carousel-item">
            <img
              src={item.background}
              alt={`slide-${index}`}
              className="d-none"
              loading="lazy"
            />
            <div
              className="d-block w-100 main_slider"
              style={{
                backgroundImage: `url(${item.background})`,
              }}
            >
              <div className="container fill_height">
                <div className="row align-items-center fill_height">
                  <div className="col">
                    <div className="main_slider_content" data-aos="fade-right">
                      <h6>{item.subtitle}</h6>
                      <h1>{item.title}</h1>
                      <div className="red_button shop_now_button">
                        {linkText === "Register" ? (
                          <a href="#registration-form" onClick={handleScrollToForm}>
                            {linkText}
                          </a>
                        ) : (
                          <Link to={item.link}>{linkText}</Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default HomeBanner;
