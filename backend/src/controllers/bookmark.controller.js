import Blog from "../models/blog.model.js";
import Bookmark from "../models/bookmark.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Like from "../models/like.model.js";

export const toggleBookmark = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog does not exist.");
  }

  const alreadyBookmarked = await Bookmark.findOne({
    user: req.user._id,
    blog: blogId,
  });

  let bookmarked = false;

  let message = "";

  if (alreadyBookmarked) {
    await Bookmark.findOneAndDelete({
      user: req.user._id,
      blog: blogId,
    });

    bookmarked = false;

    message = "Bookmark removed successfully.";
  } else {
    if (blog.status === "DRAFT" || blog.status === "REMOVED") {
      throw new ApiError(400, `${blog.status} blog cannot be bookmarked.`);
    }

    await Bookmark.create({
      user: req.user._id,
      blog: blogId,
    });

    bookmarked = true;

    message = "Blog bookmarked successfully.";
  }

  return res.status(200).json(
    new ApiResponse(200, message, {
      bookmarked,
    }),
  );
});

export const getBookmarkedBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6 } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  // Get likes except those belonging to the user's own blogs
  const bookmarks = await Bookmark.find({
    user: req.user._id,
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

  const blogs = await Promise.all(
    bookmarks
      .filter((bookmark) => bookmark.blog)
      .map(async (bookmark) => {
        const blog = bookmark.blog;

        const isLiked = await Like.exists({
          user: req.user._id,
          blog: blog._id,
        });

        return {
          ...blog.toObject(),
          isLiked: !!isLiked,
          isBookmarked: true,
        };
      }),
  );

  const totalBlogs = await Bookmark.countDocuments({
    user: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(200, " Blogs fetched successfully.", {
      blogs,
      page: pageNumber,
      totalBlogs,
      hasMore: pageNumber * limitNumber < totalBlogs,
    }),
  );
});
