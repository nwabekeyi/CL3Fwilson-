import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export const addParticipant = async (db, data) => {
  try {
    const participantData = {
      fullName: data.fullName || "",
      codeName: data.codeName || "",
      email: data.email || "",
      about: data.about || "",
      voters: [],
      createdAt: serverTimestamp(),
    };
    console.log("Adding participant to Firestore with data:", participantData);

    const participantsCollection = collection(db, "participants");
    const participantRef = await addDoc(participantsCollection, participantData);
    console.log("Participant added with ID:", participantRef.id);

    return participantRef.id;
  } catch (error) {
    console.error("Error adding participant:", error);
    throw new Error(`Failed to add participant: ${error.message}`);
  }
};

export const updateParticipant = async (db, docId, formData) => {
  try {
    const participantRef = doc(db, "participants", docId);
    await updateDoc(participantRef, {
      fullName: formData.fullName || "",
      codeName: formData.codeName || "",
      email: formData.email || "",
      about: formData.about || "",
      updatedAt: serverTimestamp(),
    });
    console.log("Participant updated:", docId);
  } catch (error) {
    console.error("Error updating participant:", error);
    throw new Error(`Failed to update participant: ${error.message}`);
  }
};

export const deleteParticipant = async (db, docId, setErrors) => {
  try {
    console.log("Attempting to delete participant with docId:", docId);

    const participantRef = doc(db, "participants", docId);
    await deleteDoc(participantRef);
    console.log("Participant deleted from participants:", docId);
  } catch (error) {
    console.error("Error deleting participant:", error);
    setErrors((prev) => ({
      ...prev,
      submission: `Failed to delete participant: ${error.message}`,
    }));
  }
};