// src/components/ContestManager/ViewParticipantsModal.jsx
import React from 'react';

const ViewParticipantsModal = ({
  showViewParticipantsModal,
  participants,
  isSubmitting,
  loading,
  setShowViewParticipantsModal,
  handleAddVotes,
  selectedContestId,
}) => {
  return (
    <div
      className={`modal fade ${showViewParticipantsModal ? 'show d-block' : ''}`}
      tabIndex="-1"
      aria-labelledby="viewParticipantsModalLabel"
      aria-hidden={!showViewParticipantsModal}
      style={{ backgroundColor: showViewParticipantsModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="viewParticipantsModalLabel">
              Participants
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowViewParticipantsModal(false)}
              disabled={isSubmitting || loading}
            ></button>
          </div>
          <div className="modal-body">
            {participants.length === 0 ? (
              <p>No participants have been added to this contest yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Code Name</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>About</th>
                      <th>Photo</th>
                      <th>Votes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant.codeName}>
                        <td>{participant.codeName}</td>
                        <td>{participant.fullName}</td>
                        <td>{participant.email}</td>
                        <td>{participant.about}</td>
                        <td>
                          {participant.photo ? (
                            <img
                              src={participant.photo}
                              alt="Participant"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            'No photo'
                          )}
                        </td>
                        <td>{participant.votes.reduce((sum, vote) => sum + vote.voteCount, 0)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleAddVotes(selectedContestId, participant.codeName)}
                            disabled={isSubmitting || loading}
                          >
                            Add Votes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowViewParticipantsModal(false)}
              disabled={isSubmitting || loading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewParticipantsModal;