import asyncHandler from "express-async-handler";
import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadFile, deleteFile } from "../Services/file.service.js"
import Blog from "../models/blog.model.js"
import Comment from "../models/comment.model.js"
import Like from "../models/like.model.js"
import Bookmark from "../models/bookmark.model.js"
import Category from "../models/category.model.js";
import expressAsyncHandler from "express-async-handler";
import { slugify } from "../utils/slugify.js";
import View from "../models/blogView.model.js";
import EmailToken from '../models/emailToken.model.js';
import { EMAIL_EXPIRY, EMAIL_TOKEN_TYPES } from "../constants/email.constants.js"
import { sendDeleteBlogOtpEmail } from "../services/email/email.service.js";
import User from "../Models/user.model.js";
import { generateEmailOtp } from "../utils/generateEmailToken.js";
import { Aggregate } from "mongoose";


export const createBlog = asyncHandler(async (req, res) => {

    const { title, tags, content, category, status = "DRAFT" } = req.body;

    const file = req.file;

    if (!file) {
        throw new ApiError(
            400,
            "Image  is required."
        )
    }


    const featuredImage = await uploadFile(
        file.buffer,
        'Blogging Application/featuredImage',
        "image"
    )

    const slug = slugify(title, req.user._id);

    const author = req.user._id;

    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
        throw new ApiError(
            404,
            "Category not found."
        )
    }

    const publishedAt =
        status === "PUBLISHED"
            ? new Date()
            : null;

    const createdBlog = await Blog.create({
        title,
        slug,
        content,
        author,
        category: existingCategory._id,
        featuredImage: {
            url: featuredImage.url,
            public_id: featuredImage.public_id
        },
        tags,
        readTime,
        status,
        publishedAt
    });

    await Category.findByIdAndUpdate(
        existingCategory._id,
        {
            $inc: {
                blogCount: 1
            }
        }
    );

    return res.status(201).json(new ApiResponse(
        201,
        "Blog created successfully!",
        {
            blog: createdBlog
        }
    ))

});

export const getAllBlogs = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);


    const blogs = await Blog.aggregate([

        {
            $match: {
                status: "PUBLISHED"
            }
        },

        // To add the field score for trending  and latest blog
        {
            $addFields: {

                score: {

                    $add: [

                        {
                            $multiply: [
                                "$likesCount",
                                0.5
                            ]
                        },

                        {
                            $multiply: [
                                "$blogViews",
                                0.3
                            ]
                        },

                        {
                            $multiply: [
                                {
                                    $divide: [
                                        {
                                            $subtract: [
                                                new Date(),
                                                "$createdAt"
                                            ]
                                        },

                                        1000 * 60 * 60//To convert data into hours
                                    ]
                                }, 0.2
                            ]

                        }

                    ]

                }
            }
        },

        //Espically random this by adding the field finallScore in the database

        {
            $addFields: {
                finalScore: {
                    $add: [
                        "$score",
                        {
                            $multiply: [
                                { $rand: {} },
                                1000
                            ]
                        }
                    ]
                }
            }
        },

        {
            $sort: {
                finalScore: -1
            }
        },

        {
            $skip: skip
        },

        {
            $limit: Number(limit)
        }

    ]);

    const totalBlogs = await Blog.countDocuments({
        status: "PUBLISHED"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Blogs fetched successfully",
            {
                blogs,
                page: Number(page),
                totalBlogs: totalBlogs,
                hasMore: page * limit < totalBlogs
            }
        )
    );

});

export const getSingleBlog = asyncHandler(async (req, res) => {

    const { slug } = req.params;

    const blog = await Blog.findOne({
        slug,
        // status: "PUBLISHED"
    })
        .populate("author", "userName profilePic")
        .populate("category", "name slug");

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found"
        )
    }

    try {

        await View.create({
            user: req.user._id,
            blog: blog._id
        })

        await Blog.findByIdAndUpdate(
            blog._id,
            {
                $inc: {
                    blogViews: 1
                }
            },
            {
                returnDocument: "after"
            }
        );

        blog.blogViews += 1;

        await Category.findOneAndUpdate(
            blog.category || blog.category._id,
            {
                $inc: {
                    categoryViews: 1
                }
            },
            {
                returnDocument: "after"
            }
        );

    } catch (error) {
        console.log(error);

        if (error.code != 11000) {
            throw error
        }
    }

    return res.status(200).json(new ApiResponse(
        200,
        "Blog sent successfully.",
        { blog }
    ))

});

