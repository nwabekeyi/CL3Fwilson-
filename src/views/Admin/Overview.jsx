import React from 'react';

const Overview = ({ participants }) => {
  const totalParticipants = participants.length;
  const totalVotes = participants.reduce((sum, p) => sum + (p.voters?.length || 0), 0);

  return (
    <div className="row mb-4">
      <div className="col-md-6 mb-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Participants</h5>
            <p className="card-text fs-4">{totalParticipants}</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Votes</h5>
            <p className="card-text fs-4">{totalVotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;