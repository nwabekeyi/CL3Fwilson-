import React, { useState } from "react";
import { Link } from "react-router-dom";
import HomeCartView from "../HomeCartView";
import MobileMenu from "../MobileMenu";
import device from "../../modules/mediaQuery";
import MediaQuery from "react-responsive";

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
              
              <Link to="/fashion-cube">
                CL3FWILSON
              </Link>
            </div>
            <nav className="navbar">
              <ul className="navbar_menu">
                <li>
                  <Link to="/home">home</Link>
                </li>

                <li>
                  <a href="contact.html">contact</a>
                </li>
              </ul>
              <ul className="navbar_user">
                <li>
                  <a href="#">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </a>
                </li>
                <li className="checkout">
                  <a href="#" onClick={toggleModal}>
                    <i className="fas fa-shopping-bag"></i>
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
