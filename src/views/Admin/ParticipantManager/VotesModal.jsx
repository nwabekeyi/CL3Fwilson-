import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const VotesModal = ({ show, onHide, participant, votes = [] }) => {
  // Safely format the timestamp
  const formatTimestamp = (timestamp) => {
    try {
      return timestamp?.toDate?.().toLocaleString() || 'Unknown date';
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10vh' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '60vh',
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Header remains the same */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            width: '100%',
            zIndex: 1050,
            padding: '1rem',
            borderBottom: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Modal.Title style={{ margin: 0 }}>
            Votes for {participant?.fullName || 'Participant'} ({votes.length})
          </Modal.Title>
          <button
            onClick={onHide}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Body with safe data handling */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
          {votes.length > 0 ? (
            <ul className="list-group" style={{ margin: 0 }}>
              {votes.map((vote, index) => (
                <li key={vote.id || index} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{vote.fullName}</div>
                      <div>Email: {vote.email}</div>
                      <div className="text-muted small">
                        Transaction ID: {vote.id}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-muted small">
                        {formatTimestamp(vote.timestamp)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No votes yet for this participant.</p>
          )}
        </div>

        {/* Footer remains the same */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VotesModal;