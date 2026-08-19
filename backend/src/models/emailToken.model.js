import mongoose, { Schema } from "mongoose";
import { type } from "os";

const emailSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [
            "VERIFY_EMAIL",
            "RESET_PASSWORD",
            "DELETE_BLOG_OTP",
            "DELETE_ACCOUNT_OTP"
        ],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {
            expires: 0 // if 3 then it will wait extra 3 min
        }
    }
}, { timestamps: true })

const EmailToken =mongoose.models.EmailToken || mongoose.model("EmailToken", emailSchema)
export default EmailToken;