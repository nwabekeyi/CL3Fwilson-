import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/config";
import { useAuthAdmin } from "../../hooks/useAuthAdmin";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useParticipantForm } from "../../hooks/useParticipantForm";
import { addParticipant, updateParticipant, deleteParticipant } from "../../utils/firestoreUtils";
import { uploadImage } from "../../utils/cloudinary";
import ProductManager from "./productManager";
import { FiMenu, FiX, FiHome, FiUsers, FiBox, FiLogOut } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/responsive.css";
import "../../assets/css/style.css";

// Custom CSS
const dashboardStyles = `
  .menu-bar {
    background-color: #2c3e50;
    color: #fff;
    height: 60px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .menu-bar .toggle-button {
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
  }
  .menu-bar .toggle-button:hover {
    color: #3498db;
  }
  .menu-bar .brand {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .sidebar {
    background-color: #2c3e50;
    color: #fff;
    width: 250px;
    min-height: calc(100vh - 60px);
    position: fixed;
    top: 60px;
    left: 0;
    z-index: 1000;
    transition: transform 0.3s ease;
    display: block !important;
  }
  .sidebar.hidden {
    transform: translateX(-250px);
  }
  .sidebar.active {
    transform: translateX(0);
  }
  .sidebar .nav-link {
    color: #dfe6e9;
    padding: 12px 20px;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    transition: background-color 0.2s;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }
  .sidebar .nav-link:hover,
  .sidebar .nav-link.active {
    background-color: #3498db;
    color: #fff;
  }
  .sidebar .nav-link svg {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
  .main-content {
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;
    margin-top: 60px;
    transition: margin-left 0.3s ease;
    width: 100%;
  }
  .card {
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .card-header {
    background-color: #fff;
    border-bottom: 1px solid #e9ecef;
    font-weight: 600;
    color: #495057;
  }
  .table th {
    background-color: #e9ecef;
    color: #495057;
  }
  .btn-primary {
    background-color: #3498db;
    border-color: #3498db;
  }
  .btn-primary:hover {
    background-color: #2980b9;
    border-color: #2980b9;
  }
  .error {
    color: #dc3545;
    font-size: 0.875rem;
    display: block;
    margin-top: 5px;
  }
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-250px);
    }
    .sidebar.active {
      transform: translateX(0);
    }
    .main-content {
      margin-left: 0 !important;
    }
  }
`;

// ParticipantManager Component (unchanged)
function ParticipantManager({ participants, participantsError, successMessage, setSuccessMessage }) {
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
  const [previewImage, setPreviewImage] = useState(null);

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
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
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
        photoURL = await uploadImage(photoFile);
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
      setPreviewImage(null);
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
      votesToAdd: "0",
    };
    setEditParticipant(participant);
    setFormData(newFormData);
    setPreviewImage(participant.photoURL || null);
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
        photoURL = await uploadImage(photoFile);
      }

      const votesToAdd = parseInt(formData.votesToAdd) || 0;
      const newVoters = votesToAdd > 0
        ? Array.from({ length: votesToAdd }, () => `vote_${Date.now()}_${Math.random().toString(36).substring(7)}`)
        : [];

      const updatedData = {
        fullName: formData.fullName,
        codeName: formData.codeName,
        email: formData.email,
        about: formData.about,
        photoURL,
        voters: [...(editParticipant.voters || []), ...newVoters],
        updatedAt: new Date(),
      };

      await updateParticipant(db, editParticipant.docId, updatedData);
      setEditParticipant(null);
      resetForm();
      form.reset();
      setPreviewImage(null);
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

  return (
    <>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {participantsError && <div className="alert alert-danger">{participantsError}</div>}
      {errors.submission && <div className="alert alert-danger">{errors.submission}</div>}

      <div className="card mb-4">
        <div className="card-header">
          <h5>Add New Participant</h5>
        </div>
        <div className="card-body">
          <form className="pageant-form" onSubmit={handleAddParticipant}>
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
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Photo:</label>
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
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Participant"}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Contestants</h5>
        </div>
        <div className="card-body">
          {participants.length === 0 ? (
            <p>No contestants yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
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
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEditParticipant(participant)}
                          disabled={isSubmitting}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
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
            </div>
          )}
        </div>
      </div>

      {editParticipant && (
        <div className="card mt-4">
          <div className="card-header">
            <h5>Edit Participant</h5>
          </div>
          <div className="card-body">
            <form className="pageant-form" onSubmit={handleUpdateParticipant}>
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
                <p>Current Votes: {editParticipant.voters?.length || 0}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="photo" className="form-label">Update Photo:</label>
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
                className="btn btn-primary"
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
        </div>
      )}
    </>
  );
}

// Overview Component (unchanged)
function Overview({ participants }) {
  const totalParticipants = participants.length;
  const totalVotes = participants.reduce((sum, p) => sum + (p.voters?.length || 0), 0);

  return (
    <div className="row mb-4">
      <div className="col-md-6 mb-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Participants</h5>
            <p className="card-text fs-4">{totalParticipants}</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Votes</h5>
            <p className="card-text fs-4">{totalVotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// AdminPage Component
function AdminPage() {
  const navigate = useNavigate();
  const { loading, user } = useAuthAdmin();
  const { data: participants, error: participantsError } = useFirestoreCollection(db, "participants");
  const [selectedComponent, setSelectedComponent] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("Sidebar toggled, new state:", !sidebarOpen);
  };

  const handleNavigation = (component) => {
    setSelectedComponent(component);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
    console.log("Navigated to component:", component);
  };

  useEffect(() => {
    console.log("AdminPage auth state:", { loading, user: user ? user.email : null });
  }, [loading, user]);

  if (loading || !user) {
    return (
      <>
        <style>{dashboardStyles}</style>
        <div className="menu-bar">
          <button
            className="toggle-button"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <span className="brand">Admin Dashboard</span>
        </div>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  const componentMap = {
    overview: <Overview participants={participants} />,
    participants: (
      <ParticipantManager
        participants={participants}
        participantsError={participantsError}
        successMessage={successMessage} // Fixed: Use successMessage state
        setSuccessMessage={setSuccessMessage} // Correct prop
      />
    ),
    products: (
      <div className="card">
        <div className="card-header">
          <h5>Product Management</h5>
        </div>
        <div className="card-body">
          <ProductManager />
        </div>
      </div>
    ),
  };

  return (
    <>
      <style>{dashboardStyles}</style>
      {/* Menu Bar */}
      <div className="menu-bar">
        <button
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        <span className="brand">Admin Dashboard</span>
      </div>
      {/* Main Layout */}
      <div className="d-flex">
        {/* Sidebar */}
        <div>
          <div className={`sidebar ${sidebarOpen ? "active" : "hidden"}`}>
            <ul className="nav flex-column mt-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${selectedComponent === "overview" ? "active" : ""}`}
                  onClick={() => handleNavigation("overview")}
                >
                  <FiHome /> Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${selectedComponent === "participants" ? "active" : ""}`}
                  onClick={() => handleNavigation("participants")}
                >
                  <FiUsers /> Participants
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${selectedComponent === "products" ? "active" : ""}`}
                  onClick={() => handleNavigation("products")}
                >
                  <FiBox /> Products
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => {
                    const auth = getAuth();
                    auth.signOut();
                    navigate("/admin/login");
                    console.log("Logout clicked");
                  }}
                >
                  <FiLogOut /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Main Content */}
        <div className="main-content" style={{ marginLeft: sidebarOpen && window.innerWidth > 768 ? "250px" : "0" }}>
          {componentMap[selectedComponent] || (
            <div className="alert alert-info">Select a section from the sidebar"</div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminPage;