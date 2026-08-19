import { generateEmailToken, generateEmailOtp } from "../../utils/generateEmailToken.js"
import { deleteAccountOtpTemplate, deleteBlogOtpTemplate, verificationEmailTemplate, resetPasswordTemplate, welcomeEmailTemplate } from "./emailTemplates.js"
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { sendEmail } from "./sendEmail.js"


export const sendWelcomeEmail = async (user) => {

    const html = welcomeEmailTemplate({ userName: user.userName });

    try {
        await sendEmail({
            to: user.email,
            subject: "Welcome to our platform.",
            html
        });
    } catch (error) {
        throw new ApiError(
            500,
            error.message || "Internal server error."
        )
    }

};

export const sendVerificationEmail = async (user, rawToken) => {

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

    const html = verificationEmailTemplate({
        userName: user.userName,
        verificationLink
    });

    try {

        await sendEmail({
            to: user.email,
            subject: "Verify Your Email",
            html
        });

    } catch (error) {

        await EmailToken.deleteMany({
            userId: user._id,
            type: EMAIL_TOKEN_TYPES.VERIFY_EMAIL
        });

        throw new ApiError(
            500,
            "Failed to send verification email."
        );
    };

};

export const sendResetPasswordEmail = async (user, rawToken) => {

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    const html = resetPasswordTemplate(
        {
            userName: user.userName,
            resetLink
        }
    );

    try {
        await sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html
        })
    } catch (error) {

        await EmailToken.deleteMany({
            userId: user._id,
            type: EMAIL_TOKEN_TYPES.RESET_PASSWORD
        });

        throw new ApiError(
            500,
            "Failed to send reset email."
        );
    }
};

export const sendDeleteBlogOtpEmail = async (user, blog, rawOtp) => {

    const html = deleteBlogOtpTemplate({
        userName: user.userName,
        blogTitle: blog.title,
        category: blog.category.name,
        otp: rawOtp
    });

    try {
        await sendEmail({
            to: user.email,
            subject: "Delete Blog OTP",
            html
        })
    } catch (error) {
        throw new ApiError(
            500,
            error.message || "Internal server error."
        )
    }
};

export const sendDeleteAccountOtpEmail = async (user, rawOtp) => {

    const html = deleteAccountOtpTemplate({
        userName: user.userName,
        otp: rawOtp
    })

    try {
        await sendEmail({
            to: user.email,
            subject: "Delete Account Verification OTP",
            html
        })

    } catch (error) {

        throw new ApiError(
            500,
            "Failed to send delete account OTP."
        );

    };
};

