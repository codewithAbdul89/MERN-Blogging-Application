import mongoose, { Schema } from "mongoose";

const bookmarkSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
        index: true
    }

}, {
    timestamps: true
});

bookmarkSchema.index(
    { user: 1, blog: 1 },
    { unique: true }
);

const Bookmark = mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
