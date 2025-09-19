import axios from 'axios';

const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (file) => {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary cloud name or upload preset not configured');
  }

  if (!file) {
    throw new Error('No file provided');
  }

  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
    throw new Error('Unsupported file type');
  }

  if (file.size > 10 * 1024 * 1024) {
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

    const originalUrl = response.data.secure_url;

    // Insert optimization parameters after '/upload'
    const optimizedUrl = originalUrl.replace('/upload/', '/upload/f_auto,q_auto/');

    return optimizedUrl;
  } catch (error) {
    throw new Error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
  }
};
