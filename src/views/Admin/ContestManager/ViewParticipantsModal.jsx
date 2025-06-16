// src/components/ContestManager/ViewParticipantsModal.jsx
import React, { useState } from 'react';
import { FiX, FiPlus, FiUserMinus, FiEye, FiTrash2 } from 'react-icons/fi';

const ViewParticipantsModal = ({
  showViewParticipantsModal,
  participants,
  isSubmitting,
  loading,
  setShowViewParticipantsModal,
  handleAddVotes,
  selectedContestId,
  handleEvictParticipant,
  handleDeleteParticipant,
}) => {
  const [showVoteDetailsModal, setShowVoteDetailsModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [voteSearchTerm, setVoteSearchTerm] = useState('');

  const handleViewVotes = (participant) => {
    setSelectedParticipant(participant);
    setVoteSearchTerm('');
    setShowVoteDetailsModal(true);
  };

  const handleCloseMainModal = () => {
    setShowViewParticipantsModal(false);
  };

  const handleCloseVoteDetailsModal = () => {
    setShowVoteDetailsModal(false);
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    const votesA = a.votes.reduce((sum, vote) => sum + vote.voteCount, 0);
    const votesB = b.votes.reduce((sum, vote) => sum + vote.voteCount, 0);
    return votesB - votesA;
  });

  const filteredParticipants = sortedParticipants.filter((participant) => {
    const term = searchTerm.toLowerCase();
    return (
      participant.fullName?.toLowerCase().includes(term) ||
      participant.email?.toLowerCase().includes(term) ||
      participant.codeName?.toLowerCase().includes(term)
    );
  });

  const filteredVotes = selectedParticipant?.votes?.filter((vote) =>
    vote.voterName?.toLowerCase().includes(voteSearchTerm.toLowerCase()) ||
    vote.paymentReference?.toLowerCase().includes(voteSearchTerm.toLowerCase())
  ) || [];

  return (
    <>
      {/* Main Participants Modal */}
      <div
        className={`modal ${showViewParticipantsModal ? 'show' : ''}`}
        style={{ display: showViewParticipantsModal ? 'flex' : 'none' }}
        tabIndex="-1"
        aria-labelledby="viewParticipantsModalLabel"
        aria-hidden={!showViewParticipantsModal}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="viewParticipantsModalLabel">
                Participants
              </h5>
              <button
                type="button"
                className="close-icon"
                onClick={handleCloseMainModal}
                disabled={isSubmitting || loading}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {sortedParticipants.length === 0 ? (
                <p>No participants have been added to this contest yet.</p>
              ) : (
                <>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by Full Name, Email or Code Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '8px',
                      width: '100%',
                      marginBottom: '16px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  <div className="participants-grid">
                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((participant) => (
                        <div key={participant.codeName} className="participant-card">
                          <div className="participant-image">
                            <img
                              src={participant.photo || 'https://via.placeholder.com/150'}
                              alt={`${participant.codeName}'s photo`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="participant-details">
                            <h3>{participant.codeName}</h3>
                            <p>
                              <strong>Full Name:</strong> {participant.fullName}
                            </p>
                            <p>
                              <strong>Email:</strong> {participant.email}
                            </p>
                            <div className="about-container">
                              <strong>About:</strong>
                              <div className="about-text">
                                {participant.about || 'No description'}
                              </div>
                            </div>
                            <p>
                              <strong>Votes:</strong>{' '}
                              {participant.votes.reduce((sum, vote) => sum + vote.voteCount, 0)}
                            </p>
                            <div className="action-icons">
                              {participant.evicted ? (
                                <div className="evicted-container">
                                  <span className="evicted-label">Evicted</span>
                                  <span
                                    className={`action-icon danger ${isSubmitting || loading ? 'disabled' : ''}`}
                                    onClick={() =>
                                      !(isSubmitting || loading) &&
                                      handleDeleteParticipant(selectedContestId, participant.codeName)
                                    }
                                    data-tooltip-content="Delete"
                                  >
                                    <FiTrash2 size={20} />
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <span
                                    className={`action-icon primary ${isSubmitting || loading ? 'disabled' : ''}`}
                                    onClick={() =>
                                      !(isSubmitting || loading) &&
                                      handleAddVotes(selectedContestId, participant.codeName)
                                    }
                                    data-tooltip-content="Add Votes"
                                  >
                                    <FiPlus size={20} />
                                  </span>
                                  <span
                                    className={`action-icon danger ${isSubmitting || loading ? 'disabled' : ''}`}
                                    onClick={() =>
                                      !(isSubmitting || loading) &&
                                      handleEvictParticipant(selectedContestId, participant.codeName)
                                    }
                                    data-tooltip-content="Evict"
                                  >
                                    <FiUserMinus size={20} />
                                  </span>
                                </>
                              )}
                              <span
                                className={`action-icon primary ${isSubmitting || loading ? 'disabled' : ''}`}
                                onClick={() =>
                                  !(isSubmitting || loading) && handleViewVotes(participant)
                                }
                                data-tooltip-content="View Votes"
                              >
                                <FiEye size={20} />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No matching participants found.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vote Details Modal */}
      {selectedParticipant && (
        <div
          className={`modal ${showVoteDetailsModal ? 'show' : ''}`}
          style={{ display: showVoteDetailsModal ? 'flex' : 'none' }}
          tabIndex="-1"
          aria-labelledby="voteDetailsModalLabel"
          aria-hidden={!showVoteDetailsModal}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="voteDetailsModalLabel">
                  Vote Details for {selectedParticipant.codeName}
                </h5>
                <button
                  type="button"
                  className="close-icon"
                  onClick={handleCloseVoteDetailsModal}
                  disabled={isSubmitting || loading}
                  aria-label="Close modal"
                >
                  <FiX />
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Search by Voter Name or Payment Reference"
                  value={voteSearchTerm}
                  onChange={(e) => setVoteSearchTerm(e.target.value)}
                  style={{
                    padding: '8px',
                    width: '100%',
                    marginBottom: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                {filteredVotes.length === 0 ? (
                  <p>No matching votes found.</p>
                ) : (
                  <div className="vote-details-grid">
                    {filteredVotes.map((vote) => (
                      <div key={vote.id} className="vote-card">
                        <p>
                          <strong>Voter Name:</strong> {vote.voterName}
                        </p>
                        <p>
                          <strong>Vote Count:</strong> {vote.voteCount}
                        </p>
                        <p>
                          <strong>Payment Reference:</strong> {vote.paymentReference}
                        </p>
                        <p>
                          <strong>Date:</strong> {new Date(vote.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseVoteDetailsModal}
                  disabled={isSubmitting || loading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewParticipantsModal;