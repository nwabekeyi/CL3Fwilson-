import {
    collection,
    addDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    where,
    getDocs,
  } from "firebase/firestore";
  
  export const addParticipant = async (db, contestant, photoURL) => {
    try {
      const participantData = {
        ...contestant,
        uid: contestant.id,
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
  
  export const deleteParticipant = async (db, participantDocId, participants, setErrors, setParticipants) => {
    try {
      console.log("Attempting to delete participant with docId:", participantDocId);
      console.log("Current participants state:", participants);
  
      const participantInState = participants.find((p) => p.docId === participantDocId);
      if (!participantInState) {
        console.error("Participant not found in state:", participantDocId);
        setErrors((prev) => ({
          ...prev,
          submission: `Participant ${participantDocId} not found in local state`,
        }));
        return;
      }
      console.log("Participant found in state:", participantInState);
  
      const participantRef = doc(db, "participants", participantDocId);
      const participantSnap = await getDoc(participantRef);
  
      if (participantSnap.exists()) {
        await deleteDoc(participantRef);
        console.log("Participant deleted from participants:", participantDocId);
      } else {
        console.warn("Participant document not found in Firestore:", participantDocId);
        setParticipants(participants.filter((p) => p.docId !== participantDocId));
      }
  
      if (participantInState.uid) {
        const contestantRef = doc(db, "pageantContestants", participantInState.uid);
        const contestantSnap = await getDoc(contestantRef);
        if (contestantSnap.exists()) {
          await updateDoc(contestantRef, { status: "pending" });
          console.log("Contestant status updated to pending in pageantContestants:", participantInState.uid);
        } else {
          console.warn("Contestant document not found in pageantContestants:", participantInState.uid);
          setErrors((prev) => ({
            ...prev,
            submission: `Contestant ${participantInState.uid} not found in pageantContestants`,
          }));
          return;
        }
      } else {
        console.warn("No uid found in participant state:", participantDocId);
        const contestantsCollection = collection(db, "pageantContestants");
        const q = query(contestantsCollection, where("email", "==", participantInState.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const contestantDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, "pageantContestants", contestantDoc.id), { status: "pending" });
          console.log("Contestant status updated to pending via email match:", contestantDoc.id);
        } else {
          console.warn("No matching contestant found in pageantContestants for email:", participantInState.email);
          setErrors((prev) => ({
            ...prev,
            submission: `No contestant found in pageantContestants for participant ${participantDocId}`,
          }));
          return;
        }
      }
  
      document.getElementById("pending-contestants").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error deleting participant:", error);
      setErrors((prev) => ({
        ...prev,
        submission: `Failed to delete participant: ${error.message}`,
      }));
    }
  };