const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfileImage } = require("../controllers/authController"); 
const { protect } = require("../middlewares/authMiddleware");
const { parser } = require("../config/cloudinary"); // Cloudinary config

const router = express.Router(); // <-- THIS WAS MISSING

// Auth Routes
router.post("/register", registerUser); 
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// Upload user profile image directly to Cloudinary
router.post("/upload-image", protect, parser.single("image"), async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = req.file.path;

        // Save this image URL to user profile
        const updatedUser = await updateUserProfileImage(req.user._id, imageUrl);

        res.status(200).json({ imageUrl, user: updatedUser });
    } catch (err) {
        console.error("Error uploading profile image:", err);
        res.status(500).json({ message: "Failed to upload image", error: err.message });
    }
});

module.exports = router;
