// /root/horizon-server/public/admin/src/hooks/useConversionRate.js
import { useState, useEffect } from "react";
import { db } from "../firebase/config"; // Adjust path to your Firebase config
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

// Initialize Firestore collection
const conversionRatesCollection = collection(db, "conversionRates");

// Default conversion rates (fallback)
const defaultConversionRates = {
  NGN: 1,
  USD: 0.00061, // 1 NGN ≈ 0.00061 USD
  EUR: 0.00057, // 1 NGN ≈ 0.00057 EUR
};

const useConversionRate = () => {
  const [conversionRates, setConversionRates] = useState(defaultConversionRates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the single conversion rates document
  const fetchConversionRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const ratesDocRef = doc(db, "conversionRates", "rates");
      const ratesDoc = await getDoc(ratesDocRef);

      if (ratesDoc.exists()) {
        const rates = ratesDoc.data();
        console.log("Conversion rates:", rates); // Log rates when fetched
        setConversionRates(rates);
      } else {
        // Initialize with default rates if no document exists
        await setDoc(ratesDocRef, defaultConversionRates);
        console.log("Initialized default conversion rates:", defaultConversionRates);
        setConversionRates(defaultConversionRates);
      }
    } catch (err) {
      setError("Failed to fetch conversion rates");
      console.error("Error fetching conversion rates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update the single conversion rates document
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
        NGN: 1, // NGN is always 1
        USD: parseFloat(newRates.USD) || defaultConversionRates.USD,
        EUR: parseFloat(newRates.EUR) || defaultConversionRates.EUR,
      };

      await setDoc(ratesDocRef, updatedRates);
      console.log("Updated conversion rates:", updatedRates);
      setConversionRates(updatedRates);
      return updatedRates;
    } catch (err) {
      setError("Failed to update conversion rates");
      console.error("Error updating conversion rates:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch rates on mount
  useEffect(() => {
    fetchConversionRates();
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