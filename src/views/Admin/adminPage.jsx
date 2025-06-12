// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAdmin } from '../../hooks/useAuthAdmin';
import useApi from '../../hooks/useApi';
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

const AdminPage = () => {
  const navigate = useNavigate();
  const { loading, user } = useAuthAdmin();
  const { request, error: apiError } = useApi();
  const [participants, setParticipants] = useState([]);
  const [participantsError, setParticipantsError] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [contestId, setContestId] = useState(null);

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

  // Fetch participants when contestId changes
  useEffect(() => {
    if (contestId) {
      const fetchParticipants = async () => {
        try {
          const data = await request({
            url: `${import.meta.env.VITE_CONTEST_ENDPOINT}/${contestId}/participants`,
            method: 'GET',
          });
          setParticipants(data);
          setParticipantsError('');
        } catch (err) {
          setParticipantsError('Failed to fetch participants. Please select a contest.');
          setParticipants([]);
        }
      };
      fetchParticipants();
    } else {
      setParticipants([]);
      setParticipantsError('No contest selected. Please create or select a contest.');
    }
  }, [contestId, request]);

  useEffect(() => {
    console.log('AdminPage auth state:', { loading, user: 'contest_id' });
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
    contest: (
      <ParticipantManager
        participants={participants}
        participantsError={participantsError || apiError}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        contestId={contestId}
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