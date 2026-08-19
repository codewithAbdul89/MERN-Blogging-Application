import { getUser, deleteAccount, updateProfile, updateProfilePicture, removeProfilePicture, sendDeleteAccountOtp, verifyDeleteAccountOtp } from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import express from "express";
import { imageUploader } from "../middlewares/upload.middleware.js";
import { deleteAccountOtpVelidaton, updateProfileValidator } from "../validators/user.validator.js"
import validate from "../middlewares/validate.middleware.js";
import { handleUploadErrors } from "../middlewares/fileValidation.middleware.js";
import otpLimiter from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.get(
    "/me",
    protectedRoute,
    getUser
);
 
router.patch(
    '/update-profile',
    protectedRoute,
    updateProfileValidator,
    validate,
    updateProfile
)


router.patch(
    "/profile-picture",
    protectedRoute,
    imageUploader.single("avatar"),
    handleUploadErrors,
    updateProfilePicture
);

router.delete(
    "/profile-picture",
    protectedRoute,
    removeProfilePicture
);

router.delete(
    '/delete-account',
    protectedRoute,
    deleteAccount
);

router.post(
    "/send-delete-account-otp",
    otpLimiter,
    protectedRoute,
    sendDeleteAccountOtp
)

router.post(
    "/verify-delete-account-otp",
    deleteAccountOtpVelidaton,
    validate,  
    protectedRoute,
    verifyDeleteAccountOtp
);

  

const userRouter = router;

export default userRouter;