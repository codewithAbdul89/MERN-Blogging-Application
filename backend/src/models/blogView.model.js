import mongoose, { Schema } from "mongoose";

const viewSchema = new Schema({

    user: {

        type: Schema.Types.ObjectId,
        ref: "User",
        required: true

    },

    blog: {

        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true

    },

    viewedAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})

viewSchema.index(
    { blog: 1, user: 1 },
    { unique: true }
)

const View = mongoose.models.Views || mongoose.model("View", viewSchema)

export default View;