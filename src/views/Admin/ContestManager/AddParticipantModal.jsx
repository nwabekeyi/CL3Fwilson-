// src/components/ContestManager/AddParticipantModal.jsx
import React from 'react';

const AddParticipantModal = ({
  showAddParticipantModal,
  participantFormData,
  errors,
  isSubmitting,
  loading,
  handleParticipantChange,
  handleParticipantSubmit,
  handleResetParticipant,
  setShowAddParticipantModal,
}) => {
  return (
    <div
      className={`modal fade ${showAddParticipantModal ? 'show d-block' : ''}`}
      tabIndex="-1"
      aria-labelledby="addParticipantModalLabel"
      aria-hidden={!showAddParticipantModal}
      style={{ backgroundColor: showAddParticipantModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addParticipantModalLabel">
              Add Participant
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAddParticipantModal(false)}
              disabled={isSubmitting || loading}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleParticipantSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                  id="fullName"
                  name="fullName"
                  value={participantFormData.fullName}
                  onChange={handleParticipantChange}
                  required
                  disabled={isSubmitting || loading}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={participantFormData.email}
                  onChange={handleParticipantChange}
                  required
                  disabled={isSubmitting || loading}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="about" className="form-label">
                  About
                </label>
                <textarea
                  className={`form-control ${errors.about ? 'is-invalid' : ''}`}
                  id="about"
                  name="about"
                  value={participantFormData.about}
                  onChange={handleParticipantChange}
                  required
                  disabled={isSubmitting || loading}
                />
                {errors.about && <div className="invalid-feedback">{errors.about}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="photo" className="form-label">
                  Photo (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleParticipantChange}
                  disabled={isSubmitting || loading}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
                  {isSubmitting || loading ? 'Saving...' : 'Add Participant'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetParticipant}
                  disabled={isSubmitting || loading}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowAddParticipantModal(false)}
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

export default AddParticipantModal;