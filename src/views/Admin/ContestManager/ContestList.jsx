// src/components/ContestManager/ContestList.jsx
import React from 'react';

const ContestList = ({
  contests,
  isSubmitting,
  loading,
  handleEdit,
  handleDelete,
  handleSelectContest,
  handleAddParticipant,
  handleViewParticipants,
}) => {
  return (
    <div className="mt-4">
      <h5>Contest List</h5>
      {contests.length === 0 ? (
        <p>No contests available. Create one to start managing participants.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest.id}>
                  <td>{contest.name}</td>
                  <td>{new Date(contest.startDate).toLocaleDateString()}</td>
                  <td>{new Date(contest.endDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(contest)}
                      disabled={isSubmitting || loading}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => handleDelete(contest.id)}
                      disabled={isSubmitting || loading}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleSelectContest(contest.id)}
                      disabled={isSubmitting || loading}
                    >
                      Select
                    </button>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleAddParticipant(contest.id)}
                      disabled={isSubmitting || loading}
                    >
                      Add Participant
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleViewParticipants(contest.id)}
                      disabled={isSubmitting || loading}
                    >
                      View Participants
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContestList;