import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username email fullName profileImg"
        }).populate({
            path: "event",
            select: "title img"
        }).sort({ createdAt: -1 });

        await Notification.updateMany({to:userId}, {read: true});

        res.status(200).json(notifications);
    } catch (error) {
        consol.log("Error in get notifications function", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in delete notifications function", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};