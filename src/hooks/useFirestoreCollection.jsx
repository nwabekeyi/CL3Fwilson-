import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

export const useFirestoreCollection = (db, collectionName, filterFn = null) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Setting up ${collectionName} listener...`);
        const collRef = collection(db, collectionName);
        console.log("Collection reference:", collRef.path);

        // Initial fetch
        const snapshot = await getDocs(collRef);
        let initialData = snapshot.docs.map((doc) => ({
          docId: doc.id,
          fullName: String(doc.data().fullName || ""),
          codeName: String(doc.data().codeName || ""),
          email: String(doc.data().email || ""),
          about: String(doc.data().about || ""),
          voters: doc.data().voters || [],
          // Preserve other fields if needed
          ...doc.data(),
        }));
        if (filterFn) {
          initialData = initialData.filter(filterFn);
        }
        console.log(`Initial ${collectionName} fetch:`, initialData);
        setData(initialData);

        // Real-time listener
        return onSnapshot(
          collRef,
          (snapshot) => {
            console.log(`${collectionName} snapshot received at:`, new Date().toISOString());
            console.log(`Total documents fetched:`, snapshot.size);
            let updatedData = snapshot.docs.map((doc) => ({
              docId: doc.id,
              fullName: String(doc.data().fullName || ""),
              codeName: String(doc.data().codeName || ""),
              email: String(doc.data().email || ""),
              about: String(doc.data().about || ""),
              voters: doc.data().voters || [],
              // Preserve other fields if needed
              ...doc.data(),
            }));
            if (filterFn) {
              updatedData = updatedData.filter(filterFn);
            }
            console.log(`All ${collectionName}:`, updatedData);
            setData(updatedData);
          },
          (snapError) => {
            console.error(`Error in ${collectionName} onSnapshot:`, snapError);
            setError(`Failed to fetch ${collectionName}: ${snapError.message}`);
            // Fallback fetch
            getDocs(collRef)
              .then((fallbackSnapshot) => {
                let fallbackData = fallbackSnapshot.docs.map((doc) => ({
                  docId: doc.id,
                  fullName: String(doc.data().fullName || ""),
                  codeName: String(doc.data().codeName || ""),
                  email: String(doc.data().email || ""),
                  about: String(doc.data().about || ""),
                  voters: doc.data().voters || [],
                  ...doc.data(),
                }));
                if (filterFn) {
                  fallbackData = fallbackData.filter(filterFn);
                }
                console.log(`Fallback fetch ${collectionName}:`, fallbackData);
                setData(fallbackData);
              })
              .catch((fallbackError) => {
                console.error(`Fallback fetch failed:`, fallbackError);
                setError(`Failed to fetch ${collectionName}: ${fallbackError.message}`);
              });
          }
        );
      } catch (error) {
        console.error(`Error setting up ${collectionName} listener:`, error);
        setError(`Failed to fetch ${collectionName}: ${error.message}`);
      }
    };

    fetchData();
  }, [db, collectionName, filterFn]);

  return { data, error };
};