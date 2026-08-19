import Blog from "../models/blog.model.js";
import Bookmark from "../models/bookmark.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


export const toggleBookmark = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog does not exist."
        )
    }


    const alreadyBookmarked = await Bookmark.findOne({
        user: req.user._id,
        blog: blogId
    });


    let bookmarked = false;

    let message = "";

    if (alreadyBookmarked) {

        await Bookmark.findOneAndDelete({
            user: req.user._id,
            blog: blogId
        });

        bookmarked = false;

        message = "Bookmark removed successfully.";

    }
    else {

        if (blog.status === "DRAFT" || blog.status === "REMOVED") {
            throw new ApiError(
                400,
                `${blog.status} blog cannot be bookmarked.`
            )
        }

        await Bookmark.create({
            user: req.user._id,
            blog: blogId
        });

        bookmarked = true;

        message = "Blog bookmarked successfully.";
    }

    return res.status(200).json(new ApiResponse(
        200,
        message,
        {
            bookmarked
        }
    ))

});


export const getBookmarkedBlogs = asyncHandler(async (req, res) => {

    const bookmarks = await Bookmark.find({
        user: req.user._id
    }).populate({
        path: "blog",
        populate: [
            {
                path: "author",
                select: "userName profilePic"
            },
            {
                path: "category",
                select: "name"
            }
        ]
    })

    // we have to send only the blogs not bookmark id ,etc
    const bookmarkedBlogs = bookmarks.map(bookmark => bookmark.blog);

    return res.status(200).json(new ApiResponse(
        200,
        "Blogs fetched successfully!",
        {
            blogs: bookmarkedBlogs
        }


    ))

}); 