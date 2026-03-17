import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';

/**
 * Upload resume images (thumbnail + profile) to backend
 * @param {string} resumeId - ID of the resume
 * @param {File} thumbnailFile - thumbnail image file
 * @param {File} profileFile - profile image file
 */
const uploadResumeImages = async (resumeId, thumbnailFile, profileFile) => {
  const formData = new FormData();
  if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
  if (profileFile) formData.append('profileImg', profileFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.RESUME.UPLOAD_IMAGES.replace(':id', resumeId), // e.g., /api/resumes/:id/images
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return response.data; // { thumbnailLink, profilePreviewUrl }
  } catch (error) {
    console.error('Error uploading resume images:', error);
    throw error;
  }
};

export default uploadResumeImages;
