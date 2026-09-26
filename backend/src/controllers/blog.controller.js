import asyncHandler from "express-async-handler";
import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadFile, deleteFile } from "../services/file.service.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Bookmark from "../models/bookmark.model.js";
import Category from "../models/category.model.js";
import { slugify } from "../utils/slugify.js";
import View from "../models/blogView.model.js";
import EmailToken from "../models/emailToken.model.js";
import {
  EMAIL_EXPIRY,
  EMAIL_TOKEN_TYPES,
} from "../constants/email.constants.js";
import { sendDeleteBlogOtpEmail } from "../services/email/email.service.js";
import User from "../models/user.model.js";
import { generateEmailOtp } from "../utils/generateEmailToken.js";
import mongoose from "mongoose";

export const createBlog = asyncHandler(async (req, res) => {
  const { title, tags, content, category, status = "DRAFT" } = req.body;

  const file = req.file;

  if (!file) {
    throw new ApiError(400, "Image  is required.");
  }

  const featuredImage = await uploadFile(
    file.buffer,
    "Blogging Application/featuredImage",
    "image",
  );

  const slug = slugify(title, req.user._id);

  const alreadyExistBlog = await Blog.findOne({ slug });

  if (alreadyExistBlog) {
    throw new ApiError(409, "A blog with the same title already exists. ");
  }

  const author = req.user._id;

  const words = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / 200);

  const existingCategory = await Category.findById(category);

  if (!existingCategory) {
    throw new ApiError(404, "Category not found.");
  }

  const publishedAt = status === "PUBLISHED" ? new Date() : null;

  const createdBlog = await Blog.create({
    title,
    slug,
    content,
    author,
    category: existingCategory._id,
    featuredImage: {
      url: featuredImage.url,
      public_id: featuredImage.public_id,
    },
    tags,
    readTime,
    status,
    publishedAt,
  });

  await Category.findByIdAndUpdate(existingCategory._id, {
    $inc: {
      blogCount: 1,
    },
  });

  let message =
    status === "DRAFT" ? "Blog saved as Draft." : "Blog created successfully!";

  return res.status(201).json(
    new ApiResponse(201, message, {
      blog: createdBlog,
    }),
  );
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6 } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const userId = req.user?._id;

  const pipeline = [
    // ==========================================
    // Only published blogs
    // ==========================================
    {
      $match: {
        status: "PUBLISHED",
      },
    },

    // ==========================================
    // Get total comments
    // ==========================================
    {
      $lookup: {
        from: "comments",

        let: {
          blogId: "$_id",
        },

        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$blog", "$$blogId"],
              },
            },
          },

          {
            $count: "count",
          },
        ],

        as: "commentsData",
      },
    },

    // ==========================================
    // Convert comment lookup result
    // Use Blog.likesCount directly
    // ==========================================
    {
      $addFields: {
        likesCount: {
          $ifNull: ["$likesCount", 0],
        },

        commentsCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$commentsData.count", 0],
            },
            0,
          ],
        },
      },
    },

    // ==========================================
    // Remove temporary arrays
    // ==========================================
    {
      $project: {
        commentsData: 0,
      },
    },
  ];

  // ==========================================
  // Check whether logged-in user liked each blog
  // ==========================================
  if (userId) {
    pipeline.push(
      {
        $lookup: {
          from: "likes",

          let: {
            blogId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$blog", "$$blogId"],
                    },

                    {
                      $eq: ["$user", userId],
                    },
                  ],
                },
              },
            },

            {
              $limit: 1,
            },
          ],

          as: "userLike",
        },
      },

      {
        $addFields: {
          isLiked: {
            $gt: [
              {
                $size: "$userLike",
              },
              0,
            ],
          },
        },
      },

      {
        $project: {
          userLike: 0,
        },
      },
    );
  } else {
    pipeline.push({
      $addFields: {
        isLiked: false,
      },
    });
  }

  // ==========================================
  // Check whether logged-in user bookmarked each blog
  // ==========================================
  if (userId) {
    pipeline.push(
      {
        $lookup: {
          from: "bookmarks",

          let: {
            blogId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$blog", "$$blogId"],
                    },

                    {
                      $eq: ["$user", userId],
                    },
                  ],
                },
              },
            },

            {
              $limit: 1,
            },
          ],

          as: "userBookmark",
        },
      },

      {
        $addFields: {
          isBookmarked: {
            $gt: [
              {
                $size: "$userBookmark",
              },
              0,
            ],
          },
        },
      },

      {
        $project: {
          userBookmark: 0,
        },
      },
    );
  } else {
    pipeline.push({
      $addFields: {
        isBookmarked: false,
      },
    });
  }

  // ==========================================
  // Calculate stable discovery score
  // ==========================================
  pipeline.push({
    $addFields: {
      score: {
        $add: [
          // Likes
          {
            $multiply: ["$likesCount", 5],
          },

          // Views
          {
            $multiply: ["$blogViews", 2],
          },

          // Comments
          {
            $multiply: ["$commentsCount", 3],
          },

          // Recency
          {
            $multiply: [
              {
                $divide: [
                  {
                    $subtract: [new Date(), "$createdAt"],
                  },

                  1000 * 60 * 60 * 24,
                ],
              },

              -0.2,
            ],
          },
        ],
      },
    },
  });

  // ==========================================
  // Stable sorting
  // ==========================================
  pipeline.push({
    $sort: {
      score: -1,
      createdAt: -1,
      _id: -1,
    },
  });

  // ==========================================
  // Pagination
  // ==========================================
  pipeline.push(
    {
      $skip: skip,
    },

    {
      $limit: limitNumber,
    },
  );

  const blogs = await Blog.aggregate(pipeline);

  // ==========================================
  // Populate author and category
  // ==========================================
  await Blog.populate(blogs, [
    {
      path: "author",
      select: "userName profilePic.url",
    },

    {
      path: "category",
      select: "name",
    },
  ]);

  const totalBlogs = await Blog.countDocuments({
    status: "PUBLISHED",
  });

  return res.status(200).json(
    new ApiResponse(200, "Blogs fetched successfully", {
      blogs,
      page: pageNumber,
      totalBlogs,
      hasMore: pageNumber * limitNumber < totalBlogs,
    }),
  );
});

