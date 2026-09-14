import Like from "../models/like.model.js";
import Blog from "../models/blog.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const toggleLike = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  const like = await Like.findOne({
    user: userId,
    blog: blogId,
  });

  if (like) {
    // Unlike
    await Like.deleteOne({
      _id: like._id,
    });

    const updatedBlog = await Blog.findOneAndUpdate(
      {
        _id: blogId,
        likesCount: { $gt: 0 },
      },
      {
        $inc: { likesCount: -1 },
      },
      {
        returnDocument: "After",
      },
    );

    return res.status(200).json(
      new ApiResponse(200, "Blog unliked successfully.", {
        liked: false,
        likesCount: updatedBlog?.likesCount ?? 0,
      }),
    );
  }

  // Like
  try {
    await Like.create({
      user: userId,
      blog: blogId,
    });
  } catch (error) {
    // Another concurrent request may have created the like.
    if (error.code === 11000) {
      const currentBlog = await Blog.findById(blogId).select("likesCount");

      return res.status(200).json(
        new ApiResponse(200, "Blog already liked.", {
          liked: true,
          likesCount: currentBlog.likesCount,
        }),
      );
    }

    throw error;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $inc: { likesCount: 1 },
    },
    {
      returnDocument: "After",
    },
  );

  return res.status(200).json(
    new ApiResponse(200, "Blog liked successfully.", {
      liked: true,
      likesCount: updatedBlog.likesCount,
    }),
  );
});

export const getLikedBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6 } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  // Get the user's own blog IDs
  const ownBlogIds = await Blog.find({
    author: req.user._id,
  }).distinct("_id");

  // Get likes except those belonging to the user's own blogs
  const likes = await Like.find({
    user: req.user._id,
    blog: { $nin: ownBlogIds },
  })
    .populate({
      path: "blog",
      populate: [
        {
          path: "author",
          select: "userName profilePic.url",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    })
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limitNumber);

  const blogs = likes.map((like) => ({
    ...like.blog.toObject(),
    isLiked: true,
  }));

  const totalBlogs = await Like.countDocuments({
    user: req.user._id,
    blog: { $nin: ownBlogIds },
  });

  return res.status(200).json(
    new ApiResponse(200, "Liked blogs fetched successfully.", {
      blogs,
      page: pageNumber,
      totalBlogs,
      hasMore: pageNumber * limitNumber < totalBlogs,
    }),
  );
});
