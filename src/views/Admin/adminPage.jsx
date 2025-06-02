import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { useAuthAdmin } from "../../hooks/useAuthAdmin";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useParticipantForm } from "../../hooks/useParticipantForm";
import "../../assets/css/responsive.css";
import "../../assets/css/style.css";
import { addParticipant, updateParticipant, deleteParticipant } from "../../utils/firestoreUtils";
import { uploadImage } from "../../utils/cloudinary";
import ProductManager from "./productManager";

function AdminPage() {
  const navigate = useNavigate();
  const { loading } = useAuthAdmin();
  const { data: participants, error: participantsError } = useFirestoreCollection(db, "participants");
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    setErrors,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
  } = useParticipantForm();
  const [editParticipant, setEditParticipant] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // State for image preview

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewImage) {
        URL.revokeObjectURL(previewImage); // Clean up previous preview
      }
      setPreviewImage(URL.createObjectURL(file)); // Set new preview
    } else {
      setPreviewImage(null); // Clear preview if no file
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const form = e.target;
      const photoFile = form.photo.files[0];
      let photoURL = "https://via.placeholder.com/800x600?text=No+Image";

      if (photoFile) {
        photoURL = await uploadImage(photoFile); // Upload to Cloudinary
      }

      await addParticipant(db, {
        fullName: formData.fullName,
        codeName: formData.codeName,
        email: formData.email,
        about: formData.about,
        photoURL,
        voters: [],
        createdAt: new Date(),
      });
      resetForm();
      form.reset();
      setPreviewImage(null); // Clear preview
      setSuccessMessage("Participant added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ ...errors, submission: `Failed to add participant: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditParticipant = (participant) => {
    const newFormData = {
      fullName: String(participant.fullName || ""),
      codeName: String(participant.codeName || ""),
      email: String(participant.email || ""),
      about: String(participant.about || ""),
      photoURL: String(participant.photoURL || ""),
    };
    console.log("Editing participant:", participant);
    console.log("Setting formData:", newFormData);
    setEditParticipant(participant);
    setFormData(newFormData);
    setPreviewImage(participant.photoURL || null); // Set initial preview
  };

  const handleUpdateParticipant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const form = e.target;
      const photoFile = form.photo.files[0];
      let photoURL = formData.photoURL || "https://via.placeholder.com/800x600?text=No+Image";

      if (photoFile) {
        photoURL = await uploadImage(photoFile); // Upload new image
      }

      const updatedData = {
        fullName: formData.fullName,
        codeName: formData.codeName,
        email: formData.email,
        about: formData.about,
        photoURL,
        updatedAt: new Date(),
      };

      console.log("Updating participant with docId:", editParticipant.docId, "data:", updatedData);
      await updateParticipant(db, editParticipant.docId, updatedData);
      setEditParticipant(null);
      resetForm();
      form.reset();
      setPreviewImage(null); // Clear preview
      setSuccessMessage("Participant updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ ...errors, submission: `Failed to update participant: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParticipantAction = async (docId) => {
    await deleteParticipant(db, docId, setErrors);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container pageant-form-container">
      <div className="section_title">
        <h2>Admin Dashboard - Manage Participants</h2>
      </div>

      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}

      {/* Add Participant Form */}
      <div className="mt-4">
        <h5>Add New Participant</h5>
        <form className="pageant-form" onSubmit={handleAddParticipant}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
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
          <div className="form-group">
            <label htmlFor="codeName">Code Name:</label>
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
          <div className="form-group">
            <label htmlFor="email">Email:</label>
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
          <div className="form-group">
            <label htmlFor="about">About the Contestant:</label>
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
          <div className="form-group">
            <label htmlFor="photo">Photo:</label>
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
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
            )}
            {errors.photo && <span className="error">{errors.photo}</span>}
          </div>
          <button
            type="submit"
            className="red_button pageant-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Participant"}
          </button>
        </form>
      </div>

      {/* Participants Table */}
      <div className="mt-4">
        <h5>Contestants</h5>
        {participants.length === 0 ? (
          <p>No contestants yet.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Code Name</th>
                <th>Email</th>
                <th>Photo</th>
                <th>Voters</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.docId}>
                  <td>{participant.fullName || "N/A"}</td>
                  <td>{participant.codeName || "N/A"}</td>
                  <td>{participant.email || "N/A"}</td>
                  <td>
                    {participant.photoURL ? (
                      <img
                        src={participant.photoURL}
                        alt={participant.fullName}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/50?text=No+Image";
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{participant.voters?.length || 0}</td>
                  <td>
                    <button
                      className="red_button pageant-submit-button me-2"
                      onClick={() => handleEditParticipant(participant)}
                      disabled={isSubmitting}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteParticipantAction(participant.docId)}
                      disabled={isSubmitting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Participant Form */}
      {editParticipant && (
        <div className="mt-4">
          <h5>Edit Participant</h5>
          <form className="pageant-form" onSubmit={handleUpdateParticipant}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
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
            <div className="form-group">
              <label htmlFor="codeName">Code Name:</label>
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
            <div className="form-group">
              <label htmlFor="email">Email:</label>
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
            <div className="form-group">
              <label htmlFor="about">About the Contestant:</label>
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
            <div className="form-group">
              <label htmlFor="photo">Update Photo:</label>
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
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                </div>
              )}
              {formData.photoURL && !previewImage && (
                <div className="mt-2">
                  <p>Current Photo:</p>
                  <img
                    src={formData.photoURL}
                    alt="Current"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100?text=No+Image";
                    }}
                  />
                </div>
              )}
              {errors.photo && <span className="error">{errors.photo}</span>}
            </div>
            <button
              type="submit"
              className="red_button pageant-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Participant"}
            </button>
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
          </form>
        </div>
      )}

      {(errors.submission || participantsError) && (
        <div className="alert alert-danger mt-3">
          {errors.submission || participantsError}
        </div>
      )}

      <ProductManager />
    </div>
  );
}

export default AdminPage;