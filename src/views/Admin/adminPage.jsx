import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { useAuthAdmin } from "../../hooks/useAuthAdmin";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useParticipantForm } from "../../hooks/useParticipantForm";
import "../../assets/css/responsive.css";
import "../../assets/css/style.css";
import { addParticipant, updateParticipant, deleteParticipant } from "../../utils/firestoreUtils";
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
      await addParticipant(db, {
        fullName: formData.fullName,
        codeName: formData.codeName,
        email: formData.email,
        about: formData.about,
      });
      resetForm();
      setSuccessMessage("Participant added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ ...errors, submission: error.message });
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
    };
    console.log("Editing participant:", participant);
    console.log("Setting formData:", newFormData);
    setEditParticipant(participant);
    setFormData(newFormData);
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
      console.log("Updating participant with docId:", editParticipant.docId, "data:", formData);
      await updateParticipant(db, editParticipant.docId, formData);
      setEditParticipant(null);
      resetForm();
      setSuccessMessage("Participant updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ ...errors, submission: error.message });
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
          <p>No participants yet.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Code Name</th>
                <th>Email</th>
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