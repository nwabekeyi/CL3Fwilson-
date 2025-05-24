import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { uploadImage } from "../../utils/cloudinary";

function AdminPage() {
  const [contestants, setContestants] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [editParticipant, setEditParticipant] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    stageName: "",
    email: "",
    gender: "",
    age: "",
    nationality: "",
    stateOfOrigin: "",
    location: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    bio: "",
    photoURL: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth State Changed:", user ? user.email : "No user logged in");
      if (user && user.email === "nwabekeyiprecious@gmail.com") {
        fetchContestants();
        fetchParticipants();
      } else {
        console.log("Unauthorized or no user, redirecting...");
        setContestants([]);
        setParticipants([]);
        navigate("/sign-in", { state: { from: "/admin" } });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchContestants = () => {
    try {
      console.log("Setting up contestants listener...");
      const contestantsCollection = collection(db, "pageantContestants");
      console.log("Collection reference:", contestantsCollection.path);
      return onSnapshot(contestantsCollection, (snapshot) => {
        console.log("Contestants snapshot received at:", new Date().toISOString());
        console.log("Total documents fetched:", snapshot.size);
        const contestantsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("All contestants:", contestantsList);
        const pendingContestants = contestantsList.filter(
          (c) => c.status?.toLowerCase() === "pending"
        );
        console.log("Pending contestants:", pendingContestants);
        setContestants(pendingContestants);
      }, (error) => {
        console.error("Error fetching contestants:", error);
        setErrors({ ...errors, fetch: `Failed to fetch contestants: ${error.message}` });
      });
    } catch (error) {
      console.error("Error setting up contestants listener:", error);
      setErrors({ ...errors, fetch: `Failed to fetch contestants: ${error.message}` });
    }
  };

  const fetchParticipants = () => {
    try {
      console.log("Setting up participants listener...");
      const participantsCollection = collection(db, "participants");
      console.log("Collection reference:", participantsCollection.path);

      // Initial fetch to ensure state is correct
      getDocs(participantsCollection).then((snapshot) => {
        const initialParticipants = snapshot.docs.map((doc) => ({
          docId: doc.id, // Use Firestore document ID
          ...doc.data(),
        }));
        console.log("Initial participants fetch:", initialParticipants);
        setParticipants(initialParticipants);
      }).catch((error) => {
        console.error("Initial participants fetch failed:", error);
        setErrors({ ...errors, fetch: `Failed to fetch participants initially: ${error.message}` });
      });

      // Real-time listener
      return onSnapshot(participantsCollection, (snapshot) => {
        console.log("Participants snapshot received at:", new Date().toISOString());
        console.log("Total participants fetched:", snapshot.size);
        const participantsList = snapshot.docs.map((doc) => ({
          docId: doc.id, // Use Firestore document ID
          ...doc.data(),
        }));
        console.log("All participants:", participantsList);
        setParticipants(participantsList);
      }, (error) => {
        console.error("Error in participants onSnapshot:", error);
        setErrors({ ...errors, fetch: `Failed to fetch participants: ${error.message}` });
        // Fallback fetch
        getDocs(participantsCollection).then((snapshot) => {
          const participantsList = snapshot.docs.map((doc) => ({
            docId: doc.id, // Use Firestore document ID
            ...doc.data(),
          }));
          console.log("Fallback fetch participants:", participantsList);
          setParticipants(participantsList);
        }).catch((fallbackError) => {
          console.error("Fallback fetch failed:", fallbackError);
          setErrors({ ...errors, fetch: `Failed to fetch participants: ${fallbackError.message}` });
        });
      });
    } catch (error) {
      console.error("Error setting up participants listener:", error);
      setErrors({ ...errors, fetch: `Failed to fetch participants: ${error.message}` });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, photo: "Only JPG, PNG, or GIF allowed!" });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, photo: "Image must be smaller than 5MB!" });
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setPhotoPreview(previewURL);
    setPhotoFile(file);
    setErrors({ ...errors, photo: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.age || formData.age < 18 || formData.age > 35)
      newErrors.age = "Age must be between 18 and 35";
    if (!formData.phone.match(/^\+?[1-9]\d{1,14}$/))
      newErrors.phone = "Valid phone number is required";
    if (!formData.bio.trim() || formData.bio.length < 50)
      newErrors.bio = "Bio must be at least 50 characters";
    return newErrors;
  };

  const handleAddParticipant = async (contestant) => {
    try {
      setIsSubmitting(true);
      let photoURL = contestant.photoURL;
      if (photoFile) {
        photoURL = await uploadImage(photoFile);
      }

      const participantData = {
        ...contestant,
        uid: contestant.id, // Store pageantContestants document ID
        photoURL,
        voters: [],
        createdAt: serverTimestamp(),
        status: "active",
      };

      console.log("Adding participant to Firestore with data:", participantData);
      const participantRef = await addDoc(collection(db, "participants"), participantData);
      console.log("Participant added with ID:", participantRef.id);

      const contestantRef = doc(db, "pageantContestants", contestant.id);
      await updateDoc(contestantRef, { status: "approved" });
      console.log("Contestant approved:", contestant.id);

      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error("Error adding participant:", error);
      setErrors({ ...errors, submission: `Failed to add participant: ${error.message}` });
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
    setPhotoPreview(participant.photoURL);
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
      let photoURL = formData.photoURL;
      if (photoFile) {
        photoURL = await uploadImage(photoFile);
      }

      const participantRef = doc(db, "participants", editParticipant.docId);
      await updateDoc(participantRef, {
        ...formData,
        photoURL,
        age: Number(formData.age),
        updatedAt: serverTimestamp(),
      });

      setEditParticipant(null);
      setFormData({
        fullName: "",
        stageName: "",
        email: "",
        gender: "",
        age: "",
        nationality: "",
        stateOfOrigin: "",
        location: "",
        phone: "",
        whatsapp: "",
        instagram: "",
        bio: "",
        photoURL: "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error("Error updating participant:", error);
      setErrors({ ...errors, submission: `Failed to update participant: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParticipant = async (participantDocId) => {
    try {
      console.log("Attempting to delete participant with docId:", participantDocId);
      console.log("Current participants state:", participants);

      // Check if participant exists in state
      const participantInState = participants.find((p) => p.docId === participantDocId);
      if (!participantInState) {
        console.error("Participant not found in state:", participantDocId);
        setErrors({ ...errors, submission: `Participant ${participantDocId} not found in local state` });
        return;
      }
      console.log("Participant found in state:", participantInState);

      // Try to fetch the participant document
      const participantRef = doc(db, "participants", participantDocId);
      const participantSnap = await getDoc(participantRef);

      if (participantSnap.exists()) {
        // Delete from participants
        await deleteDoc(participantRef);
        console.log("Participant deleted from participants:", participantDocId);
      } else {
        console.warn("Participant document not found in Firestore:", participantDocId);
        // Remove from state to prevent further errors
        setParticipants(participants.filter((p) => p.docId !== participantDocId));
      }

      // Update pageantContestants to pending using uid
      if (participantInState.uid) {
        const contestantRef = doc(db, "pageantContestants", participantInState.uid);
        const contestantSnap = await getDoc(contestantRef);
        if (contestantSnap.exists()) {
          await updateDoc(contestantRef, { status: "pending" });
          console.log("Contestant status updated to pending in pageantContestants:", participantInState.uid);
        } else {
          console.warn("Contestant document not found in pageantContestants:", participantInState.uid);
          setErrors({
            ...errors,
            submission: `Contestant ${participantInState.uid} not found in pageantContestants`,
          });
          return;
        }
      } else {
        console.warn("No uid found in participant state:", participantDocId);
        // Fallback: Try to find pageantContestants document by email
        const contestantsCollection = collection(db, "pageantContestants");
        const q = query(contestantsCollection, where("email", "==", participantInState.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const contestantDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, "pageantContestants", contestantDoc.id), { status: "pending" });
          console.log("Contestant status updated to pending via email match:", contestantDoc.id);
        } else {
          console.warn("No matching contestant found in pageantContestants for email:", participantInState.email);
          setErrors({
            ...errors,
            submission: `No contestant found in pageantContestants for participant ${participantDocId}`,
          });
          return;
        }
      }

      // Scroll to pending contestants table
      document.getElementById("pending-contestants").scrollIntoView({ behavior: "smooth" });

    } catch (error) {
      console.error("Error deleting participant:", error);
      setErrors({ ...errors, submission: `Failed to delete participant: ${error.message}` });
    }
  };

  useEffect(() => {
    console.log("Contestants state updated:", contestants);
  }, [contestants]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container pageant-form-container my-5">
      <div className="section_title">
        <h2>Admin Dashboard - Manage Participants</h2>
        <button
          className="btn btn-secondary mb-3"
          onClick={() => getAuth().signOut().then(() => navigate("/fashion-cube/login"))}
        >
          Sign Out
        </button>
      </div>

      <div className="mt-4" id="pending-contestants">
        <h5>Pending Contestants</h5>
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
            <tbody>
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
                      onClick={() => handleDeleteParticipant(participant.docId)}
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
              {errors.fullName && (
                <span className="error">{errors.fullName}</span>
              )}
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
                setPhotoPreview(null);
                setPhotoFile(null);
                setFormData({
                  fullName: "",
                  stageName: "",
                  email: "",
                  gender: "",
                  age: "",
                  nationality: "",
                  stateOfOrigin: "",
                  location: "",
                  phone: "",
                  whatsapp: "",
                  instagram: "",
                  bio: "",
                  photoURL: "",
                });
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {errors.submission && (
        <div className="alert alert-danger mt-3">{errors.submission}</div>
      )}
      {errors.fetch && (
        <div className="alert alert-danger mt-3">{errors.fetch}</div>
      )}
    </div>
  );
}

export default AdminPage;