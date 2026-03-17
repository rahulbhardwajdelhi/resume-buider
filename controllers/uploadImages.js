const Resume = require("../models/Resume");
const { cloudinary, parser } = require("../config/cloudinary");

// @desc Upload resume images (thumbnail + profileImg)
// @route POST /api/resumes/:id/images
// @access Private
const uploadResumeImages = async (req, res) => {
  try {
    // Use multer-storage-cloudinary to handle files
    parser.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'profileImg', maxCount: 1 }])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload failed", error: err.message });
      }

      const resumeId = req.params.id;
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

      if (!resume) {
        return res.status(404).json({ message: "Resume not found or unauthorized" });
      }

      const newThumbnail = req.files.thumbnail?.[0];
      const newProfileImage = req.files.profileImg?.[0];

      // Helper to delete old Cloudinary image
      const deleteOldImage = async (url) => {
        if (!url) return;
        const publicId = getPublicIdFromUrl(url);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      };

      // Delete old thumbnail if new uploaded
      if (newThumbnail) {
        await deleteOldImage(resume.thumbnailLink);
        resume.thumbnailLink = newThumbnail.path; // Cloudinary URL
      }

      // Delete old profile image if new uploaded
      if (newProfileImage) {
        await deleteOldImage(resume.profileInfo?.profilePreviewUrl);
        resume.profileInfo.profilePreviewUrl = newProfileImage.path;
      }

      await resume.save();

      res.status(200).json({
        message: "Images uploaded successfully",
        thumbnailLink: resume.thumbnailLink,
        profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
      });
    });

  } catch (err) {
    console.error("Error uploading images: ", err);
    res.status(500).json({ message: "Failed to upload images", error: err.message });
  }
};

// Helper to extract Cloudinary public_id from full URL
function getPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1]; // filename with extension
    const [filename] = lastPart.split("."); // remove extension
    const folderIndex = parts.findIndex((p) => p === "my_app_uploads");
    if (folderIndex === -1) return filename;
    return parts.slice(folderIndex).join("/").replace(/\.\w+$/, "");
  } catch (err) {
    return null;
  }
}

module.exports = { uploadResumeImages };
