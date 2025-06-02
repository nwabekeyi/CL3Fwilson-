import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

export const addParticipant = async (db, data) => {
  try {
    const participantData = {
      fullName: String(data.fullName || ""),
      codeName: String(data.codeName || ""),
      email: String(data.email || ""),
      about: String(data.about || ""),
      photoURL: String(data.photoURL || "https://via.placeholder.com/800x600?text=No+Image"),
      voters: Array.isArray(data.voters) ? data.voters : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const participantsCollection = collection(db, "participants");
    const docRef = await addDoc(participantsCollection, participantData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding participant:", error);
    throw new Error(`Failed to add participant: ${error.message}`);
  }
};

export const updateParticipant = async (db, docId, formData) => {
  try {
    const participantRef = doc(db, "participants", docId);
    await updateDoc(participantRef, {
      fullName: String(formData.fullName || ""),
      codeName: String(formData.codeName || ""),
      email: String(formData.email || ""),
      about: String(formData.about || ""),
      photoURL: String(formData.photoURL || "https://via.placeholder.com/800x600?text=No+Image"),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating participant:", error);
    throw new Error(`Failed to update participant: ${error.message}`);
  }
};

export const deleteParticipant = async (db, docId, setErrors) => {
  try {
    const participantRef = doc(db, "participants", docId);
    await deleteDoc(participantRef);
  } catch (error) {
    console.error("Error deleting participant:", error);
    setErrors((prev) => ({
      ...prev,
      submission: `Failed to delete participant: ${error.message}`,
    }));
  }
};