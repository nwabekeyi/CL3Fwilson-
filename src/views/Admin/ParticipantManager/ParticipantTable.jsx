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
    console.log('Edit button clicked for participant:', participant);
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
          <>
            {/* Desktop Table (992px and up) */}
            <div className="d-none d-lg-block">
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
            </div>

            {/* Tablet View (768px to 991px) */}
            <div className="d-lg-none">
              <div className="row">
                {participants.map((participant) => (
                  <div key={participant.docId} className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            {participant.photoURL ? (
                              <img
                                src={participant.photoURL}
                                alt={participant.fullName}
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                className="rounded"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                                }}
                              />
                            ) : (
                              <div 
                                className="d-flex align-items-center justify-content-center bg-light" 
                                style={{ width: '80px', height: '80px' }}
                              >
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="mb-1">{participant.fullName || 'N/A'}</h5>
                            <p className="mb-1 text-muted">
                              <small>Code: {participant.codeName || 'N/A'}</small>
                            </p>
                            <p className="mb-1">
                              <small>Email: {participant.email || 'N/A'}</small>
                            </p>
                            <p className="mb-2">
                              <small>Votes: {participant.voters?.length || 0}</small>
                            </p>
                            <div className="d-flex flex-wrap">
                              <button
                                className="btn btn-primary btn-sm me-2 mb-2"
                                onClick={() => onEditClick(participant)}
                                disabled={isSubmitting}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm me-2 mb-2"
                                onClick={() => handleDeleteParticipant(participant.docId)}
                                disabled={isSubmitting}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-info btn-sm mb-2"
                                onClick={() => handleViewVotes(participant)}
                              >
                                <FiEye className="me-1" /> Votes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 991px) and (min-width: 768px) {
          .card {
            margin-bottom: 1rem;
          }
          .btn {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ParticipantTable;