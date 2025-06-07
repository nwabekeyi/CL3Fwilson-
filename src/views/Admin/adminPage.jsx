import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAdmin } from '../../hooks/useAuthAdmin';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import MenuBar from './MenuBar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Overview from './Overview';
import ParticipantManager from './ParticipantManager/ParticipantManager';
import ProductManager from './productManager';
import '../../assets/css/Dashboard.css';
import '../../assets/css/responsive.css';
import '../../assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {db} from '../../firebase/config'

const AdminPage = () => {
  const navigate = useNavigate();
  const { loading, user } = useAuthAdmin();
  const { data: participants, error: participantsError } = useFirestoreCollection(db, 'participants');
  const [selectedComponent, setSelectedComponent] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log('Sidebar toggled, new state:', !sidebarOpen);
  };

  const handleNavigation = (component) => {
    setSelectedComponent(component);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
    console.log('Navigated to component:', component);
  };

  useEffect(() => {
    console.log('AdminPage auth state:', { loading, user: user ? user.email : null });
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div>
        <MenuBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const componentMap = {
    overview: <Overview participants={participants} />,
    participants: (
      <ParticipantManager
        participants={participants}
        participantsError={participantsError}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
    ),
    products: (
      <div className="card">
        <div className="card-header">
          <h5>Product Management</h5>
        </div>
        <div className="card-body">
          <ProductManager />
        </div>
      </div>
    ),
  };

  return (
    <div>
      <MenuBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          selectedComponent={selectedComponent}
          handleNavigation={handleNavigation}
        />
        <MainContent sidebarOpen={sidebarOpen}>
          {componentMap[selectedComponent]}
        </MainContent>
      </div>
    </div>
  );
};

export default AdminPage;