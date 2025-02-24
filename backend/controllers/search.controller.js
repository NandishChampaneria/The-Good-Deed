import Event from "../models/event.model.js";

export const searchEvents = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Searching events by title or description
        const events = await Event.find({
                title: { $regex: query, $options: 'i' } ,
                active: true
        }).limit(10); // Limit results for performance
        
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search events' });
    }
};