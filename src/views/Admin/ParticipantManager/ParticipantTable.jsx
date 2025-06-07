import React from 'react';
import { FiEye } from 'react-icons/fi';

const ParticipantTable = ({
  participants,
  handleEditParticipant,
  handleDeleteParticipant,
  handleViewVotes,
  isSubmitting,
}) => {
  const onEditClick = (participant) => {
    console.log('Edit button clicked for participant:', participant); // Debug click
    handleEditParticipant(participant);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Contestants</h5>
      </div>
      <div className="card-body">
        {participants.length === 0 ? (
          <p>No contestants yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Code Name</th>
                  <th>Email</th>
                  <th>Photo</th>
                  <th>Voters</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.docId}>
                    <td>{participant.fullName || 'N/A'}</td>
                    <td>{participant.codeName || 'N/A'}</td>
                    <td>{participant.email || 'N/A'}</td>
                    <td>
                      {participant.photoURL ? (
                        <img
                          src={participant.photoURL}
                          alt={participant.fullName}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                          }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td>{participant.voters?.length || 0}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => onEditClick(participant)}
                        disabled={isSubmitting}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteParticipant(participant.docId)}
                        disabled={isSubmitting}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-info me-2 ml-2"
                        onClick={() => handleViewVotes(participant)}
                      >
                        <FiEye /> View Votes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantTable;