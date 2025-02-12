import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import {v2 as cloudinary} from "cloudinary";

export const createEvent = async (req, res) => {
    try {
        const { title, description, location, startDate, endDate } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: "User not found" });

        if(!title && !description && !location && !startDate && !endDate) {
            return res.status(400).json({ error: "Event must have all fields" });
        }

        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newEvent = new Event({
            user: userId,
            title,
            description,
            location,
            startDate,
            endDate,
            img
        })

        await newEvent.save();
        res.status(200).json(newEvent);
    } catch(error) {
        console.log("Error in createPost controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if(event.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized: You are not the owner of this event" });
        }

        if(event.img) {
            const imgId = event.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "event deleted successfully"})
    } catch(error) {
        console.log("error in delete post controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const joinUnjoinEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const {id: eventId} = req.params;

        const event = await Event.findById(eventId);
        if(!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const userJoinedEvent = event.attendees.includes(userId);

        if(userJoinedEvent) {
            await Event.updateOne({_id: eventId}, {$pull: {attendees: userId}});
            await User.updateOne({ _id: userId }, { $pull: {joinedEvents: eventId} });
            res.status(200).json({message: "Event unjoiined successfully"});
        } else {
            event.attendees.push(userId);
            await User.updateOne({ _id: userId }, { $push: {joinedEvents: eventId} });
            await event.save();

            const newNotification = new Notification({
                type: "join",
                from: userId,
                to: event.user,
                event: eventId,
                
            });

            await newNotification.save();
            res.status(200).json({message: "Event joined successfully"});
        }
    } catch(error) {
        console.log("error in joinUnjoinEvent ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "attendees",
            select: "-password"
        });
        if(events.length ===0) {
            return res.status(200).json([]);
        }

        res.status(200).json(events);
    } catch(error) {
        console.log("error in getallpsot controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllActiveEvents = async (req, res) => {
    try {
        const events = await Event.find({ active: true }).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "attendees",
            select: "-password"
        });
        if(events.length ===0) {
            return res.status(200).json([]);
        }

        res.status(200).json(events);
    } catch(error) {
        console.log("error in getallpsot controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getJoinedEvents = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const joinedEvents = await Event.find({_id: {$in: user.joinedEvents}}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "attendees",
            select: "-password"
        });

        res.status(200).json(joinedEvents);
    } catch(error) {
        console.log("error in getjoinedevents controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserEvents = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        };

        const events = await Event.find({user: user._id}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "attendees",
            select: "-password"
        });

        res.status(200).json(events);
    } catch(error) {
        console.log("error in getUserEvents controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, description, location, startDate, endDate, img } = req.body;
        let event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: You are not the owner of this event" });
        }

        if (img) {
            if (event.img) {
                const imgId = event.img.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(imgId);
            }
            if (typeof img !== 'string') {
                throw new Error("Invalid image format. Expected a base64 string.");
            }
            const uploadedResponse = await cloudinary.uploader.upload(img);
            event.img = uploadedResponse.secure_url;
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.location = location || event.location;
        event.startDate = startDate || event.startDate;
        event.endDate = endDate || event.endDate;

        const now = new Date();
        event.active = new Date(event.startDate) > now;

        await event.save();

        res.status(200).json(event);
    } catch (error) {
        console.log("Error in updateEvent controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "attendees",
            select: "-password"
        });
        if(!event) {
            return res.status(404).json({message: "Event not found"});
        }

        res.status(200).json(event);

    } catch(error) {
        console.log("error in getEventById controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};