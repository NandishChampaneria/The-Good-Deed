import express from "express";
import { getMe, googleAuth, googleCallback, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import passport from "passport";


const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Google OAuth Routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;