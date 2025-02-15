import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // App password (not your regular password)
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "nandishladdu7@gmail.com", // Replace with your email
            subject: `New Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error sending message." });
        console.log(error);
    }
});

export default router;