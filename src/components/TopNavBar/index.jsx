// components/TopNavBar.jsx
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
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");

  // Sync with Firebase auth state and localStorage
  useEffect(() => {
    // Firebase auth listener
    const unsubscribe = auth ? onAuthStateChanged(auth, (firebaseUser) => {
      const authUser = Auth.getUserDetails();
      const authToken = Auth.getToken();
      console.log("TopNavBar Auth State:", {
        firebaseUser: firebaseUser ? firebaseUser.email : null,
        authUser,
        authToken,
      });
      setUser(authUser);
      setToken(authToken);
    }) : () => console.warn("Firebase auth not initialized in TopNavBar");

    // localStorage listener
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

    // Initial check
    handleStorageChange({ key: "auth" });

    return () => {
      unsubscribe && unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Load preferred currency
  useEffect(() => {
    const storedCurrency = sessionStorage.getItem("preferredCurrency");
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }
  }, []);

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
      // Removed navigate("/") to stay on current path
    } catch (error) {
      console.error("TopNavBar: Logout error:", error);
    }
  };

  const handleCurrencyChange = (currency) => {
    sessionStorage.setItem("preferredCurrency", currency);
    setSelectedCurrency(currency);
  };

  const isAdminPath = location.pathname.toLowerCase().includes("/admin");

  return (
    <div className={`top_nav ${className}`}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="top_nav_left">order from any location</div>
          </div>
          <div className="col-md-6 text-right">
            <div className="top_nav_right">
              <ul className="top_nav_menu">
                <li className="currency">
                  <a href="#">
                    {selectedCurrency.toLowerCase()}
                    <i className="fa fa-angle-down"></i>
                  </a>
                  <ul className="currency_selection">
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

                {user && token ? (
                  <li className="account">
                    <a href="#">
                      {`Welcome ${user.user_name || user.email || "User"}`}
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