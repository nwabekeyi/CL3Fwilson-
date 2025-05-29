import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaQuestionCircle, FaWhatsapp, FaAngleDown } from "react-icons/fa";

const MobileMenu = ({ activeClass, onClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

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
    setIsCurrencyOpen(false); // Close dropdown after selection
    onClose(); // Close mobile menu
    window.location.reload(); // Optional: reload if other content depends on currency
  };

  // Toggle currency dropdown
  const toggleCurrencyDropdown = () => {
    setIsCurrencyOpen((prev) => !prev);
  };

  return (
    <div className={activeClass ? "hamburger_menu active" : "hamburger_menu"}>
      <div className="hamburger_close" onClick={onClose}>
        <i className="fa fa-times" aria-hidden="true" aria-label="Close menu"></i>
      </div>
      <div className="hamburger_menu_content text-right">
        <ul className="menu_top_nav">
          <li className="menu_item currency">
            <div className="currency_display">
              Currency: {selectedCurrency}
            </div>
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
            <Link to="/about/wilster" onClick={onClose}>
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
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;