import Like from "../models/like.model.js";
import Blog from "../models/blog.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const toggleLike = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found."
        )
    }

    const like = await Like.findOne({
        user: req.user._id,
        blog: blogId
    })

    let message = "";
    let liked = false;
    let increment = 1;

    if (like) {

        increment = -1;

        await Like.deleteOne({
            user: req.user._id,
            blog: blogId
        });

        liked = false;

        message = "Blog unliked successfully.";

    }

    else {

        await Like.create({
            blog: blogId,
            user: req.user._id
        })

        liked = true;

        message = "Blog liked successfully.";
  
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $inc: {
                likesCount: increment
            }
        },
        {
            new: true,
        }
    )



    return res.status(200).json(new ApiResponse(
        200,
        message,
        {
            liked,
            likesCount: updatedBlog.likesCount
        }
    ))

});


export const getLikedBlogs = asyncHandler(async (req, res) => {
    
    const likes = await Like.find({
        user: req.user._id
    })
        .populate({
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
        });

    const blogs = likes.map(like => like.blog);

    if (blogs.length === 0) {
        throw new ApiError(
            404,
            "There is no liked blogs."
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Liked blogs fetched successfully.",
            { blogs }
        )
    );

});
