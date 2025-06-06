import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const useAuthAdmin = (adminEmail = ["nwabekeyiprecious@gmail.com", "cl3fwilsonfashionafrica@gmail.com"]) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("Auth State Changed:", currentUser ? currentUser.email : "No user logged in");
      if (currentUser && adminEmail.includes(currentUser.email)) {
        console.log("Admin authenticated:", currentUser.email);
        setUser(currentUser);
        setLoading(false);
      } else {
        console.log("Unauthorized or no user, redirecting to /admin/login");
        setUser(null);
        setLoading(false);
        // Only redirect if not already on /admin/login to prevent loops
        if (window.location.pathname !== "/admin/login") {
          navigate("/admin/login", { state: { from: "/admin" } });
        }
      }
    }, (error) => {
      console.error("Auth state error:", error);
      setLoading(false);
      navigate("/admin/login", { state: { from: "/admin" } });
    });

    return () => unsubscribe();
  }, [navigate, adminEmail]);

  return { loading, user };
};