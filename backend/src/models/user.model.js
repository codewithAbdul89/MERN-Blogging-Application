import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    userName: {
        required: true,
        type: String,
        trim: true,
        minlength: 3
    },

    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true
    },

    password: {
        type: String,
        minlength: 6,
        maxlength: 12,
        required: function () {
            return this.authProviders.includes("local");
        }
    },

    authProviders: {
        type: [{
            type: String,
            enum: ["local", "google", "github"]
        }],
        default: ["local"]
    },

    profilePic: {
        url: {
            type: String,
            default: '/images/default.jpeg'
        },
        public_id: {
            type: String,
            default: null
        }
    },

    contact: {
        type: String,
        default: "",
        trim: true
    },

    address: {
        town: String,
        city: String,
        provience: String,
        country: String
    },

    gender: {
        type: String,
    },

    cnic: {
        type: String,
    },

    role: {
        type: String,
        enum: [
            "USER",
            "ADMIN"
        ],
        default: "USER"
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    }
)


userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;