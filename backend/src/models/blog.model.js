import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(

    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 150
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true
        },

        featuredImage: {
            url: {
                type: String,
                required: true
            },

            public_id: {
                type: String,
                required: true
            }
        },

        tags: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],

        status: {
            type: String,
            enum: [
                "DRAFT",
                "PUBLISHED",
                "REMOVED"
            ],
            default: "DRAFT",
            index: true
        },

        blogViews: {
            type: Number,
            default: 0,
            min: 0
        },

        likesCount: {
            type: Number,
            default: 0,
            min: 0
        },

        commentsCount: {
            type: Number,
            default: 0,
            min: 0
        },

        readTime: {
            type: Number,
            default: 1
        },

        publishedAt: {
            type: Date,
            default: null
        },

        isUpdated: {
            type: Boolean,
            default: false
        },

        isPinned: {
            type: Boolean,
            default: false
        },

        moderation: {

            reason: {
                type: String,
            },

            removedBy: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },

            removedAt: {
                type: Date,
            }
        }

    },

    {
        timestamps: true
    }

);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;