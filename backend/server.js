import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";
import cron from "node-cron";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import searchRoutes from "./routes/search.routes.js";

import passport from "passport";
import session from "express-session";
import "./middleware/googleAuth.js"

import connectMongoDB from "./db/connectMongoDB.js";

import Event from "./models/event.model.js";

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Schedule the job to run every day at midnight
cron.schedule('* * * * *', async () => {
    const now = new Date();
    await Event.updateMany(
        { endDate: { $lt: now }, active: true },
        { $set: { active: false } }
    );
    console.log("Updated event statuses");
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json({limit: "5mb"})); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data


app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/search", searchRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();

});