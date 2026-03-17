const Resume = require("../models/Resume");
const { cloudinary, parser } = require("../config/cloudinary");

// @desc Create a new resume
// @route POST /api/resumes
// @access Private
const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default template
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: 0,
        },
      ],
      interests: [""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
    });

    res.status(201).json(newResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

// @desc Get all resumes for logged-in user
// @route GET /api/resumes
// @access Private
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resumes", error: error.message });
  }
};

// @desc Get single resume by ID
// @route GET /api/resumes/:id
// @access Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resume", error: error.message });
  }
};

// @desc Update a resume
// @route PUT /api/resumes/:id
// @access Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }

    // Merge updates from req.body into existing resume
    Object.assign(resume, req.body);

    const savedResume = await resume.save();
    res.json(savedResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update resume", error: error.message });
  }
};

// @desc Delete a resume
// @route DELETE /api/resumes/:id
// @access Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }

    // Delete images from Cloudinary if they exist
    if (resume.thumbnailLink) {
      const publicId = getPublicIdFromUrl(resume.thumbnailLink);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    if (resume.profileInfo?.profilePreviewUrl) {
      const publicId = getPublicIdFromUrl(resume.profileInfo.profilePreviewUrl);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete resume", error: error.message });
  }
};

// Helper to extract Cloudinary public_id from full URL
function getPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1]; // filename with extension
    const [filename] = lastPart.split("."); // remove extension
    // You must include folder name if used in upload params, e.g., 'my_app_uploads/filename'
    const folderIndex = parts.findIndex((p) => p === "my_app_uploads");
    if (folderIndex === -1) return filename; // fallback
    const publicId = parts.slice(folderIndex).join("/").replace(/\.\w+$/, "");
    return publicId;
  } catch (err) {
    return null;
  }
}

module.exports = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
};
