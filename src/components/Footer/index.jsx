import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Footer Links and Social Icons */}
        <div className="row">
          {/* Navigation Links */}
          <div className="col-lg-6">
            <div className="footer_nav_container d-flex flex-sm-row flex-column align-items-center justify-content-lg-start justify-content-center text-center">
              <ul className="footer_nav">
                <li>
                  <Link to="/about/cl3fwilson">About us</Link>
                </li>
                <li>
                  <Link to="/faq">FAQs</Link>
                </li>
                <li>
                  <Link to="/contact">Contact us</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="col-lg-6">
            <div className="footer_social d-flex flex-row align-items-center justify-content-lg-end justify-content-center">
              <ul>
                <li>
                  <a
                    href="https://x.com/cl3fwilson?lang=en"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/cl3fwilson/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/search?q=cl3fwilson&t=1747906088777"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-tiktok"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col-lg-12">
            <div className="footer_nav_container">
              <div className="cr">
                © {new Date().getFullYear()} All Rights Reserved.{" "}
                <i className="fa fa-heart-o" aria-hidden="true"></i> by{" "}
                <Link
                  to="/"
                >
                  CL3FWILSON
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
