import express from "express";
import { protectedRoute, authorizeRole } from '../middlewares/auth.middleware.js';
import { imageUploader } from "../middlewares/upload.middleware.js";
import { createBlogValidator, singleBlogValidator, updateBlogValidator, verifyDeleteBlogOtpVelidation } from "../validators/blog.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { createBlog, getAllBlogs, getSingleBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog, pinBlog, getMyBlogs, sendDeleteBlogOtp, verifyDeleteBlogOtp } from "../controllers/blog.controller.js";
import { handleUploadErrors } from "../middlewares/fileValidation.middleware.js";
import { getLikedBlogs, toggleLike } from "../controllers/like.controller.js";
import { toggleLikeValidator } from "../validators/like.validator.js";
import { getBookmarkedBlogs, toggleBookmark } from "../controllers/bookmark.controller.js";
import { createCommentValidaotr } from "../validators/comment.validator.js";
import { createComment, getComments } from "../controllers/comment.controller.js";
import otpLimiter from "../middlewares/rateLimit.middleware.js";

const router = express.Router()

router.post(
    "/",
    protectedRoute,
    imageUploader.single("featuredImage"),
    handleUploadErrors,
    createBlogValidator,
    validate,
    createBlog
)

router.get(
    '/',
    protectedRoute,
    getAllBlogs
)

router.get(
    "/my-blogs",
    protectedRoute,
    getMyBlogs
);

router.get(
    '/liked-blogs',
    protectedRoute,
    getLikedBlogs
)

router.get(
    '/bookmarks',
    protectedRoute,
    getBookmarkedBlogs
)

router.patch(
    '/:blogId',
    protectedRoute,
    imageUploader.single("featuredImage"),
    handleUploadErrors,
    updateBlogValidator,
    validate,
    updateBlog
)

router.patch(
    "/:blogId/publish",
    protectedRoute,
    publishBlog
);

router.patch(
    "/:blogId/unpublish",
    protectedRoute,
    unpublishBlog
);

router.delete(
    "/:blogId",
    protectedRoute,
    deleteBlog
)

//Toggle like

router.patch(
    '/:blogId/like',
    protectedRoute,
    toggleLikeValidator,
    validate,
    toggleLike
)


//Blog pinnig
router.patch(
    '/:blogId/pin',
    protectedRoute,
    pinBlog
)


//Toogle Bookmarks

router.post(
    '/:blogId/bookmark',
    protectedRoute,
    toggleBookmark
)


//Handles Comments

router.post(
    '/:blogId/comment',
    protectedRoute,
    createCommentValidaotr,
    validate,
    createComment
)

router.get(
    '/:blogId/comment',
    protectedRoute,
    getComments
)

router.post(
    "/send-delete-blog-otp/:blogId",
    otpLimiter,
    protectedRoute,
    sendDeleteBlogOtp
);

router.post(
    "/verify-delete-blog-otp", 
    verifyDeleteBlogOtpVelidation,
    validate,
    protectedRoute,
    verifyDeleteBlogOtp
);


router.get(
    '/:slug',
    protectedRoute,
    singleBlogValidator,
    validate,
    getSingleBlog
)

const blogRouter = router;
export default blogRouter;