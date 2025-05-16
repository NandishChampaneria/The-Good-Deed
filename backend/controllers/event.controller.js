import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import {v2 as cloudinary} from "cloudinary";
import { sendEmail } from "../lib/utils/sendEmail.js";

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

        // If the event creator is an organization, send emails to followers
        if (user.userType === "organization" && user.followers.length > 0) {
            // Get all followers' emails
            const followers = await User.find({ _id: { $in: user.followers } }).select("email fullName");
            
            // Create email content
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">New Event Alert! 🎉</h1>
                        <p style="color: #666; font-size: 16px;">${user.fullName} has created an exciting new event</p>
                    </div>

                    <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #2d3748; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${title}</h2>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="color: #4a5568; line-height: 1.6;">${description}</p>
                        </div>

                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                            <div style="margin-bottom: 10px;">
                                <span style="color: #4a5568; font-weight: bold;">📍 Location:</span>
                                <p style="color: #2d3748; margin: 5px 0;">${location}</p>
                            </div>
                            
                            <div style="margin-bottom: 10px;">
                                <span style="color: #4a5568; font-weight: bold;">📅 Start Date:</span>
                                <p style="color: #2d3748; margin: 5px 0;">${new Date(startDate).toLocaleString()}</p>
                            </div>
                            
                            <div style="margin-bottom: 10px;">
                                <span style="color: #4a5568; font-weight: bold;">⏰ End Date:</span>
                                <p style="color: #2d3748; margin: 5px 0;">${new Date(endDate).toLocaleString()}</p>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL}/event/${newEvent._id}" 
                               style="background-color: #4a5568; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                View Event Details
                            </a>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 20px; color: #718096; font-size: 14px;">
                        <p>You received this email because you follow ${user.fullName} on The Good Deed.</p>
                        <p style="margin-top: 10px;">© ${new Date().getFullYear()} The Good Deed. All rights reserved.</p>
                    </div>
                </div>
            `;

            // Send emails to all followers
            for (const follower of followers) {
                await sendEmail({
                    to: follower.email,
                    subject: `New Event from ${user.fullName}: ${title}`,
                    html: emailHtml
                });
            }
        }

        res.status(200).json(newEvent);
    } catch(error) {
        console.log("Error in createEvent controller ", error);
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

        // Store original values for comparison
        const originalEvent = { ...event.toObject() };

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

        // Get the organization user
        const organization = await User.findById(event.user);
        
        // If the event creator is an organization and has followers, send update emails
        if (organization?.userType === "organization" && organization.followers.length > 0) {
            // Get all followers' emails
            const followers = await User.find({ _id: { $in: organization.followers } }).select("email fullName");
            
            // Create email content for update
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Event Update Alert! 🔄</h1>
                        <p style="color: #666; font-size: 16px;">${organization.fullName} has updated an event you're following</p>
                    </div>

                    <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #2d3748; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${event.title}</h2>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="color: #4a5568; line-height: 1.6;">${event.description}</p>
                        </div>

                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                            <div style="margin-bottom: 10px;">
                                <span style="color: #4a5568; font-weight: bold;">📍 Location:</span>
                                <p style="color: #2d3748; margin: 5px 0;">${event.location}</p>
                            </div>
                            
                            <div style="margin-bottom: 10px;">
                                <span style="color: #4a5568; font-weight: bold;">📅 Start Date:</span>
                                <p style="color: #2d3748; margin: 5px 0;">${new Date(event.startDate).toLocaleString()}</p>
                            </div>
                            
                            <div style="margin-bottom: 10px;">
                                <span style="color: #4a5568; font-weight: bold;">⏰ End Date:</span>
                                <p style="color: #2d3748; margin: 5px 0;">${new Date(event.endDate).toLocaleString()}</p>
                            </div>
                        </div>

                        <div style="background-color: #fff8e1; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                            <h3 style="color: #856404; margin: 0 0 10px 0;">Changes Made:</h3>
                            <ul style="color: #666; margin: 0; padding-left: 20px;">
                                ${title !== originalEvent.title ? `<li>Title updated</li>` : ''}
                                ${description !== originalEvent.description ? `<li>Description updated</li>` : ''}
                                ${location !== originalEvent.location ? `<li>Location changed</li>` : ''}
                                ${startDate !== originalEvent.startDate ? `<li>Start date modified</li>` : ''}
                                ${endDate !== originalEvent.endDate ? `<li>End date modified</li>` : ''}
                                ${img !== originalEvent.img ? `<li>Event image updated</li>` : ''}
                            </ul>
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL}/event/${event._id}" 
                               style="background-color: #4a5568; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                View Updated Event
                            </a>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 20px; color: #718096; font-size: 14px;">
                        <p>You received this email because you follow ${organization.fullName} on The Good Deed.</p>
                        <p style="margin-top: 10px;">© ${new Date().getFullYear()} The Good Deed. All rights reserved.</p>
                    </div>
                </div>
            `;

            // Send emails to all followers
            for (const follower of followers) {
                await sendEmail({
                    to: follower.email,
                    subject: `Event Update from ${organization.fullName}: ${event.title}`,
                    html: emailHtml
                });
            }
        }

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