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
      if (currentUser && adminEmail.includes(currentUser.email)) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        // Only redirect if not already on /admin/login to prevent loops
        if (window.location.pathname !== "/admin/login") {
          navigate("/admin/login", { state: { from: "/admin" } });
        }
      }
    }, (error) => {
      setLoading(false);
      navigate("/admin/login", { state: { from: "/admin" } });
    });

    return () => unsubscribe();
  }, [navigate, adminEmail]);

  return { loading, user };
};