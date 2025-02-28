import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: function() {
                return this.loginType !== "google"; // Only require password if userType is not "google"
            }, 
            validate: {
                // Custom validator to check minLength only if loginType is "normal"
                validator: function(value) {
                  if (this.loginType === 'normal' && value.length < 6) {
                    return false;
                  }
                  return true;
                },
                message: 'Password must be at least 6 characters long.'
            }
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        profileImg: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: ""
        },
        link: {
            type: String,
            default: ""
        },
        joinedEvents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event",
                default: []
            }
        ],
        userType: {
            type: String,
            enum: ['individual', 'organization'],
            required: true
        },
        loginType: {
            type: String,
            enum: ['normal', 'google'],
            required: true,
            default: 'normal'
        },
        contactPhone: {
            type: String,
            default: "",
            required: function() {
                return this.userType === 'organization';
            }
        },
        address: {
            type: String,
            default: "",
            required: function() {
                return this.userType === 'organization';
            }
        },
    }, 
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;