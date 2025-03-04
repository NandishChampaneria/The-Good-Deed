import User from "../models/user.model.js";

import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";

export const getUserProfile = async (req, res) => {
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password");
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({error: error.message});
        console.log("Error in getUserProfile", error.message);
    }
};

export const getOrganizations = async (req, res) => {
    try {
        // Fetch users with 'organization' userType
        const organizations = await User.find({ userType: 'organization' }).select("-password");

        if (!organizations || organizations.length === 0) {
            return res.status(404).json({ error: "No organizations found" });
        }

        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in getOrganizations", error.message);
    }
};

export const getSuggestedUsers = async (req, res) => {
    // in future
};

export const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link, contactPhone, address } = req.body;
    let { profileImg } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: "User not found" });

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current and new password" });
        }

        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({ error: "Incorrect current password" });
            if(newPassword.length < 6) {
                return res.status(400).json({ error: "New password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileImg) {
            if(user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.contactPhone = contactPhone || user.contactPhone;
        user.address = address || user.address;
        user.profileImg = profileImg || user.profileImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json(user);

    } catch(error) {
        console.log("error in update user ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};