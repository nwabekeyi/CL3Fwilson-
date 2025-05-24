import React from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

// Import background images for home (men's fashion)
import BackgroundImage1 from "../../assets/images/heroImage.jpeg";
import BackgroundImage2 from "../../assets/images/heroImage2.jpeg";
import BackgroundImage3 from "../../assets/images/heroImage3.jpeg";

// Placeholder images for wilster (women's fashion) and workshop
import WilsterImage1 from "../../assets/images/wilster1.jpg";
import WilsterImage2 from "../../assets/images/wilster2.jpg";
import WilsterImage3 from "../../assets/images/wilster3.jpg";
import WorkshopImage1 from "../../assets/images/workshop1.jpg";
import WorkshopImage2 from "../../assets/images/workshop2.jpg";
import WorkshopImage3 from "../../assets/images/workshop3.jpg";

const currentYear = new Date().getFullYear();

function HomeBanner() {
  const location = useLocation(); // Get the current path

  // Define content for each section
  const homeContent = [
    {
      background: BackgroundImage1,
      subtitle: `Men's Spring / Summer Collection ${currentYear}`,
      title: "Upgrade Your Wardrobe with Up to 30% Off",
      link: "/mensProduct",
    },
    {
      background: BackgroundImage2,
      subtitle: `Latest Trends in Men's Fashion ${currentYear}`,
      title: "Stylish Fits for Every Occasion",
      link: "/mensProduct",
    },
    {
      background: BackgroundImage3,
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
      subtitle: `Fashion Workshop ${currentYear}`,
      title: "Join Our Annual Fashion Design Workshop",
      link: "#registration-form",
    },
    {
      background: WorkshopImage2,
      subtitle: `Workshop Registration Now Open`,
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

  // Determine which content to display based on the path
  let contentToDisplay;
  switch (location.pathname) {
    case "/":
      contentToDisplay = homeContent;
      break;
    case "/about/wilster":
      contentToDisplay = wilsterContent;
      break;
    case "/workshop":
      contentToDisplay = workshopContent;
      break;
    default:
      contentToDisplay = homeContent; // Fallback to home content
  }

  // Handle smooth scrolling for registration form
  const handleScrollToForm = (e) => {
    e.preventDefault();
    const formElement = document.querySelector("#registration-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Carousel>
      {contentToDisplay.map((item, index) => {
        // Determine link text based on pathname
        const linkText =
          location.pathname === "/about/wilster"
            ? "coming soon"
            : location.pathname === "/workshop"
            ? "Register"
            : "shop now";

        return (
          <Carousel.Item key={index}>
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