import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { followUnfollowOrganization, getOrganizations, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/organizations", getOrganizations);
router.post("/follow/:fullName", protectRoute, followUnfollowOrganization);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.put("/update/:id", protectRoute, updateUser);

export default router;