export const getSingleBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug })
    .populate("author", "userName profilePic")
    .populate("category", "name slug");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const [isLiked, isBookmarked] = await Promise.all([
    req.user
      ? Like.exists({
          user: req.user._id,
          blog: blog._id,
        })
      : null,

    req.user
      ? Bookmark.exists({
          user: req.user._id,
          blog: blog._id,
        })
      : null,
  ]);

  try {
    if (req.user) {
      await View.create({
        user: req.user._id,
        blog: blog._id,
      });
    }

    await Blog.findByIdAndUpdate(blog._id, {
      $inc: {
        blogViews: 1,
      },
    });

    blog.blogViews += 1;

    if (blog.category?._id) {
      await Category.findByIdAndUpdate(blog.category._id, {
        $inc: {
          categoryViews: 1,
        },
      });
    }
  } catch (error) {
    // Duplicate view is not a fatal error
    if (error.code !== 11000) {
      throw error;
    }
  }

  return res.status(200).json(
    new ApiResponse(200, "Blog sent successfully.", {
      blog: {
        ...blog.toObject(),
        isLiked: !!isLiked,
        isBookmarked: !!isBookmarked,
      },
    }),
  );
});

export const getBlogForEdit = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId).populate("category", "name slug");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to edit this blog");
  }

  if (blog?.isUpdated) {
    throw new ApiError(400, "This blog is already updated.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog fetched successfully.", { blog }));
});

export const getSearchedBlog = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6, textSearch, categorySlug } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  // Build filter object
  const filter = {
    status: "PUBLISHED",
  };

  if (!textSearch && !categorySlug) {
    return;
  }

  if (categorySlug) {
    const category = await Category.findOne({
      slug: categorySlug,
    });

    if (!category) {
      throw new ApiError(404, "Category not found.");
    }

    filter.category = category._id;
  }

  // Search by title
  if (textSearch) {
    const matchingCategories = await Category.find({
      $or: [
        {
          name: {
            $regex: textSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: textSearch,
            $options: "i",
          },
        },
      ],
    }).select("_id");

    const categoryIds = matchingCategories.map((category) => category._id);

    filter.$or = [
      {
        title: {
          $regex: textSearch,
          $options: "i",
        },
      },
      {
        content: {
          $regex: textSearch,
          $options: "i",
        },
      },
      {
        tags: {
          $regex: textSearch,
          $options: "i",
        },
      },
      {
        category: {
          $in: categoryIds,
        },
      },
    ];
  }

  let blogs = await Blog.find(filter)
    .populate("author", "userName profilePic")
    .populate("category", "name slug")
    .sort({ likesCount: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Add like/bookmark status only for logged-in users
  if (req.user?._id) {
    const likes = await Like.find({
      user: req.user._id,
    });

    const bookmarks = await Bookmark.find({
      user: req.user._id,
    });

    const likedBlogIds = new Set(likes.map((like) => like.blog.toString()));

    const bookmarkedBlogIds = new Set(
      bookmarks.map((bookmark) => bookmark.blog.toString()),
    );

    blogs = blogs.map((blog) => ({
      ...blog,

      isLiked: likedBlogIds.has(blog._id.toString()),

      isBookmarked: bookmarkedBlogIds.has(blog._id.toString()),
    }));
  }

  const totalBlogs = await Blog.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, "Blogs fetched successfully.", {
      blogs,
      page: Number(page),
      totalBlogs,
      hasMore: pageNumber * limitNumber < totalBlogs,
    }),
  );
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const { title, content, category, tags, status } = req.body;

  const featuredImage = req.file;

  if (!title && !content && !category && !tags && !status && !featuredImage) {
    throw new ApiError(400, "At least one new field is required");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  if (!blog.author.equals(req.user._id)) {
    throw new ApiError(
      403,
      "Unauthorized you are not allowed to update the blog.",
    );
  }

  const updateData = {};

  if (category) {
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      throw new ApiError(404, "Category not found.");
    }
    updateData.category = existingCategory._id;
  }

  if (title) {
    updateData.title = title;
    updateData.slug = slugify(title, req.user._id);
  }

  if (content) {
    const words = content.trim().split(/\s+/).length;
    updateData.readTime = Math.ceil(words / 200);
    updateData.content = content;
  }

  if (tags) {
    updateData.tags = tags;
  }

  if (status) {
    updateData.status = status;
  }

  if (featuredImage) {
    const imageData = await uploadFile(
      featuredImage.buffer,
      "Blogging Application/featuredImage",
      "image",
    );

    if (imageData) {
      updateData.featuredImage = imageData;
    }

    if (blog.featuredImage?.public_id) {
      await deleteFile(blog.featuredImage.public_id);
    }
  }

  updateData.isUpdated = true;
  updateData.blogUpdatedAt = new Date();

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $set: updateData,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  let message =
    status === "DRAFT"
      ? "Blog updated successfully and saved as Draft."
      : "Blog updated successfully.";

  return res
    .status(200)
    .json(new ApiResponse(200, message, { blog: updatedBlog }));
});

export const publishBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required.");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  if (!blog.author.equals(req.user?._id)) {
    throw new ApiError(
      403,
      "Unauthorized. You are not allowed to publish this blog.",
    );
  }

  if (blog.status === "PUBLISHED") {
    throw new ApiError(400, "Blog is already published.");
  }

  blog.status = "PUBLISHED";
  blog.publishedAt = new Date();

  await blog.save();

  return res.status(200).json(
    new ApiResponse(200, "Blog published successfully.", {
      blog,
    }),
  );
});

export const unpublishBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required.");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  if (!blog.author.equals(req.user._id)) {
    throw new ApiError(
      403,
      "Unauthorized. You are not allowed to unpublish this blog.",
    );
  }

  if (blog.status === "DRAFT") {
    throw new ApiError(400, "Blog is already a unpublished.");
  }

  blog.status = "DRAFT";

  await blog.save();

  return res.status(200).json(
    new ApiResponse(200, "Blog unpublished successfully.", {
      blog,
    }),
  );
});

export const getMyBlogs = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 6 } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const allowedStatus = ["DRAFT", "PUBLISHED", "REMOVED"];

  if (status && !allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid blog status.");
  }

  const filter = {
    author: req.user._id,
  };

  if (status) {
    filter.status = status;
  }

  const blogs = await Blog.find(filter)
    .populate("author", "userName profilePic.url")
    .populate("category", "name")
    .sort({
      isPinned: -1,
      updatedAt: -1,
    })
    .skip(skip)
    .limit(limitNumber);

  // Check which blogs are liked by the logged-in user
  const blogsWithLikeStatus = await Promise.all(
    blogs.map(async (blog) => {
      const isLiked = await Like.exists({
        user: req.user._id,
        blog: blog._id,
      });

      return {
        ...blog.toObject(),
        isLiked: !!isLiked,
      };
    }),
  );

  const totalBlogs = await Blog.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, "Blogs fetched successfully", {
      blogs: blogsWithLikeStatus,
      page: pageNumber,
      totalBlogs,
      hasMore: pageNumber * limitNumber < totalBlogs,
    }),
  );
});

export const pinBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog does not exists.");
  }

  if (!blog.author.equals(req.user._id) && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden. You cannot pin this blog.");
  }

  blog.isPinned = !blog.isPinned;

  const message = blog.isPinned
    ? "Blog pinned successfully."
    : "Blog unpinned successfully.";

  await blog.save();

  return res.status(200).json(
    new ApiResponse(200, message, {
      isPinned: blog.isPinned,
      status: blog.status,
    }),
  );
});

export const sendDeleteBlogOtp = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.isEmailVerified) {
    await sendVerificationEmail(user);

    throw new ApiError(
      403,
      "Email verification is required. A verification email has been sent.",
    );
  }

  const blog = await Blog.findById(blogId).populate("category", "name");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (!blog.author.equals(req.user._id)) {
    throw new ApiError(
      403,
      "Forbidden. You are not allowed to delete this blog.",
    );
  }

  await EmailToken.deleteMany({
    type: EMAIL_TOKEN_TYPES.DELETE_BLOG_OTP,
    userId: user._id,
  });

  const { rawOtp, hashedOtp } = generateEmailOtp();

  const expiresAt = new Date(Date.now() + EMAIL_EXPIRY.DELETE_BLOG_OTP);

  await EmailToken.create({
    userId: req.user._id,
    type: EMAIL_TOKEN_TYPES.DELETE_BLOG_OTP,
    token: hashedOtp,
    expiresAt,
  });

  await sendDeleteBlogOtpEmail(user, blog, rawOtp);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Blog reset OTP has been sent to your email successfully.Please also check your spam.",
      ),
    );
});

