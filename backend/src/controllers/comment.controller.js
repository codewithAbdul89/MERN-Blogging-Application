import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Blog from "../models/blog.model.js";
import { deleteCommentReplies } from "../services/comment.service.js";

export const createComment = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    const { content, parentComment = null } = req.body;

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found."
        )
    }

    //To increase the count of the replies

    if (parentComment) {

        const parent = await Comment.findById(parentComment);

        if (!parent) {
            throw new ApiError(
                404,
                "Parent comment not found."
            );
        }

        parent.replyCount += 1;
        await parent.save();

    }

    const comment = await Comment.create({
        blog: blogId,
        author: req.user._id,
        content,
        parentComment
    })


    return res.status(201).json(new ApiResponse(
        201,
        "Comment created successfully.",
        {
            comment
        }
    ));

})

export const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    const { content } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {

        throw new ApiError(
            404,
            "Comment does not exist."
        )

    }

    if (!comment.author.equals(req.user._id)) {

        throw new ApiError(
            403,
            "Forbidden , You cannot update this comment."
        )

    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId,
        {
            $set: {
                content,
                isEdited: true
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(new ApiResponse(
        200,
        "Comment updated successfully.",
        {
            comment: updatedComment
        }
    )
    );

});


export const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found."
        )
    }

    if (!comment.author.equals(req.user._id) && req.user.role !== "ADMIN") {
        throw new ApiError(
            403,
            "Forbidden , You cannot update this comment."
        )
    }

    // If this comment is itself a reply,decrease the parent's reply count.
    if (comment.parentComment) {

        await Comment.findByIdAndUpdate(
            comment.parentComment,
            {
                $inc: {
                    replyCount: -1
                }
            }
        );

    }

    await deleteCommentReplies(commentId);

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Comment deleted successfully!"
        )
    )


});


export const getComments = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog does not exist."
        );
    }

    const isAdmin = req.user.role === "ADMIN";

    const isBlogAuthor = blog.author.toString() === req.user._id.toString();

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let parentCommentFilter = {
        blog: blogId,
        parentComment: null
    };

    if (!(isAdmin || isBlogAuthor)) {

        parentCommentFilter.$or = [
            {
                status: "VISIBLE"
            },
            {
                status: "HIDDEN",
                author: req.user._id
            }
        ];

    }

    const parentComments = await Comment.find(parentCommentFilter)
        .populate("author", "userName profilePic.url")
        .sort({
            status: 1,
            isPinned: -1,
            createdAt: -1
        })
        .skip(skip)
        .limit(limit)
        .lean();


    const totalParentComments = await Comment.countDocuments(parentCommentFilter);

    const hasMore = skip + parentComments.length < totalParentComments;

    return res.status(200).json(
        new ApiResponse(
            200,
            "Comments fetched successfully!",
            {
                comments: parentComments,
                page,
                hasMore,
                totalComments: totalParentComments
            }
        )
    );

});


export const getReplies = asyncHandler(async (req, res) => {

    const { parentCommentId } = req.params;

    const parentComment = await Comment.findById(parentCommentId);

    if (!parentComment) {
        throw new ApiError(
            404,
            "Parent comment not found."
        );
    }

    const blog = await Blog.findById(parentComment.blog);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog does not found."
        );
    }

    const isAdmin = req.user.role === "ADMIN";

    const isBlogAuthor =
        blog.author.toString() === req.user._id.toString();

    const page = Number(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    let replyFilter = {
        parentComment: parentCommentId
    };

    if (!(isAdmin || isBlogAuthor)) {

        replyFilter.$or = [
            {
                status: "VISIBLE"
            },
            {
                status: "HIDDEN",
                author: req.user._id
            }
        ];

    }

    const replies = await Comment.find(replyFilter)
        .populate("author", "userName profilePic")
        .sort({
            status: 1,
            createdAt: -1
        })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalReplies = await Comment.countDocuments(replyFilter);

    const hasMore = skip + replies.length < totalReplies;

    return res.status(200).json(
        new ApiResponse(
            200,
            "Replies fetched successfully.",
            {
                replies,
                page,
                hasMore,
                totalReplies
            }
        )
    );

});


export const pinComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found.");
    }

    if (comment.status !== "VISIBLE") {
        throw new ApiError(
            400,
            "Only visible comments can be pinned."
        );
    }

    const blog = await Blog.findById(comment.blog);

    if (
        !blog.author.equals(req.user._id) &&
        req.user.role !== "ADMIN"
    ) {
        throw new ApiError(
            403,
            "Forbidden. You cannot pin comments on this blog."
        );
    }

    // If the comment is already pinned → unpin it
    if (comment.isPinned) {

        comment.isPinned = false;

        await comment.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                "Comment unpinned successfully.",
                {
                    isPinned: false
                }
            )
        );
    }

    // Unpin every comment of this blog
    await Comment.updateMany(
        {
            blog: comment.blog
        },
        {
            $set: {
                isPinned: false
            }
        }
    );

    // Pin selected comment
    comment.isPinned = true;

    await comment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Comment pinned successfully.",
            {
                isPinned: true
            }
        )
    );

});

export const hideComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    const reason = req.body?.reason || "spam";

    const comment = await Comment.findById(commentId)
        .populate("blog", "author");

    if (!comment) {
        throw new ApiError(
            404,
            "Comment does not exist."
        );
    }

    if (comment.status === "HIDDEN") {
        throw new ApiError(
            400,
            "Comment already hidden."
        )
    }

    const isAdmin = req.user.role === "ADMIN";

    const isBlogAuthor =
        comment.blog.author.toString() === req.user._id.toString();

    if (!isAdmin && !isBlogAuthor) {
        throw new ApiError(
            403,
            "Forbidden. You cannot hide this comment."
        );
    }

    let reasonStatment;

    if (isBlogAuthor) {
        reasonStatment = `This comment was hidden by the blog author due to ${reason}.`;
    } else {
        reasonStatment = `This comment was hidden by a platform administrator due to ${reason}.`;
    }

    comment.status = "HIDDEN";

    comment.isPinned = false;

    comment.moderation = {
        reason: reasonStatment,
        hiddenBy: req.user?._id,
        hiddenAt: new Date(),
        deleteAfter: new Date(Date.now() + 60 * 60 * 1000)
    };

    await comment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Comment hidden successfully.",
            { comment }
        )
    );

});