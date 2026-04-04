const User = require("../models/User"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
   return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
    try{
        const { name, email, password, profileImageUrl } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });

    } catch (error){
        // Handle duplicate key error from MongoDB unique index
        if (error && error.code === 11000) {
            return res.status(400).json({ message: "User already exists" });
        }
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }       
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// NEW FUNCTION: Update user profile image
const updateUserProfileImage = async (userId, imageUrl) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImageUrl: imageUrl },
            { new: true } // return the updated document
        ).select("-password");
        return updatedUser;
    } catch (error) {
        throw new Error("Failed to update profile image: " + error.message);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfileImage, // <-- export it
};
