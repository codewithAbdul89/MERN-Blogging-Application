import {
  generateEmailToken,
  generateEmailOtp,
} from "../../utils/generateEmailToken.js";
import {
  deleteAccountOtpTemplate,
  deleteBlogOtpTemplate,
  verificationEmailTemplate,
  resetPasswordTemplate,
  welcomeEmailTemplate,
  loginOtpTemplate,
} from "./emailTemplates.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { sendEmail } from "./sendEmail.js";
import EmailToken from "../../models/emailToken.model.js";

export const sendWelcomeEmail = async (user) => {
  const html = welcomeEmailTemplate({ userName: user.userName });

  try {
    await sendEmail({
      to: user.email,
      subject: "Welcome to our platform.",
      html,
    });
  } catch (error) {
    throw new ApiError(500, error.message || "Internal server error.");
  }
};

export const sendVerificationEmail = async (user, rawToken) => {
  const verificationLink = `${process.env.FRONTEND_URL}/register/verify-email/${rawToken}`;

  const html = verificationEmailTemplate({
    userName: user.userName,
    verificationLink,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html,
    });
  } catch (error) {
    await EmailToken.deleteMany({
      userId: user._id,
      type: EMAIL_TOKEN_TYPES.VERIFY_EMAIL,
    });

    throw new ApiError(500, "Failed to send verification email.");
  }
};

export const sendResetPasswordEmail = async (user, rawToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

  const html = resetPasswordTemplate({
    userName: user.userName,
    resetLink,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html,
    });
  } catch (error) {
    await EmailToken.deleteMany({
      userId: user._id,
      type: EMAIL_TOKEN_TYPES.RESET_PASSWORD,
    });

    throw new ApiError(500, "Failed to send reset email.");
  }
};

export const sendDeleteBlogOtpEmail = async (user, blog, otp) => {
  const html = deleteBlogOtpTemplate({
    userName: user.userName,
    blogTitle: blog.title,
    category: blog.category.name,
    otp,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Delete Blog OTP",
      html,
    });
  } catch (error) {
    throw new ApiError(500, error.message || "Internal server error.");
  }
};

export const sendDeleteAccountOtpEmail = async (user, otp) => {
  const html = deleteAccountOtpTemplate({
    userName: user.userName,
    otp,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Delete Account Verification OTP",
      html,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to send delete account OTP.");
  }
};

export const sendloginEmailOtp = async (userName, email, otp) => {

  const html = loginOtpTemplate({
    userName,
    otp,
  });

  try {
    await sendEmail({
      to: email,
      subject: "Login Email Verification OTP",
      html,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to send login email OTP.");
  }
};
