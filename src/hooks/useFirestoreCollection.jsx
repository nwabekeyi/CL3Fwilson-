import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

export const useFirestoreCollection = (db, collectionName, filterFn = null) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collRef = collection(db, collectionName);

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
        setData(initialData);

        // Real-time listener
        return onSnapshot(
          collRef,
          (snapshot) => {
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
            setData(updatedData);
          },
          (snapError) => {
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
                setData(fallbackData);
              })
              .catch((fallbackError) => {
                setError(`Failed to fetch ${collectionName}: ${fallbackError.message}`);
              });
          }
        );
      } catch (error) {
        setError(`Failed to fetch ${collectionName}: ${error.message}`);
      }
    };

    fetchData();
  }, [db, collectionName, filterFn]);

  return { data, error };
};