// src/hooks/useParticipantForm.js
import { useState } from 'react';

export const useParticipantForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    about: '',
    photo: null,
    votesToAdd: '0',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.about.trim()) {
      newErrors.about = 'About is required';
    } else if (formData.about.length < 50) {
      newErrors.about = 'About must be at least 50 characters';
    }
    if (formData.votesToAdd && isNaN(parseInt(formData.votesToAdd))) {
      newErrors.votesToAdd = 'Votes to add must be a valid number';
    }
    return newErrors;
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      about: '',
      photo: null,
      votesToAdd: '0',
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