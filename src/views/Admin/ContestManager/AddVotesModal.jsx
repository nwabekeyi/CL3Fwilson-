// src/components/ContestManager/AddVotesModal.jsx
import React from 'react';

const AddVotesModal = ({
  showAddVotesModal,
  voteFormData = { voteCount: '' }, // Default to prevent undefined error
  errors = {},
  isSubmitting = false,
  loading = false,
  handleVoteChange = () => {},
  handleVoteSubmit = () => {},
  handleResetVotes = () => {},
  setShowAddVotesModal = () => {},
}) => {
  return (
    <div
      className={`modal fade ${showAddVotesModal ? 'show d-block' : ''}`}
      tabIndex="-1"
      aria-labelledby="addVotesModalLabel"
      aria-hidden={!showAddVotesModal}
      style={{ backgroundColor: showAddVotesModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addVotesModalLabel">
              Add Votes
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAddVotesModal(false)}
              disabled={isSubmitting || loading}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleVoteSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="voteCount" className="form-label">
                  Vote Count
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.voteCount ? 'is-invalid' : ''}`}
                  id="voteCount"
                  name="voteCount"
                  value={voteFormData.voteCount}
                  onChange={handleVoteChange}
                  required
                  disabled={isSubmitting || loading}
                  min="1"
                />
                {errors.voteCount && <div className="invalid-feedback">{errors.voteCount}</div>}
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
                  {isSubmitting || loading ? 'Saving...' : 'Add Votes'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetVotes}
                  disabled={isSubmitting || loading}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
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
