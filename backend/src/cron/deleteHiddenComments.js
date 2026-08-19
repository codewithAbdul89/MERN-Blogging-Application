import cron from "node-cron";
import Comment from "../models/comment.model.js";

cron.schedule("0 * * * *", async () => {

    try {

        await Comment.deleteMany({
            status: "HIDDEN",
            "moderation.deleteAfter": {
                $lte: new Date()
            }
        });


    } catch (error) {

        console.log(error);

    }

});