import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const addParticipant = async (db, contestant, photoURL) => {
  try {
    // Validate contestant.docId
    if (!contestant.docId) {
      console.error("No docId found in contestant:", contestant);
      throw new Error("Contestant document ID is missing");
    }

    const participantData = {
      ...contestant,
      uid: contestant.docId, // Use docId (e.g., P8fu070QZeE6cTwEvT9X) from pageantContestants
      photoURL: photoURL || "",
      voters: [],
      createdAt: serverTimestamp(),
      status: "active",
    };
    console.log("Adding participant to Firestore with data:", participantData);

    const participantsCollection = collection(db, "participants");
    const participantRef = await addDoc(participantsCollection, participantData);
    console.log("Participant added with ID:", participantRef.id);

    const contestantRef = doc(db, "pageantContestants", contestant.docId);
    console.log("Updating contestantRef:", contestantRef.path);
    await updateDoc(contestantRef, { status: "approved" });
    console.log("Contestant approved:", contestant.docId);

    return participantRef.id;
  } catch (error) {
    console.error("Error adding participant:", error);
    throw new Error(`Failed to add participant: ${error.message}`);
  }
};

export const updateParticipant = async (db, docId, formData, photoURL) => {
  try {
    const participantRef = doc(db, "participants", docId);
    await updateDoc(participantRef, {
      ...formData,
      photoURL,
      age: Number(formData.age),
      updatedAt: serverTimestamp(),
    });
    console.log("Participant updated:", docId);
  } catch (error) {
    console.error("Error updating participant:", error);
    throw new Error(`Failed to update participant: ${error.message}`);
  }
};

export const deleteParticipant = async (db, participantDocId, setErrors) => {
  try {
    console.log("Attempting to delete participant with ID (likely uid from pageantContestants):", participantDocId);

    // Query participants collection to find document where uid matches participantDocId
    const participantsCollection = collection(db, "participants");
    const q = query(participantsCollection, where("uid", "==", participantDocId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(
        "No participant document found in Firestore with uid:",
        participantDocId
      );
      setErrors((prev) => ({
        ...prev,
        submission: `No participant found with uid ${participantDocId}. It may have been deleted already.`,
      }));
      return; // Exit early if no participant is found
    }

    // Get the first matching participant document
    const participantDoc = querySnapshot.docs[0];
    const participantRef = doc(db, "participants", participantDoc.id);
    const participantData = participantDoc.data();
    console.log("Participant found in Firestore:", participantData, "Document ID:", participantDoc.id);

    // Delete participant from Firestore
    await deleteDoc(participantRef);
    console.log("Participant deleted from participants:", participantDoc.id);

    // Update corresponding contestant in pageantContestants
    const contestantRef = doc(db, "pageantContestants", participantData.uid);
    const contestantSnap = await getDoc(contestantRef);
    if (contestantSnap.exists()) {
      await updateDoc(contestantRef, { status: "pending" });
      console.log(
        "Contestant status updated to pending in pageantContestants:",
        participantData.uid
      );
    } else {
      console.warn(
        "Contestant document not found in pageantContestants:",
        participantData.uid
      );
      setErrors((prev) => ({
        ...prev,
        submission: `Contestant ${participantData.uid} not found in pageantContestants`,
      }));
      return;
    }

    // Scroll to pending contestants section
    const pendingSection = document.getElementById("pending-contestants");
    if (pendingSection) {
      pendingSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("Pending contestants section not found in DOM");
    }
  } catch (error) {
    console.error("Error deleting participant:", error);
    setErrors((prev) => ({
      ...prev,
      submission: `Failed to delete participant: ${error.message}`,
    }));
  }
};