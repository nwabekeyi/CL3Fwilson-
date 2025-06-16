// src/components/Overview.jsx
import React, { useEffect } from 'react';
import { FaChartBar } from 'react-icons/fa';
import useProductManager from '../../hooks/useProductManager';

const Overview = ({ participants, contests, contestsLoading, contestsError }) => {
  const { fetchProducts, products, loading: productsLoading, error: productsError } = useProductManager();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate metrics
  const totalContests = contests.length;
  const totalParticipants = participants.length;
  const totalWilsterProducts = products.filter(p => p.department === 'wilster').length;
  const totalClefwilsonProducts = products.filter(p => p.department === 'cl3fwilson').length;

  return (
    <div className="contest-manager">
      {/* Welcome Message and Icon */}
      <div className="card mb-4">
        <div className="card-body text-center">
          <h4 className="card-title" style={{ color: '#374151', fontWeight: '600' }}>
            Welcome to Your Dashboard
          </h4>
          <p className="card-text" style={{ color: '#4b5563', fontSize: '16px' }}>
            Kindly select options in the sidebar to view details.
          </p>
          <div className="mt-3">
            <FaChartBar
              style={{
                width: '120px',
                height: '120px',
                color: '#2563eb',
                transition: 'transform 0.2s',
              }}
              className="dashboard-icon"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(productsError || contestsError) && (
        <div className="alert-error mb-4">
          {productsError || contestsError}
        </div>
      )}

      {/* Loading Indicator */}
      {(productsLoading || contestsLoading) && (
        <div className="text-center mb-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Contests</h5>
              <p className="card-text fs-4">{totalContests}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Participants</h5>
              <p className="card-text fs-4">{totalParticipants}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Wilster Products</h5>
              <p className="card-text fs-4">{totalWilsterProducts}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Clefwilson Products</h5>
              <p className="card-text fs-4">{totalClefwilsonProducts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;