export const updateBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    const { title, content, category, tags, status } = req.body;

    const blog = await Blog.findById(blogId)

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found."
        )
    }


    if (!blog.author.equals(req.user._id)) {
        throw new ApiError(
            403,
            "Unauthorized you are not allowed to update the blog."
        )
    }

    const updateData = {};

    if (category) {
        const existingCategory = await Category.findById(category)

        if (!existingCategory) {
            throw new ApiError(
                404,
                "Category not found."
            )
        }
        updateData.category = existingCategory._id;
    }


    if (title) {
        updateData.title = title;
        updateData.slug = slugify(title, req.user._id)
    }

    if (content) {
        const words = content.trim().split(/\s+/).length
        updateData.readTime = Math.ceil(words / 200);
        updateData.content = content;
    }

    if (tags) {
        updateData.tags = tags;
    }


    if (status) {
        updateData.status = status;
    }

    const file = req.file;

    if (file) {

        const imageData = await uploadFile(
            file.buffer,
            'Blogging Application/featuredImage',
            "image"
        )

        if (imageData) {
            updateData.featuredImage = imageData;
        }

        if (blog.featuredImage?.public_id) {
            await deleteFile(
                blog.featuredImage.public_id
            );
        }

    }

    updateData.isUpdated = true;

    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set: updateData

        },
        {
            returnDocument: "after",
            runValidators: true
        }
    )

    return res.status(200).json(new ApiResponse(
        200,
        "Blog Updated successfully.",
        { blog: updatedBlog }
    ))

});

export const publishBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(
            400,
            "Blog id is required."
        );
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found."
        );
    }

    if (!blog.author.equals(req.user?._id)) {
        throw new ApiError(
            403,
            "Unauthorized. You are not allowed to publish this blog."
        );
    }

    if (blog.status === "PUBLISHED") {
        throw new ApiError(
            400,
            "Blog is already published."
        );
    }

    blog.status = "PUBLISHED";
    blog.publishedAt = new Date();

    await blog.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Blog published successfully.",
            {
                blog
            }
        )
    );

});

export const unpublishBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(
            400,
            "Blog id is required."
        );
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found."
        );
    }

    if (!blog.author.equals(req.user._id)) {
        throw new ApiError(
            403,
            "Unauthorized. You are not allowed to unpublish this blog."
        );
    }

    if (blog.status === "DRAFT") {
        throw new ApiError(
            400,
            "Blog is already a unpublished."
        );
    }

    blog.status = "DRAFT";
    blog.publishedAt = null;

    await blog.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Blog unpublished successfully.",
            {
                blog
            }
        )
    );

});

export const getMyBlogs = asyncHandler(async (req, res) => {

    const { status } = req.query;

    if (!status) {
        throw new ApiError(
            400,
            "Status is required."
        )
    }

    const allowedStatus = [
        "DRAFT",
        "PUBLISHED",
        "REMOVED"
    ];

    if (status && !allowedStatus.includes(status)) {
        throw new ApiError(
            400,
            "Invalid blog status."
        );
    }

    const filter = {
        author: req.user._id,
        status
    }

    const blogs = await Blog.find(filter)
        .populate("author", "userName")
        .populate("category", "name")
        .sort({
            isPinned: -1,
            updatedAt: -1
        })


    if (blogs.length === 0) {
        throw new ApiError(
            404,
            `You have not any ${status.toLowerCase()}  blogs.`
        )
    }



    return res.status(200).json(new ApiResponse(
        200,
        "Blogs fetched successfully.",
        blogs
    ))
});

