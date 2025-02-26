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
            required: true,
            minLength: 6
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