// src/components/ContestManager/AddParticipantModal.jsx
import React from 'react';
import { FiX } from 'react-icons/fi';

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
  console.log('AddParticipantModal rendered:', { showAddParticipantModal });

  return (
    <div
      className={`modal ${showAddParticipantModal ? 'show' : ''}`}
      style={{ display: showAddParticipantModal ? 'flex' : 'none' }}
      tabIndex="-1"
      aria-labelledby="addParticipantModalLabel"
      aria-hidden={!showAddParticipantModal}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addParticipantModalLabel">
              Add Participant
            </h5>
            <button
              type="button"
              className="close-icon"
              onClick={() => {
                console.log('Close AddParticipantModal clicked');
                setShowAddParticipantModal(false);
              }}
              disabled={isSubmitting || loading}
              aria-label="Close modal"
            >
              <FiX />
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleParticipantSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  className={errors.fullName ? 'error' : ''}
                  id="fullName"
                  name="fullName"
                  value={participantFormData.fullName}
                  onChange={handleParticipantChange}
                  required
                  disabled={isSubmitting || loading}
                />
                {errors.fullName && <div className="error-feedback">{errors.fullName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className={errors.email ? 'error' : ''}
                  id="email"
                  name="email"
                  value={participantFormData.email}
                  onChange={handleParticipantChange}
                  required
                  disabled={isSubmitting || loading}
                />
                {errors.email && <div className="error-feedback">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="about">About</label>
                <textarea
                  className={errors.about ? 'error' : ''}
                  id="about"
                  name="about"
                  value={participantFormData.about}
                  onChange={handleParticipantChange}
                  required
                  disabled={isSubmitting || loading}
                />
                {errors.about && <div className="error-feedback">{errors.about}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="photo">Photo</label>
                <input
                  type="file"
                  className="file-input"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleParticipantChange}
                  disabled={isSubmitting || loading}
                />
                {errors.photo && <div className="error-feedback">{errors.photo}</div>}
              </div>
              {errors.submission && <div className="alert-error">{errors.submission}</div>}
              <div className="button-group">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? 'Saving...' : 'Add Participant'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetParticipant}
                  disabled={isSubmitting || loading}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn-outline"
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