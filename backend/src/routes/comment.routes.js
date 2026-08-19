import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { updateCommentValidator } from "../validators/comment.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { deleteComment, hideComment, updateComment, getReplies, pinComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.patch(
    '/:commentId/hide',
    protectedRoute,
    hideComment
);

router.get(
    '/:parentCommentId/replies',
    protectedRoute,
    getReplies
)

router.patch(
    '/:commentId',
    protectedRoute,
    updateCommentValidator,
    validate,
    updateComment
)

router.patch(
    '/:commentId/pin',
    protectedRoute,
    pinComment
)


router.delete(
    '/:commentId',
    protectedRoute,
    deleteComment
)

router.patch(
    '/:commentId/hide',
    protectedRoute,
    hideComment
)







const commentRouter = router;
export default commentRouter;