import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import LoginRegister from "../LoginRegisterModal";
import Auth from "../../modules/Auth";
import { auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const TopNavBar = ({ className }) => {
  const [modalShow, setModalShow] = useState(false);
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState(Auth.getUserDetails());
  const [token, setToken] = useState(Auth.getToken());
  const location = useLocation();
  const [selectedCurrency, setSelectedCurrency] = useState(
    sessionStorage.getItem("preferredCurrency") || "NGN"
  );
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  // Sync with Firebase auth state and localStorage
  useEffect(() => {
    const unsubscribe = auth
      ? onAuthStateChanged(auth, (firebaseUser) => {
          const authUser = Auth.getUserDetails();
          const authToken = Auth.getToken();
          console.log("TopNavBar Auth State:", {
            firebaseUser: firebaseUser ? firebaseUser.email : null,
            authUser,
            authToken,
          });
          setUser(authUser);
          setToken(authToken);
        })
      : () => console.warn("Firebase auth not initialized in TopNavBar");

    const handleStorageChange = (event) => {
      if (event.key === "auth" || !event.key) {
        const authUser = Auth.getUserDetails();
        const authToken = Auth.getToken();
        console.log("TopNavBar Storage Change:", { authUser, authToken });
        setUser(authUser);
        setToken(authToken);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange({ key: "auth" });

    return () => {
      unsubscribe && unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle currency selection and reload page
  const handleCurrencyChange = (currency) => {
    console.log("Selected Currency:", currency);
    sessionStorage.setItem("preferredCurrency", currency);
    setSelectedCurrency(currency);
    setIsCurrencyOpen(false);
    window.location.reload(); // Reload the page
  };

  // Toggle currency dropdown
  const toggleCurrencyDropdown = (e) => {
    e.preventDefault();
    console.log("Toggling dropdown, isCurrencyOpen:", !isCurrencyOpen);
    setIsCurrencyOpen((prev) => !prev);
  };

  const showHideModal = () => setModalShow(false);
  const loginClicked = () => {
    setModalShow(true);
    setLogin(true);
  };
  const registerClicked = () => {
    setModalShow(true);
    setLogin(false);
  };

  const logout = async () => {
    console.log("TopNavBar: Logging out...");
    try {
      await Auth.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("TopNavBar: Logout error:", error);
    }
  };

  const isAdminPath = location.pathname.toLowerCase().includes("/admin");

  return (
    <div className={`top_nav ${className}`}>
      <style>
        {`
          .currency {
            position: relative;
            display: inline-block;
          }
          .currency_selection {
            position: absolute;
            top: 100%;
            right: 0;
            background: #fff;
            border: 1px solid #ddd;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            min-width: 100px;
            display: ${isCurrencyOpen ? 'block' : 'none'};
          }
          .currency_selection li {
            list-style: none;
          }
          .currency_selection li a {
            display: block;
            padding: 8px 12px;
            color: #333;
            text-decoration: none;
          }
          .currency_selection li a:hover {
            background: #f0f0f0;
          }
        `}
      </style>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="top_nav_left">order from any location</div>
          </div>
          <div className="col-md-6 text-right">
            <div className="top_nav_right">
              <ul className="top_nav_menu">
                <li className="currency">
                  <a
                    href="#"
                    onClick={toggleCurrencyDropdown}
                    aria-expanded={isCurrencyOpen}
                    aria-controls="currency-selection"
                  >
                    {selectedCurrency.toLowerCase()}
                    <i className="fa fa-angle-down"></i>
                  </a>
                  <ul className="currency_selection" id="currency-selection">
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCurrencyChange("NGN");
                        }}
                      >
                        ngn
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCurrencyChange("EUR");
                        }}
                      >
                        eur
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCurrencyChange("USD");
                        }}
                      >
                        usd
                      </a>
                    </li>
                  </ul>
                </li>

                {token && location.pathname.includes("admin") ? (
                  <li className="account">
                    <a href="#">
                      {`Welcome ${user.user_name || user.email || "Admin portal"} `}
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="account_selection">
                      <li>
                        <a href="#" onClick={logout}>
                          <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                          Sign Out
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : isAdminPath ? (
                  <li className="account">
                    <a href="#">
                      Admin portal
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="account_selection">
                      <li>
                        <Link to="/sign-in">
                          <i className="fas fa-sign-in-alt" aria-hidden="true"></i>
                          Sign In
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {modalShow && (
        <LoginRegister
          show={modalShow}
          login={login}
          registerClicked={registerClicked}
          loginClicked={loginClicked}
          onHide={showHideModal}
        />
      )}
    </div>
  );
};

export default TopNavBar;