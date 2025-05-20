import React from "react";
import { Link } from "react-router-dom";
import "./SectionContent.css";

const SectionContent = ({ heading, description, linkTo, buttonText = "Shop Now" }) => {
  return (
    <div className="section-content">
      <h1 className="section-heading">{heading}</h1>
      {description && <p id="section-description">{description}</p>}
      <Link to={linkTo} className="red_button shop_now_button">
        {buttonText}
      </Link>
    </div>
  );z
};

export default SectionContent;