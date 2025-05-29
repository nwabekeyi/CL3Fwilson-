import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { useAuthAdmin } from "../../hooks/useAuthAdmin";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useParticipantForm } from "../../hooks/useParticipantForm";
import "../../assets/css/responsive.css"
import "../../assets/css/style.css"
import { addParticipant, updateParticipant, deleteParticipant } from "../../utils/firestoreUtils";
import ProductManager from "./productManager";

function AdminPage() {
  const navigate = useNavigate();
  const { loading } = useAuthAdmin();
  const { data: contestants, error: contestantsError } = useFirestoreCollection(
    db,
    "pageantContestants",
    (c) => c.status?.toLowerCase() === "pending"
  );
  const { data: participants, error: participantsError } = useFirestoreCollection(db, "participants");
  const {
    formData,
    photoFile,
    photoPreview,
    errors,
    isSubmitting,
    setIsSubmitting,
    setErrors,
    handleChange,
    handlePhotoChange,
    validateForm,
    handlePhotoUpload,
    resetForm,
    setFormData,
  } = useParticipantForm();
  const [editParticipant, setEditParticipant] = useState(null);

  const handleAddParticipant = async (contestant) => {
    setIsSubmitting(true);
    try {
      const photoURL = await handlePhotoUpload(contestant.photoURL);
      await addParticipant(db, contestant, photoURL);
      resetForm();
    } catch (error) {
      setErrors({ ...errors, submission: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditParticipant = (participant) => {
    setEditParticipant(participant);
    setFormData({
      fullName: participant.fullName,
      stageName: participant.stageName,
      email: participant.email,
      gender: participant.gender,
      age: participant.age,
      nationality: participant.nationality,
      stateOfOrigin: participant.stateOfOrigin,
      location: participant.location,
      phone: participant.phone,
      whatsapp: participant.whatsapp,
      instagram: participant.instagram,
      bio: participant.bio,
      photoURL: participant.photoURL,
    });
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
      const photoURL = await handlePhotoUpload(formData.photoURL);
      await updateParticipant(db, editParticipant.docId, formData, photoURL);
      setEditParticipant(null);
      resetForm();
    } catch (error) {
      setErrors({ ...errors, submission: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParticipantAction = async (participantUid) => {
    await deleteParticipant(db, participantUid, setErrors);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container pageant-form-container">
      <div className="section_title">
        <h2>Admin Dashboard - Manage Participants</h2>
        <div>
        <button
          className="btn btn-secondary mb-3"
          onClick={() => getAuth().signOut().then(() => navigate("/sign-up"))}
        >
          Sign Out
        </button>
        </div>
       
      </div>

      <div className="mt-4" id="pending-contestants">
        <h5>Pending Contestants:</h5>
        {contestants.length === 0 ? (
          <p>No pending contestants.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {contestants.map((contestant) => (
                <tr key={contestant.id}>
                  <td>{contestant.fullName}</td>
                  <td>{contestant.email}</td>
                  <td>
                    <button
                      className="red_button pageant-submit-button"
                      onClick={() => handleAddParticipant(contestant)}
                      disabled={isSubmitting}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4">
        <h5>Participants</h5>
        {participants.length === 0 ? (
          <p>No participants yet.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Voters</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.docId}>
                  <td>{participant.fullName}</td>
                  <td>{participant.email}</td>
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
                      onClick={() => handleDeleteParticipantAction(participant.uid)} // Changed to participant.uid
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
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="stageName">Stage Name:</label>
              <input
                type="text"
                name="stageName"
                className="form-control"
                value={formData.stageName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="35"
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="nationality">Nationality:</label>
              <input
                type="text"
                name="nationality"
                className="form-control"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="stateOfOrigin">State of Origin:</label>
              <input
                type="text"
                name="stateOfOrigin"
                className="form-control"
                value={formData.stateOfOrigin}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="whatsapp">WhatsApp:</label>
              <input
                type="tel"
                name="whatsapp"
                className="form-control"
                value={formData.whatsapp}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="instagram">Instagram:</label>
              <input
                type="text"
                name="instagram"
                className="form-control"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                name="bio"
                className="form-control"
                rows="5"
                value={formData.bio}
                onChange={handleChange}
              />
              {errors.bio && <span className="error">{errors.bio}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="photo">Photo:</label>
              <input
                type="file"
                name="photo"
                className="form-control"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {photoPreview && (
                <div className="mt-2">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    className="img-thumbnail"
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
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {(errors.submission || contestantsError || participantsError) && (
        <div className="alert alert-danger mt-3">
          {errors.submission || contestantsError || participantsError}
        </div>
      )}

      <ProductManager />
    </div>
  );
}

export default AdminPage;