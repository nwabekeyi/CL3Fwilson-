import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import usePreviousLocation from "../../hooks/usePreviousLocation"; // adjust path

import HomeBanner from "../../components/HomeBanner";
import CategoryBanner from "../../components/CategoryBanner/CategoryBanner";
import MensProducts from "../../components/Products/MensProducts";
import Benefit from "../../components/Benefit";
import Advertisement from "../../components/Advertisement";
import LoginRegister from "../../components/LoginRegisterModal";
import {
  MensSection,
  WomensSectionOne,
  MensSectionTwo,
  WomensSectionTwo,
} from "../../components/homeSection";
import "./Home.css";

const Home = ({ products, getAllProducts, postCart }) => {
  const [modalShow, setModalShow] = useState(false);
  const [login, setLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const prevLocation = usePreviousLocation();
  useEffect(() => {
    if (!products) {
      getAllProducts();
    }
  }, [products, getAllProducts]);

  useEffect(() => {
    // Show loader only if there is NO previous location
    if (prevLocation === 'home') {
      // First load or direct visit - show loader for 6 seconds
      const loaderTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 6000);

      return () => clearTimeout(loaderTimeout);
    } else {
      // If previous location exists, hide loader immediately
      setIsLoading(false);
    }
  }, [prevLocation]);

  const showHideModal = () => setModalShow(false);
  const loginClicked = () => {
    setModalShow(true);
    setLogin(true);
  };
  const registerClicked = () => {
    setModalShow(true);
    setLogin(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Page Content */}
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
      {/* Sticky WhatsApp Icon */}
      <a
        href="https://wa.me/message/2YZ3Y7ILSIIAJ1"
        className="whatsapp-icon"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp />
      </a>

      {/* Loader Overlay */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
