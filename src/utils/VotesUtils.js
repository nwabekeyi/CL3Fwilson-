import { collection, query, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

// Shuffle a string
export const shuffleString = (str) => {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const shuffled = arr.join("");
  return shuffled && shuffled !== str ? shuffled : `vote_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

// Generate a unique transaction ID
export const generateUniqueTransactionId = async (baseId, db) => {
  let newId = shuffleString(baseId);
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const docRef = doc(db, "votes", newId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return newId;
    }
    newId = shuffleString(baseId + `_${attempts}`);
    attempts++;
  }

  return `vote_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

// Get a random transaction ID
export const getRandomTransactionId = async (db) => {
  const votesQuery = query(collection(db, "votes"));
  const votesSnapshot = await getDocs(votesQuery);
  const allVotes = votesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (allVotes.length === 0) {
    return `vote_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  const randomVote = allVotes[Math.floor(Math.random() * allVotes.length)];
  return randomVote.id;
};