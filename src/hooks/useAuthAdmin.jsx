import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const useAuthAdmin = (adminEmail = "nwabekeyiprecious@gmail.com") => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth State Changed:", user ? user.email : "No user logged in");
      if (user && user.email === adminEmail) {
        setLoading(false);
      } else {
        console.log("Unauthorized or no user, redirecting...");
        navigate("/sign-in", { state: { from: "/admin" } });
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate, adminEmail]);

  return { loading };
};