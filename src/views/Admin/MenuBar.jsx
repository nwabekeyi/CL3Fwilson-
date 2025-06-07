import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const MenuBar = ({ sidebarOpen, toggleSidebar }) => (
  <div className="menu-bar">
    <button
      className="toggle-button"
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      {sidebarOpen ? <FiX /> : <FiMenu />}
    </button>
    <span className="brand">Admin Dashboard</span>
  </div>
);

export default MenuBar;