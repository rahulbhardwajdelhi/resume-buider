const express = require("express");
const {
    createResume,
    getUserResumes,
    getResumeById, updateResume,
    deleteResume,
} = require("../controllers/resumeController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadResumeImages } = require("../controllers/uploadImages");

const router = express. Router();

router.post("/", protect, createResume);
router.get("/", protect, getUserResumes); 
router.get("/:id", protect, getResumeById); 
router.put("/:id", protect, updateResume);
router.route("/:id/upload-images")
  .put(protect, uploadResumeImages)
  .post(protect, uploadResumeImages); // optional, if frontend uses POST

router.delete("/:id", protect, deleteResume);

module.exports = router;