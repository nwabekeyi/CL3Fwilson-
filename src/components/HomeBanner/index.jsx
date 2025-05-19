import BackgroundImage1 from "../../assets/images/slider_1.jpg";
import BackgroundImage2 from "../../assets/images/slider_2.jpg";
import BackgroundImage3 from "../../assets/images/slider_3.jpg";
import { Carousel } from "react-bootstrap";

const currentYear = new Date().getFullYear();

function HomeBanner() {
  return (
    <Carousel>
      <Carousel.Item>
        <div
          className="d-block w-100 main_slider"
          style={{
            backgroundImage: `url(${BackgroundImage1})`,
          }}
        >
          <div className="container fill_height">
            <div className="row align-items-center fill_height">
              <div className="col">
                <div className="main_slider_content" data-aos="fade-right">
                  <h6>Men's Spring / Summer Collection {currentYear}</h6>
                  <h1>Upgrade Your Wardrobe with Up to 30% Off</h1>
                  <div className="red_button shop_now_button">
                    <a href="#">shop now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div
          className="d-block w-100 main_slider"
          style={{
            backgroundImage: `url(${BackgroundImage2})`,
          }}
        >
          <div className="container fill_height">
            <div className="row align-items-center fill_height">
              <div className="col">
                <div className="main_slider_content" data-aos="fade-right">
                  <h6>Latest Trends in Men's Fashion {currentYear}</h6>
                  <h1>Stylish Fits for Every Occasion</h1>
                  <div className="red_button shop_now_button">
                    <a href="#">shop now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div
          className="d-block w-100 main_slider"
          style={{
            backgroundImage: `url(${BackgroundImage3})`,
          }}
        >
          <div className="container fill_height">
            <div className="row align-items-center fill_height">
              <div className="col">
                <div className="main_slider_content" data-aos="fade-right">
                  <h6>Men's Premium Collection {currentYear}</h6>
                  <h1>Discover Timeless Styles and Modern Comfort</h1>
                  <div className="red_button shop_now_button">
                    <a href="#">shop now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default HomeBanner;
