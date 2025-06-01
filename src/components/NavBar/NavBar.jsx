import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { useSelector } from "react-redux";
import HomeCartView from "../HomeCartView";
import MobileMenu from "../MobileMenu";
import device from "../../modules/mediaQuery";
import MediaQuery from "react-responsive";
import { FaShoppingCart, FaPhone, FaQuestionCircle, FaWhatsapp } from "react-icons/fa";
import companyLogo from "../../assets/images/cw.png";
import wilster from "../../assets/images/wilster.jpg";

const NavBar = () => {
  const [modalShow, setModalShow] = useState(false);
  const [activeClass, setActiveClass] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Get current pathname
  const location = useLocation();

  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // Compute total quantity
  const totalQty = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Format cart for HomeCartView
  const cart = {
    items: cartItems.reduce((acc, item) => {
      acc[item.productId] = {
        item: {
          title: item.title,
          price: item.price,
          imagePath: item.imagePath,
        },
        qty: item.quantity,
        price: item.price,
      };
      return acc;
    }, {}),
    totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  };

  const toggleModal = () => {
    setModalShow((prev) => !prev);
  };

  const toggleMenu = () => {
    setActiveClass((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check in case user reloads mid-scroll
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Determine which logo to use based on pathname
  const logoSource = location.pathname === "/wilster" ? wilster : companyLogo;

  return (
    <div
      className="main_nav_container"
      style={{
        background: isScrolling && "transparent",
        transition: "background 0.3s ease",
        backdropFilter: isScrolling ? "blur(5px)" : "none",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-right">
            <div className="logo_container">
              <Link to="/">
                <img
                  style={{ width: "100px", height: "auto" }}
                  src={logoSource} // Use dynamic logo source
                  alt="company logo"
                />
              </Link>
            </div>
            <nav className="navbar">
              <ul className="navbar_menu">
                <li><Link to="/">home</Link></li>
                <li className="dropdown">
                  <Link to="/contact" className="dropdown_toggle">
                    contact <i className="fa fa-angle-down" aria-hidden="true"></i>
                  </Link>
                  <ul className="dropdown_menu">
                    <li><Link to="/contact"><FaPhone /> Contact</Link></li>
                    <li><Link to="/faq"><FaQuestionCircle /> FAQ</Link></li>
                    <li>
                      <a href="https://wa.me/message/2YZ3Y7ILSIIAJ1" target="_blank">
                        <FaWhatsapp /> WhatsApp Us
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <Link className="dropdown_toggle">
                    about <i className="fa fa-angle-down" aria-hidden="true"></i>
                  </Link>
                  <ul className="dropdown_menu">
                    <li><Link to="/about/cl3fwilson">About CL3Fwilson</Link></li>
                    <li><Link to="/wilster">Women's by Wilster</Link></li>
                  </ul>
                </li>
                <li className="dropdown">
                  <Link to="/workshop" className="dropdown_toggle">
                    workshop <i className="fa fa-angle-down" aria-hidden="true"></i>
                  </Link>
                  <ul className="dropdown_menu">
                    <li><Link to="/workshop">Project Cl3fwilson</Link></li>
                    <li><Link to="/workshop/vote">Vote for Your Candidate</Link></li>
                  </ul>
                </li>
              </ul>

              <ul className="navbar_user">
                <li>
                  <Link to="/search">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </Link>
                </li>
                <li className="checkout">
                  <a href="#" onClick={toggleModal} style={{ display: "flex", alignItems: "center" }}>
                    <FaShoppingCart size={20} />
                    {totalQty > 0 && (
                      <span id="checkout_items" className="checkout_items">
                        {totalQty}
                      </span>
                    )}
                  </a>
                </li>
              </ul>

              <div className="hamburger_container" onClick={toggleMenu}>
                <i className="fa fa-bars" aria-hidden="true"></i>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <MediaQuery query={device.max.tabletL}>
        <MobileMenu activeClass={activeClass} onClose={toggleMenu} />
      </MediaQuery>

      {modalShow && (
        <HomeCartView cart={cart} show={modalShow} onHide={toggleModal} />
      )}
    </div>
  );
};

export default NavBar;