import { useState } from "react";
import { uploadImage } from "../utils/cloudinary";

export const useParticipantForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    stageName: "",
    email: "",
    gender: "",
    age: "",
    nationality: "",
    stateOfOrigin: "",
    location: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    bio: "",
    photoURL: "",
    ...initialData,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(initialData.photoURL || null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, photo: "Only JPG, PNG, or GIF allowed!" });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, photo: "Image must be smaller than 5MB!" });
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setPhotoPreview(previewURL);
    setPhotoFile(file);
    setErrors({ ...errors, photo: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.age || formData.age < 18 || formData.age > 35)
      newErrors.age = "Age must be between 18 and 35";
    if (!formData.phone.match(/^\+?[1-9]\d{1,14}$/))
      newErrors.phone = "Valid phone number is required";
    if (!formData.bio.trim() || formData.bio.length < 50)
      newErrors.bio = "Bio must be at least 50 characters";
    return newErrors;
  };

  const handlePhotoUpload = async (existingPhotoURL) => {
    if (photoFile) {
      return await uploadImage(photoFile);
    }
    return existingPhotoURL;
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      stageName: "",
      email: "",
      gender: "",
      age: "",
      nationality: "",
      stateOfOrigin: "",
      location: "",
      phone: "",
      whatsapp: "",
      instagram: "",
      bio: "",
      photoURL: "",
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    formData,
    setFormData,
    photoFile,
    photoPreview,
    errors,
    isSubmitting,
    setIsSubmitting,
    setErrors,
    handleChange,
    handlePhotoChange,
    validateForm,
    handlePhotoUpload,
    resetForm,
  };
};