import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon from react-icons
import { login } from "../../ServerRequest";
import API from "../../axios/API";
import Auth from "../../modules/Auth";
import HomeBanner from "../../components/HomeBanner";
import CategoryBanner from "../../components/CategoryBanner/CategoryBanner";
import NewArrivals from "../../components/Products/NewArrivals";
import BestSeller from "../../components/Products/BestSeller";
import Benefit from "../../components/Benefit";
import Advertisement from "../../components/Advertisement";
import LoginRegister from "../../components/LoginRegisterModal";
import MensProducts from "../../components/Products/MensProducts";
import {
  MensSection,
  WomensSectionOne,
  MensSectionTwo,
  WomensSectionTwo
} from "../../components/homeSection";
import "./Home.css"; // Ensure the CSS is imported

const Home = ({ products, getAllProducts, postCart }) => {
  const [data, setData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [login, setLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!products) {
      getAllProducts();
    }

    const loaderTimeout = setTimeout(() => {
      console.log("Timeout triggered: stopping loader");
      setIsLoading(false);
    }, 6000); // 10 minutes

    return () => {
      console.log("Clearing timeout on unmount");
      clearTimeout(loaderTimeout);
    };
  }, [products, getAllProducts]);

  const showHideModal = () => {
    setModalShow(false);
  };

  const loginClicked = () => {
    setModalShow(true);
    setLogin(true);
  };

  const registerClicked = () => {
    setModalShow(true);
    setLogin(false);
  };

  const addToBag = params => {
    if (
      Auth.getUserDetails() !== undefined &&
      Auth.getUserDetails() !== null &&
      Auth.getToken() !== undefined
    ) {
      let cart = postCart(params);
      cart.then(res => {
        console.log(res);
      });
    } else {
      setModalShow(true);
    }
  };

  console.log("isLoading state:", isLoading);
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <HomeBanner />
      <MensSection />
      <WomensSectionOne />
      <MensSectionTwo />
      <WomensSectionTwo />
      <CategoryBanner />
      <MensProducts home={true} />
      <Benefit />
      <Advertisement />
      <LoginRegister
        show={modalShow}
        login={login}
        registerClicked={registerClicked}
        loginClicked={loginClicked}
        onHide={showHideModal}
      />
      {/* Sticky WhatsApp Icon - Only shown after loading */}
      <a
        href="https://wa.me/message/2YZ3Y7ILSIIAJ1"
        className="whatsapp-icon"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default Home;