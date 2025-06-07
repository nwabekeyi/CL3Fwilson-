import React from 'react';

const MainContent = ({ sidebarOpen, children }) => (
  <div
    className="main-content"
    style={{ marginLeft: sidebarOpen && window.innerWidth > 768 ? '250px' : '0' }}
  >
    {children || <div className="alert alert-info">Select a section from the sidebar</div>}
  </div>
);

export default MainContent;