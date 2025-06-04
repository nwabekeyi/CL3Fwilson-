import axios from 'axios';

const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (file) => {
  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary configuration missing');
    throw new Error('Cloudinary cloud name or upload preset not configured');
  }

  if (!file) {
    console.error('No file provided for upload');
    throw new Error('No file provided');
  }

  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
    console.error('Unsupported file type:', file.type);
    throw new Error('Unsupported file type');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    console.error('File too large:', file.size);
    throw new Error('File size exceeds 10MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
    throw new Error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
  }
};