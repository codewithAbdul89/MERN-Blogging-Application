import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(

    {
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
            index: true
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 1000
        },

        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },

        isEdited: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: [
                "VISIBLE",
                "HIDDEN"
            ],
            default: "VISIBLE"
        },

        isPinned: {
            type: Boolean,
            default: false
        },

        moderation: {
            reason: {
                type: String,
                required: function () {
                    return this.status === "HIDDEN"
                }
            },

            hiddenBy: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: function () {
                    return this.status === "HIDDEN"
                }
            },

            hiddenAt: {
                type: Date,
                required: function () {
                    return this.status === "HIDDEN"
                }
            },

            deleteAfter: {
                type: Date,
                required: function () {
                    return this.status === "HIDDEN"
                }
            }
        },

        replyCount: {
            type: Number,
            default: 0,
            min: 0
        }

    },

    {
        timestamps: true
    }

);

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment; 