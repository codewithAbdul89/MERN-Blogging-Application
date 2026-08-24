import express from "express"
import {
    login, signup, refreshToken, changePassword,
    githubCallback, githubLogin, googleCallback, googleLogin,
    logout,
    resendVerificationEmail,
    forgotPassword,
    verifyEmail,
    resetPassword,
    sendLoginEmailOtp,
    verifyLoginEmailtOtp
} from '../controllers/auth.controller.js'
import { signupValidation, loginValidation, changePasswordValidator, EmailValidator, forgotPasswordValidator, resetPasswordValidator, loginAccountOtpVelidaton } from "../validators/auth.validator.js"
import validate from "../middlewares/validate.middleware.js"
import { protectedRoute } from '../middlewares/auth.middleware.js'
import otpLimiter from "../middlewares/rateLimit.middleware.js"


const router = express.Router()

router.post(
    "/signup",
    signupValidation,
    validate,
    signup
);

router.post( 
    '/logout',
    logout
);

router.post(
    "/resend-verification-email",
    otpLimiter,
    EmailValidator,
    validate, 
    resendVerificationEmail
);

router.post(
    "/forgot-password",
    otpLimiter,
    forgotPasswordValidator,
    validate,
    forgotPassword
);

router.post(
    "/send-email-login-otp",
    otpLimiter,
    EmailValidator,
    validate,
    sendLoginEmailOtp
)

router.post(
    "/verify-email-login-otp",
    loginAccountOtpVelidaton,
    validate,  
    verifyLoginEmailtOtp
);


router.get(
    "/google",
    googleLogin
);

router.get(
    "/google/callback",
    googleCallback
);

router.get(
    "/github",
    githubLogin
);

router.get(
    "/github/callback",
    githubCallback
);

router.post(
    "/login",
    loginValidation,
    validate,
    login
);

router.post(
    "/refresh-token",
    refreshToken
);

router.patch(
    "/change-password",
    protectedRoute,
    changePasswordValidator,
    validate,
    changePassword
);


router.post(
    "/verify-email/:token",
    verifyEmail
);

router.post(
    "/reset-password/:token",
    resetPasswordValidator,
    validate,
    resetPassword
)
const authRouter = router;
export default authRouter;