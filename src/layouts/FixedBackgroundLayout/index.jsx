import React from "react";
import "./FixedBackgroundLayout.css";

const FixedBackgroundLayout = ({ children, backgroundImage }) => {
  return (
    <div
      className="fixed-background"
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none" }}
    >
      <div className="content-container">{children}</div>
    </div>
  );
};

export default FixedBackgroundLayout;