export const verifyDeleteBlogOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    throw new ApiError(400, "Otp is required.");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const token = await EmailToken.findOne({
    type: EMAIL_TOKEN_TYPES.DELETE_BLOG_OTP,
    token: hashedOtp,
    userId: req.user._id,
  });

  if (!token) {
    throw new ApiError(404, "Invalid Otp or Otp expires. ");
  }

  if (token.expiresAt < new Date()) {
    throw new ApiError(404, "Otp expired. ");
  }

  await EmailToken.findByIdAndDelete(token._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog delete otp verified successfully."));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const reason = req.body?.reason || "This blog contains copyrighted content.";

  if (!blogId) {
    throw new ApiError(400, "Blog id is required.");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  if (!blog.author.equals(req.user._id)) {
    if (req.user?.role != "ADMIN") {
      throw new ApiError(
        403,
        "Unauthorized you are not allowed to delete the blog.",
      );
    }

    if (blog.status === "REMOVED") {
      throw new ApiError(400, "Blog has already been removed.");
    }

    blog.status = "REMOVED";

    blog.moderation = {
      reason,
      removedBy: req.user._id,
      removedAt: new Date(),
    };

    await blog.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Blog removed successfully by admin."));
  }

  if (blog.featuredImage?.public_id) {
    await deleteFile(blog.featuredImage.public_id);
  }

  await Promise.all([
    Comment.deleteMany({ blog: blogId }),
    Like.deleteMany({ blog: blogId }),
    Bookmark.deleteMany({ blog: blogId }),
    View.deleteMany({ blog: blogId }),
    EmailToken.deleteMany({
      userId: blog.author,
      type: "DELETE_BLOG_OTP",
    }),
  ]);

  await Category.findOneAndUpdate(blog.category, {
    $inc: {
      blogCount: -1,
    },
  });

  await Blog.findByIdAndDelete(blogId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog delete successfully!"));
});

export const blogStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [likesResult, totalBlogsCount, publishedBlogsCount, draftBlogsCount] =
    await Promise.all([
      Blog.aggregate([
        {
          $match: {
            author: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            totalLikesCount: {
              $sum: { $ifNull: ["$likesCount", 0] },
            },
          },
        },
      ]),

      Blog.countDocuments({
        author: userId,
      }),

      Blog.countDocuments({
        author: userId,
        status: "PUBLISHED",
      }),

      Blog.countDocuments({
        author: userId,
        status: "DRAFT",
      }),
    ]);

  const totalLikesCount = likesResult[0]?.totalLikesCount ?? 0;

  let recentBlogs = await Blog.find({
    author: userId,
  })
    .sort({
      createdAt: -1,
    })
    .limit(3)
    .lean();

  recentBlogs = recentBlogs.map((blog) => ({
    title: blog.title,
    status: blog.status,
    content: blog.content,
  }));

  return res.status(200).json(
    new ApiResponse(200, "Stats fetched successfully.", {
      totalLikesCount,
      publishedBlogsCount,
      draftBlogsCount,
      totalBlogsCount,
      recentBlogs,
    }),
  );
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6, userId } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const blogs = await Blog.find({
    author: userId,
  })
    .populate("author", "userName profilePic.url")
    .populate("category", "name")
    .sort({
      isPinned: -1,
      updatedAt: -1,
    })
    .skip(skip)
    .limit(limitNumber);
  // Check which blogs are liked by the logged-in user
  const blogsWithLikeStatus = await Promise.all(
    blogs.map(async (blog) => {
      const isLiked = await Like.exists({
        user: userId,
        blog: blog._id,
      });
      const isBookmarked = await Bookmark.exists({
        user: userId,
        blog: blog._id,
      });

      return {
        ...blog.toObject(),
        isLiked: !!isLiked,
        isBookmarked: !!isBookmarked,
      };
    }),
  );

  const [likesResult, totalBlogs, publishedBlogs] = await Promise.all([
    Blog.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalLikesCount: {
            $sum: { $ifNull: ["$likesCount", 0] },
          },
        },
      },
    ]),

    Blog.countDocuments({
      author: userId,
    }),

    Blog.countDocuments({
      author: userId,
      status: "PUBLISHED",
    }),
  ]);

  const totalLikes = likesResult[0]?.totalLikesCount ?? 1000;

  const userData = await User.findOne({ _id: userId }).select(
    "userName bio profilePic.url address role",
  );

  return res.status(200).json(
    new ApiResponse(200, "Blogs fetched successfully", {
      blogs: blogsWithLikeStatus,
      page: pageNumber,
      userStats: {
        totalBlogs,
        publishedBlogs,
        totalLikes,
      },
      userData,
      hasMore: pageNumber * limitNumber < totalBlogs,
    }),
  );
});
