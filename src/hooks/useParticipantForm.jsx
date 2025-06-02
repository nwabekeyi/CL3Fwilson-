import { useState } from "react";

export const useParticipantForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    codeName: "",
    email: "",
    about: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    // Coerce to string to avoid undefined errors
    const fullName = String(formData.fullName || "").trim();
    const email = String(formData.email || "").trim();
    const about = String(formData.about || "").trim();

    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!about || about.length < 50)
      newErrors.about = "About must be at least 50 characters";

    return newErrors;
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      codeName: "",
      email: "",
      about: "",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    setErrors,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
  };
};