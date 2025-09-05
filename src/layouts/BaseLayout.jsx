import React, { useState, useEffect, useCallback } from "react";
import TopNavBar from "../components/TopNavBar";
import NavBarContainer from "../components/NavBar/NavBarContainer";
import Footer from "../components/Footer";

const BaseLayout = ({ children }) => {
  const [topHeaderClass, setTopHeaderClass] = useState("show");


  const handleScroll = useCallback(() => {
    if (window.scrollY >= 50) {
      setTopHeaderClass("hide");
    } else {
      setTopHeaderClass("show");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="main-wrapper">
      <div className="super_container">
        <header className="header trans_300">
          <TopNavBar className={topHeaderClass} />
          <NavBarContainer />
        </header>
        <div className="layout-Container">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default BaseLayout;
