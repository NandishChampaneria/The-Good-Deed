import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import passport from "passport";


export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password, userType, contactPhone, address } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if(existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        if(password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        if(!userType || !['individual', 'organization'].includes(userType)) {
            return res.status(400).json({ error: "Invalid user type" });
        }

        if(userType === 'organization') {
            if(!contactPhone || !address) {
                return res.status(400).json({ error: "Organizations must provide contact phone and address" });
            }
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            userType,
            loginType: 'normal',
            contactPhone: userType === 'organization' ? contactPhone: '',
            address: userType === 'organization' ? address: '',
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                createdEvents: newUser.createdEvents,
                profileImg: newUser.profileImg,
                userType: newUser.userType,
                contactPhone: newUser.contactPhone,
                address: newUser.address,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch(error) {
        console.log("error", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        };

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            createdEvents: user.createdEvents,
            profileImg: user.profileImg,
            userType: user.userType,
            contactPhone: user.contactPhone,
            address: user.address,
        });

    } catch(error) {
        console.log("error", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    } catch(error) {
        console.log("error", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch(error) {
        console.log("error in getme", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Google OAuth Controller
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleCallback = (req, res) => {
    passport.authenticate('google', { failureRedirect: '/login' }, (err, user, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (!user) {
            return res.status(400).json({ error: "Google authentication failed" });
        }

        // If user is authenticated, generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        // Send response after successful login
        return res.redirect('http://localhost:3000/')
    })(req, res);  // Pass `req` and `res` to the next middleware
};