import { useState } from "react";
import { uploadImage } from "../utils/cloudinary";

export const useProductForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    imagePath: "",
    department: "Men",
    category: "",
    description: "",
    variants: [
      { _id: `v${Date.now()}`, size: "", color: "", price: "", imagePath: "" },
    ],
    ...initialData,
  });
  const [photoFiles, setPhotoFiles] = useState({ main: null, variants: {} });
  const [photoPreviews, setPhotoPreviews] = useState({
    main: initialData.imagePath || null,
    variants: initialData.variants?.reduce(
      (acc, v) => ({ ...acc, [v._id]: v.imagePath }),
      {}
    ) || {},
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, variantId = null, field = null) => {
    const { name, value } = e.target;
    if (variantId && field) {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.map((v) =>
          v._id === variantId ? { ...v, [field]: value } : v
        ),
      }));
      setErrors((prev) => ({ ...prev, [`variant_${variantId}_${field}`]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhotoChange = (e, variantId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [variantId ? `variant_${variantId}_photo` : "photo"]: "Only JPG, PNG, or GIF allowed!",
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [variantId ? `variant_${variantId}_photo` : "photo"]: "Image must be smaller than 5MB!",
      }));
      return;
    }

    const previewURL = URL.createObjectURL(file);
    if (variantId) {
      setPhotoFiles((prev) => ({
        ...prev,
        variants: { ...prev.variants, [variantId]: file },
      }));
      setPhotoPreviews((prev) => ({
        ...prev,
        variants: { ...prev.variants, [variantId]: previewURL },
      }));
      setErrors((prev) => ({ ...prev, [`variant_${variantId}_photo`]: "" }));
    } else {
      setPhotoFiles((prev) => ({ ...prev, main: file }));
      setPhotoPreviews((prev) => ({ ...prev, main: previewURL }));
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { _id: `v${Date.now()}`, size: "", color: "", price: "", imagePath: "" },
      ],
    }));
  };

  const removeVariant = (variantId) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v._id !== variantId),
    }));
    setPhotoFiles((prev) => {
      const { [variantId]: _, ...rest } = prev.variants;
      return { ...prev, variants: rest };
    });
    setPhotoPreviews((prev) => {
      const { [variantId]: _, ...rest } = prev.variants;
      return { ...prev, variants: rest };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.imagePath && !photoFiles.main)
      newErrors.photo = "Main product image is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    formData.variants.forEach((v) => {
      if (!v.size.trim())
        newErrors[`variant_${v._id}_size`] = "Size is required";
      if (!v.color.trim())
        newErrors[`variant_${v._id}_color`] = "Color is required";
      if (!v.price || v.price <= 0)
        newErrors[`variant_${v._id}_price`] = "Valid price is required";
      if (!v.imagePath && !photoFiles.variants[v._id])
        newErrors[`variant_${v._id}_photo`] = "Variant image is required";
    });

    return newErrors;
  };

  const handlePhotoUploads = async () => {
    const uploads = {};
    if (photoFiles.main) {
      uploads.main = await uploadImage(photoFiles.main);
    } else {
      uploads.main = formData.imagePath;
    }

    const variantUploads = {};
    for (const variant of formData.variants) {
      if (photoFiles.variants[variant._id]) {
        variantUploads[variant._id] = await uploadImage(
          photoFiles.variants[variant._id]
        );
      } else {
        variantUploads[variant._id] = variant.imagePath;
      }
    }
    uploads.variants = variantUploads;

    return uploads;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      imagePath: "",
      department: "Men",
      category: "",
      description: "",
      variants: [
        { _id: `v${Date.now()}`, size: "", color: "", price: "", imagePath: "" },
      ],
    });
    setPhotoFiles({ main: null, variants: {} });
    setPhotoPreviews({ main: null, variants: {} });
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    formData,
    setFormData,
    photoFiles,
    photoPreviews,
    errors,
    isSubmitting,
    setIsSubmitting,
    setErrors,
    handleChange,
    handlePhotoChange,
    addVariant,
    removeVariant,
    validateForm,
    handlePhotoUploads,
    resetForm,
  };
};