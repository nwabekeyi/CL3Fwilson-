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
}) => (
  <div className="card mb-4">
    <div className="card-header">
      <h5>{isEditing ? 'Edit Participant' : 'Add New Participant'}</h5>
    </div>
    <div className="card-body">
      <form className="pageant-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name:</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>
        <div className="mb-3">
          <label htmlFor="codeName" className="form-label">Code Name:</label>
          <input
            type="text"
            name="codeName"
            className="form-control"
            value={formData.codeName}
            onChange={handleChange}
            placeholder="Enter code name"
          />
          {errors.codeName && <span className="error">{errors.codeName}</span>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="mb-3">
          <label htmlFor="about" className="form-label">About the Contestant:</label>
          <textarea
            name="about"
            className="form-control"
            rows="5"
            value={formData.about}
            onChange={handleChange}
            placeholder="Describe the contestant (min 50 characters)"
          />
          {errors.about && <span className="error">{errors.about}</span>}
        </div>
        {isEditing && (
          <div className="mb-3">
            <label htmlFor="votesToAdd" className="form-label">Add Votes:</label>
            <input
              type="number"
              name="votesToAdd"
              className="form-control"
              value={formData.votesToAdd}
              onChange={handleChange}
              placeholder="Enter number of votes to add"
              min="0"
            />
            {errors.votesToAdd && <span className="error">{errors.votesToAdd}</span>}
            <p>Current Votes: {editParticipant?.voters?.length || 0}</p>
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">{isEditing ? 'Update Photo' : 'Photo'}:</label>
          <input
            type="file"
            name="photo"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewImage && (
            <div className="mt-2">
              <p>Preview:</p>
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
          {isEditing && formData.photoURL && !previewImage && (
            <div className="mt-2">
              <p>Current Photo:</p>
              <img
                src={formData.photoURL}
                alt="Current"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                }}
              />
            </div>
          )}
          {errors.photo && <span className="error">{errors.photo}</span>}
        </div>
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
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditParticipant(null);
              resetForm();
              setPreviewImage(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  </div>
);

export default ParticipantForm;