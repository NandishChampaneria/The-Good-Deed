import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getOrganizations, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/organizations", getOrganizations);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/update", protectRoute, updateUser);

export default router;