import { useState } from "react";

export const useParticipantForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    codeName: "",
    email: "",
    about: "",
    photoURL: "",
    votesToAdd: "0",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.codeName.trim()) newErrors.codeName = "Code name is required";
    if (!formData.email || !formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.about || formData.about.length < 50) {
      newErrors.about = "About must be at least 50 characters";
    }
    const votesToAdd = parseInt(formData.votesToAdd);
    if (isNaN(votesToAdd) || votesToAdd < 0) {
      newErrors.votesToAdd = "Votes must be a non-negative number";
    }
    return newErrors;
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      codeName: "",
      email: "",
      about: "",
      photoURL: "",
      votesToAdd: "0",
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