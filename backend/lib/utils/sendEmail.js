import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NEWSLETTER_EMAIL,
        pass: process.env.NEWSLETTER_PASS,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: process.env.NEWSLETTER_EMAIL,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}; 