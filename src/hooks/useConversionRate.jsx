import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

const defaultConversionRates = {
  NGN: 1,
  USD: 0.00061,
  EUR: 0.00057,
};

const useConversionRate = () => {
  const [conversionRates, setConversionRates] = useState(defaultConversionRates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch from Firestore and set sessionStorage
  const fetchConversionRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const ratesDocRef = doc(db, "conversionRates", "rates");
      const ratesDoc = await getDoc(ratesDocRef);

      if (ratesDoc.exists()) {
        const rates = ratesDoc.data();
        setConversionRates(rates);
        sessionStorage.setItem("conversionRate", JSON.stringify(rates)); // Set sessionStorage after fetch
      } else {
        await setDoc(ratesDocRef, defaultConversionRates);
        setConversionRates(defaultConversionRates);
        sessionStorage.setItem("conversionRate", JSON.stringify(defaultConversionRates)); // Set sessionStorage after setting default
      }
    } catch (err) {
      setError("Failed to fetch conversion rates");
    } finally {
      setLoading(false);
    }
  };

  // Update Firestore, state, and sessionStorage
  const updateConversionRates = async (newRates) => {
    setLoading(true);
    setError(null);
    try {
      const ratesDocRef = doc(db, "conversionRates", "rates");
      const ratesDoc = await getDoc(ratesDocRef);
      if (!ratesDoc.exists()) {
        throw new Error("Conversion rates document not found");
      }

      const updatedRates = {
        NGN: 1,
        USD: parseFloat(newRates.USD) || defaultConversionRates.USD,
        EUR: parseFloat(newRates.EUR) || defaultConversionRates.EUR,
      };

      await setDoc(ratesDocRef, updatedRates);
      setConversionRates(updatedRates);
      sessionStorage.setItem("conversionRate", JSON.stringify(updatedRates)); // Set sessionStorage after update
      return updatedRates;
    } catch (err) {
      setError("Failed to update conversion rates");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // On mount, try to load from sessionStorage first
  useEffect(() => {
    const storedRates = sessionStorage.getItem("conversionRate");
    if (storedRates) {
      try {
        const parsedRates = JSON.parse(storedRates);
        setConversionRates(parsedRates);
      } catch {
        // Corrupted sessionStorage, fallback to fetch
        fetchConversionRates();
      }
    } else {
      fetchConversionRates();
    }
  }, []);

  return {
    conversionRates,
    loading,
    error,
    updateConversionRates,
    fetchConversionRates,
  };
};

export default useConversionRate;