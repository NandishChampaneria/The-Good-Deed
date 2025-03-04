import Event from "../models/event.model.js";
import User from "../models/user.model.js";

export const searchEventsAndOrganizations = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Perform both searches concurrently
        const [events, organizations] = await Promise.all([
            Event.find({
                title: { $regex: query, $options: "i" },
                active: true
            }).limit(10),

            User.find({
                userType: "organization",
                $or: [
                    { fullName: { $regex: query, $options: "i" } }, // Search in fullName
                    { username: { $regex: query, $options: "i" } }  // Search in username
                ]
            }).limit(10)
        ]);

        res.json({ events, organizations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to search events and organizations" });
    }
};