import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/auth/google/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already exists in the database by email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            // If no user is found, create a new user with the details from Google profile
            user = new User({
                fullName: profile.displayName,
                username: profile.emails[0].value.split('@')[0],
                email: profile.emails[0].value,
                password: "",  // No password required for Google login
                profileImg: profile.photos[0].value,
                userType: "individual",  // Default user type, can be modified
                loginType: "google",  // Set loginType to google for Google OAuth users
            });
            await user.save();
        }

        return done(null, user);  // Return the user object
    } catch (error) {
        console.error("Error in Google OAuth:", error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);  // Serialize by user ID
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);  // Deserialize by user ID
    } catch (error) {
        done(error, null);
    }
});