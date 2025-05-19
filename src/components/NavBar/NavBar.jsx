import React, { useState } from "react";
import { Link } from "react-router-dom";
import HomeCartView from "../HomeCartView";
import MobileMenu from "../MobileMenu";
import device from "../../modules/mediaQuery";
import MediaQuery from "react-responsive";
import { FaShoppingCart, FaPhone, FaQuestionCircle, FaWhatsapp } from "react-icons/fa"; // Icons for dropdowns
import companyLogo from '../../assets/images/cw.png';

const NavBar = ({ cart = {} }) => {
  const [modalShow, setModalShow] = useState(false);
  const [activeClass, setActiveClass] = useState(false);

  const toggleModal = () => {
    setModalShow((prev) => !prev);
  };

  const toggleMenu = () => {
    setActiveClass((prev) => !prev);
  };

  return (
    <div className="main_nav_container">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-right">
            <div className="logo_container">
              <Link to="/">
                <img style={{ width: '100px', height: 'auto' }} src={companyLogo} alt="company logo" />
              </Link>
            </div>
            <nav className="navbar">
              <ul className="navbar_menu">
                <li><Link to="/">home</Link></li>
                <li className="dropdown">
                  <Link to="/contact" className="dropdown_toggle">
                    contact
                    <i className="fa fa-angle-down" aria-hidden="true"></i>
                  </Link>
                  <ul className="dropdown_menu">
                    <li>
                      <Link to="/contact">
                        <FaPhone aria-hidden="true" /> Contact
                      </Link>
                    </li>
                    <li>
                      <Link to="/faq">
                        <FaQuestionCircle aria-hidden="true" /> FAQ
                      </Link>
                    </li>
                    <li>
                      <Link to="/whatsapp">
                        <FaWhatsapp aria-hidden="true" /> WhatsApp Us
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <Link className="dropdown_toggle">
                    about
                    <i className="fa fa-angle-down" aria-hidden="true"></i>
                  </Link>
                  <ul className="dropdown_menu">
                    <li>
                      <Link to="/about/cl3fwilson">About CL3Fwilson</Link>
                    </li>
                    <li>
                      <Link to="/about/wilster">About Wilster</Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <Link className="dropdown_toggle">
                    workshop
                    <i className="fa fa-angle-down" aria-hidden="true"></i>
                  </Link>
                  <ul className="dropdown_menu">
                    <li>
                      <Link to="/workshop/register">Register</Link>
                    </li>
                    <li>
                      <Link to="/workshop/vote">Vote for Your Candidate</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="navbar_user">
                <li>
                  <Link to="/search">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </Link>
                </li>
                <li className="checkout">
                  <a href="#" onClick={toggleModal} style={{ display: 'flex', alignItems: 'center' }}>
                    <FaShoppingCart size={20} />
                    {cart.totalQty !== undefined && (
                      <span id="checkout_items" className="checkout_items">
                        {cart.totalQty}
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