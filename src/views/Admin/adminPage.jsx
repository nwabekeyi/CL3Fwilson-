// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAdmin } from '../../hooks/useAuthAdmin';
import useApi from '../../hooks/useApi';
import { useContestManager } from '../../hooks/useContestManager';
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
  const { loading: authLoading, user } = useAuthAdmin();
  const { request, error: apiError } = useApi();
  const [contestId, setContestId] = useState(null);
  const {
    contests,
    fetchContests,
    loading: contestsLoading,
    apiError: contestsError,
    participants
  } = useContestManager(setContestId);
  const [allParticipants, setAllParticipants] = useState([]);
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

  // Fetch contests and aggregate participants
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchContests();
      } catch (err) {
        setAllParticipants([]);
      }
    };

    fetchData();
  }, [fetchContests]);

  // Update allParticipants when contests change
  useEffect(() => {
    const allParticipantsData = contests.flatMap(contest =>
      (contest.participants || []).map(p => ({
        ...p,
        contestId: contest.id,
      }))
    );
    setAllParticipants(allParticipantsData);
  }, [contests]);


  useEffect(() => {
    console.log('AdminPage auth state:', { authLoading, user: user ? 'logged_in' : 'not_logged_in' });
  }, [authLoading, user]);

  if (authLoading || !user) {
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
    overview: (
      <Overview
        participants={participants}
        contests={contests}
        contestsLoading={contestsLoading}
        contestsError={contestsError}
      />
    ),
    contest: (
      <ParticipantManager
        participants={participants}
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