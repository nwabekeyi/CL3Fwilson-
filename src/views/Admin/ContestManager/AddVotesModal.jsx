// src/components/ContestManager/AddVotesModal.jsx
import React from 'react';
import { FiX } from 'react-icons/fi';

const AddVotesModal = ({
  showAddVotesModal,
  voteFormData = { voteCount: '', voterName: '' },
  errors = {},
  isSubmitting = false,
  loading = false,
  handleVoteChange = () => {},
  handleVoteSubmit = () => {},
  handleResetVotes = () => {},
  setShowAddVotesModal = () => {},
}) => {
  console.log('AddVotesModal rendered:', { showAddVotesModal });

  return (
    <div
      className={`modal ${showAddVotesModal ? 'show' : ''}`}
      style={{ display: showAddVotesModal ? 'flex' : 'none' }}
      tabIndex="-1"
      aria-labelledby="addVotesModalLabel"
      aria-hidden={!showAddVotesModal}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addVotesModalLabel">
              Add Votes
            </h5>
            <button
              type="button"
              className="close-icon"
              onClick={() => {
                console.log('Close AddVotesModal clicked');
                setShowAddVotesModal(false);
              }}
              disabled={isSubmitting || loading}
              aria-label="Close modal"
            >
              <FiX />
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleVoteSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="voterName">Voter Name</label>
                <input
                  type="text"
                  className={errors.voterName ? 'error' : ''}
                  id="voterName"
                  name="voterName"
                  value={voteFormData.voterName}
                  onChange={handleVoteChange}
                  required
                  disabled={isSubmitting || loading}
                />
                {errors.voterName && <div className="error-feedback">{errors.voterName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="voteCount">Vote Count</label>
                <input
                  type="number"
                  className={errors.voteCount ? 'error' : ''}
                  id="voteCount"
                  name="voteCount"
                  value={voteFormData.voteCount}
                  onChange={handleVoteChange}
                  required
                  disabled={isSubmitting || loading}
                  min="1"
                />
                {errors.voteCount && <div className="error-feedback">{errors.voteCount}</div>}
              </div>
              {errors.submission && <div className="alert-error">{errors.submission}</div>}
              <div className="button-group">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? 'Saving...' : 'Add Votes'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetVotes}
                  disabled={isSubmitting || loading}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowAddVotesModal(false)}
                  disabled={isSubmitting || loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVotesModal;