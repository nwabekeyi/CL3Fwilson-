// src/components/MobileMenu.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Auth from "../../modules/Auth";
import { FaPhone, FaQuestionCircle, FaWhatsapp, FaAngleDown, FaSignOutAlt } from "react-icons/fa";

const MobileMenu = ({ activeClass, onClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const location = useLocation();

  // Initialize currency from sessionStorage
  useEffect(() => {
    const storedCurrency = sessionStorage.getItem("preferredCurrency");
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }
  }, []);

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    sessionStorage.setItem("preferredCurrency", currency);
    setSelectedCurrency(currency);
    setIsCurrencyOpen(false);
    onClose();
    window.location.reload();
  };

  // Toggle currency dropdown
  const toggleCurrencyDropdown = () => {
    setIsCurrencyOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    console.log("handleLogout: Initiating logout...");
    try {
      await Auth.logout();
      window.dispatchEvent(new Event("storage"));
      console.log("handleLogout: Logout successful");
      onClose(); // Close mobile menu
    } catch (error) {
      console.error("handleLogout: Logout error:", error);
    }
  };

  const isAdminPath = location.pathname === "/admin";

  return (
    <div className={activeClass ? "hamburger_menu active" : "hamburger_menu"}>
      <div className="hamburger_close" onClick={onClose}>
        <i className="fa fa-times" aria-hidden="true" aria-label="Close menu"></i>
      </div>
      <div className="hamburger_menu_content text-right">
        <ul className="menu_top_nav">
          <li className="menu_item currency">
            <div className="currency_display">Currency: {selectedCurrency}</div>
            <div
              className="dropdown_toggle"
              onClick={toggleCurrencyDropdown}
              role="button"
              aria-expanded={isCurrencyOpen}
            >
              {selectedCurrency.toLowerCase()} <FaAngleDown />
            </div>
            <ul className={`currency_selection ${isCurrencyOpen ? "active" : ""}`}>
              <li>
                <a href="#" onClick={() => handleCurrencyChange("NGN")}>
                  ngn
                </a>
              </li>
              <li>
                <a href="#" onClick={() => handleCurrencyChange("EUR")}>
                  eur
                </a>
              </li>
              <li>
                <a href="#" onClick={() => handleCurrencyChange("USD")}>
                  usd
                </a>
              </li>
            </ul>
          </li>
          <li className="menu_item">
            <Link to="/" onClick={onClose}>
              home
            </Link>
          </li>
          <li className="menu_item">
            <Link to="/contact" onClick={onClose}>
              <FaPhone /> Contact
            </Link>
          </li>
          <li className="menu_item">
            <Link to="/about/cl3fwilson" onClick={onClose}>
              About CL3Fwilson
            </Link>
          </li>
          <li className="menu_item">
            <Link to="/wilster" onClick={onClose}>
              Women's by Wilster
            </Link>
          </li>
          <li className="menu_item">
            <Link to="/workshop" onClick={onClose}>
              Project Cl3fwilson
            </Link>
          </li>
          <li className="menu_item">
            <Link to="/faq" onClick={onClose}>
              <FaQuestionCircle /> FAQ
            </Link>
          </li>
          <li className="menu_item">
            <a
              href="https://wa.me/message/2YZ3Y7ILSIIAJ1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <FaWhatsapp /> WhatsApp Us
            </a>
          </li>
          <li className="menu_item">
            <Link to="/workshop/vote" onClick={onClose}>
              Your Candidate
            </Link>
          </li>
          {isAdminPath && (
            <li className="menu_item">
              <a href="#" onClick={handleLogout}>
                <FaSignOutAlt /> Sign out
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;