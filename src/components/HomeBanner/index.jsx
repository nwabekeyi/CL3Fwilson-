import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Carousel } from "react-bootstrap";

// Import background images for home (men's fashion)
import BackgroundImage1 from "../../assets/images/heroImage.jpeg";
import BackgroundImage2 from "../../assets/images/heroImage2.jpeg";
import BackgroundImage3 from "../../assets/images/heroImage3.jpeg";

// Placeholder images for wilster (women's fashion) and workshop (you can replace these)
import WilsterImage1 from "../../assets/images/slider_1.jpg"; // Add these images to your assets
import WilsterImage2 from "../../assets/images/slider_2.jpg";
import WilsterImage3 from "../../assets/images/slider_3.jpg";
import WorkshopImage1 from "../../assets/images/slider_1.jpg";
import WorkshopImage2 from "../../assets/images/slider_2.jpg";
import WorkshopImage3 from "../../assets/images/slider_3.jpg";
const currentYear = new Date().getFullYear();

function HomeBanner() {
  const location = useLocation(); // Get the current path

  // Define content for each section
  const homeContent = [
    {
      background: BackgroundImage1,
      subtitle: `Men's Spring / Summer Collection ${currentYear}`,
      title: "Upgrade Your Wardrobe with Up to 30% Off",
      link: "/shop/men",
    },
    {
      background: BackgroundImage2,
      subtitle: `Latest Trends in Men's Fashion ${currentYear}`,
      title: "Stylish Fits for Every Occasion",
      link: "/shop/men",
    },
    {
      background: BackgroundImage3,
      subtitle: `Men's Premium Collection ${currentYear}`,
      title: "Discover Timeless Styles and Modern Comfort",
      link: "/shop/men",
    },
  ];

  const wilsterContent = [
    {
      background: WilsterImage1,
      subtitle: `Women's Fashion ${currentYear}`,
      title: "Elegant Dresses and Stylish Bags",
      link: "/shop/wilster",
    },
    {
      background: WilsterImage2,
      subtitle: `New Arrivals in Female Wear ${currentYear}`,
      title: "Explore Trendy Outfits and Accessories",
      link: "/shop/wilster",
    },
    {
      background: WilsterImage3,
      subtitle: `Luxury Bags Collection ${currentYear}`,
      title: "Complete Your Look with Designer Bags",
      link: "/shop/wilster",
    },
  ];

  const workshopContent = [
    {
      background: WorkshopImage1,
      subtitle: `Fashion Workshop Pageant ${currentYear}`,
      title: "Join Our Annual Fashion Design Event",
      link: "/workshop/register",
    },
    {
      background: WorkshopImage2,
      subtitle: `Workshop Registration Now Open`,
      title: "Learn from Industry Experts",
      link: "/workshop/register",
    },
    {
      background: WorkshopImage3,
      subtitle: `Pageant Showcase ${currentYear}`,
      title: "Showcase Your Designs on the Runway",
      link: "/workshop/register",
    },
  ];

  // Determine which content to display based on the path
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
      contentToDisplay = homeContent; // Fallback to home content
  }

  return (
    <Carousel>
      {contentToDisplay.map((item, index) => (
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
                      <a href={item.link}>shop now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default HomeBanner;