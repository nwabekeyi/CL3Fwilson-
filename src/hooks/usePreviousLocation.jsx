import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const usePreviousLocation = () => {
  const location = useLocation();
  const prevLocationRef = useRef('home');

  useEffect(() => {
    prevLocationRef.current = location;
  }, [location]);
  return prevLocationRef.current;
};

export default usePreviousLocation;
