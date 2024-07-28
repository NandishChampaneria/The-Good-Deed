import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;