// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { FiHome, FiUsers, FiBox, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ sidebarOpen, selectedComponent, handleNavigation }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
    navigate('/admin/login');
    console.log('Logout clicked');
  };

  return (
    <div className={`sidebar ${sidebarOpen ? 'active' : 'hidden'}`}>
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <button
            className={`nav-link ${selectedComponent === 'overview' ? 'active' : ''}`}
            onClick={() => handleNavigation('overview')}
          >
            <FiHome /> Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${selectedComponent === 'contest' ? 'active' : ''}`}
            onClick={() => handleNavigation('contest')}
          >
            <FiUsers /> Bootcamp
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${selectedComponent === 'products' ? 'active' : ''}`}
            onClick={() => handleNavigation('products')}
          >
            <FiBox /> Products
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;