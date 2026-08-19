import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    categoryViews: {
        type: Number,
        default: 0,
        min: 0
    },

    blogCount: {
        type: Number,
        default: 0,
        min: 0

    },

    description: {
        type: String,
        trim: true,
        default: ""
    }

}, {
    timestamps: true
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;