import Comment from "../models/comment.model.js";

export const deleteCommentReplies = async (parentCommentId) => {

    const replies = await Comment.find({
        parentComment: parentCommentId
    });



    for (const reply of replies) {

        await deleteCommentReplies(reply._id);

    }


    await Comment.deleteMany({
        parentComment: parentCommentId
    });

};