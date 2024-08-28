import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createEvent, deleteEvent, joinUnjoinEvent, getAllEvents, getJoinedEvents, getUserEvents, updateEvent, getEventById, getAllActiveEvents } from '../controllers/event.controller.js';

const router = express.Router();

router.get("/all", getAllEvents);
router.get("/all/active", getAllActiveEvents);
router.get("/:id", getEventById);
router.get("/joined/:id", getJoinedEvents);
router.get("/user/:username", getUserEvents);
router.post("/create", protectRoute, createEvent);
router.delete("/:id", protectRoute, deleteEvent);
router.post("/join/:id", protectRoute, joinUnjoinEvent);
router.post("/update/:id", protectRoute, updateEvent);


export default router;