export const pinBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    const blog = await Blog.findById(blogId)
        .populate("author", "userName")
        .populate("category", "name");

    if (!blog) {
        throw new ApiError(
            404,
            "Blog does not exists."
        )
    };

    if (
        !blog.author.equals(req.user._id) && req.user.role !== "ADMIN") {
        throw new ApiError(
            403,
            "Forbidden. You cannot pin this blog."
        );
    }

    blog.isPinned = !blog.isPinned;

    const message = blog.isPinned
        ? "Blog pinned successfully."
        : "Blog unpinned successfully.";

    await blog.save();

    return res.status(200).json(new ApiResponse(
        200,
        message,
        {
            isPinned: blog.isPinned,
            status: blog.status
        }
    ))

});

export const sendDeleteBlogOtp = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        )
    }

    if (!user.isEmailVerified) {

        await sendVerificationEmail(user);

        throw new ApiError(
            403,
            "Email verification is required. A verification email has been sent."
        )
    }

    const blog = await Blog.findById(blogId).populate("category", "name");

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found"
        )
    }

    if (!blog.author.equals(req.user._id)) {

        throw new ApiError(
            403,
            "Forbidden. You are not allowed to delete this blog."
        )
    }

    await EmailToken.deleteMany({
        type: EMAIL_TOKEN_TYPES.DELETE_BLOG_OTP,
        userId: user._id
    })

    const { rawOtp, hashedOtp } = generateEmailOtp()

    const expiresAt = new Date(Date.now() + EMAIL_EXPIRY.DELETE_BLOG_OTP);

    await EmailToken.create({
        userId: req.user._id,
        type: EMAIL_TOKEN_TYPES.DELETE_BLOG_OTP,
        token: hashedOtp,
        expiresAt
    })

    await sendDeleteBlogOtpEmail(user, blog, rawOtp);

    res.status(200).json(new ApiResponse(
        200,
        "Blog reset OTP has been sent to your email."
    ))

});

export const verifyDeleteBlogOtp = asyncHandler(async (req, res) => {

    const { otp } = req.body;

    if (!otp) {
        throw new ApiError(
            400,
            "Otp is required."
        )
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    const token = await EmailToken.findOne({
        type: EMAIL_TOKEN_TYPES.DELETE_BLOG_OTP,
        token: hashedOtp,
        userId: req.user._id
    })

    if (!token) {
        throw new ApiError(
            404,
            "Invalid Otp or Otp expires. "
        )
    }

    if (token.expiresAt < new Date()) {
        throw new ApiError(
            404,
            "Otp expired. "
        )
    }

    await EmailToken.findByIdAndDelete(token._id);

    return res.status(200).json(new ApiResponse(
        200,
        "Blog delete otp verified successfully."
    ))

});

export const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    const reason = req.body?.reason || "This blog contains copyrighted content."

    if (!blogId) {
        throw new ApiError(
            400,
            "Blog id is required."
        )
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found."
        )
    }


    if (!blog.author.equals(req.user._id)) {

        if (req.user?.role != "ADMIN") {
            throw new ApiError(
                403,
                "Unauthorized you are not allowed to delete the blog."
            )
        }

        if (blog.status === "REMOVED") {
            throw new ApiError(
                400,
                "Blog has already been removed."
            );
        }

        blog.status = "REMOVED";

        blog.moderation = {
            reason,
            removedBy: req.user._id,
            removedAt: new Date()
        };

        await blog.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                "Blog removed successfully by admin."
            )
        )

    }

    if (blog.featuredImage?.public_id) {
        await deleteFile(blog.featuredImage.public_id)
    }

    await Promise.all([
        Comment.deleteMany({ blog: blogId }),
        Like.deleteMany({ blog: blogId }),
        Bookmark.deleteMany({ blog: blogId }),
        View.deleteMany({ blog: blogId }),
        EmailToken.deleteMany({
            userId: blog.author,
            type: "DELETE_BLOG_OTP"
        })
    ]);


    await Category.findOneAndUpdate(
        blog.category,
        {
            $inc: {
                blogCount: -1
            }
        }
    );

    await Blog.findByIdAndDelete(blogId);


    return res.status(200).json(new ApiResponse(
        200,
        "Blog delete successfully!"

    ))
});