import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const VotesModal = ({ show, onHide, participant, voters }) => (
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
          Voters for {participant?.fullName || 'Participant'}
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
      <div style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
        {voters.length > 0 ? (
          <ul className="list-group" style={{ margin: 0 }}>
            {voters.map((voter, index) => (
              <li key={index} className="list-group-item">
                <div>Email: {voter.email || 'Anonymous'}</div>
                <div>Transaction ID: {voter.transactionId}</div>
                <div>Date: {voter.timestamp?.toDate().toLocaleString() || 'Unknown'}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No votes yet for this participant.</p>
        )}
      </div>
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

export default VotesModal;