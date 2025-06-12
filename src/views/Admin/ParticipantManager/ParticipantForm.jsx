import React from 'react';

const ParticipantForm = ({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handleFileChange,
  previewImage,
  handleSubmit,
  isEditing,
  editParticipant,
  resetForm,
  setEditParticipant,
  setPreviewImage,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5>{isEditing ? 'Edit Participant' : 'Add New Participant'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="about" className="form-label">About</label>
            <textarea
              className={`form-control ${errors.about ? 'is-invalid' : ''}`}
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              required
            />
            {errors.about && <div className="invalid-feedback">{errors.about}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="photo" className="form-label">Photo</label>
            <input
              type="file"
              className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: '100px', marginTop: '10px' }}
              />
            )}
          </div>

          {isEditing && (
            <>
              <div className="mb-3">
                <label htmlFor="votesToAdd" className="form-label">Add Votes</label>
                <input
                  type="number"
                  className={`form-control ${errors.votesToAdd ? 'is-invalid' : ''}`}
                  id="votesToAdd"
                  name="votesToAdd"
                  value={formData.votesToAdd}
                  onChange={handleChange}
                  min="0"
                />
                {errors.votesToAdd && <div className="invalid-feedback">{errors.votesToAdd}</div>}
              </div>
              <p>Current Votes: {editParticipant?.voters?.length || 0}</p>
            </>
          )}

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Participant' : 'Add Participant')}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  setEditParticipant(null);
                  setPreviewImage(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;