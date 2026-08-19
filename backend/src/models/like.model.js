import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({

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

// One user can like a blog only once
likeSchema.index(
    { user: 1, blog: 1 },
    { unique: true }
);

const Like =mongoose.models.Like || mongoose.model("Like", likeSchema);

export default Like;
