import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from "crypto";
import axios from "axios";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../Services/auth.service.js";
import { refreshTokenOptions } from "../Services/cookie.options.js";
import oauthLoginHelper from "../Helper/oauthLoginHelper.js";
import {
  sendloginEmailOtp,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../services/email/email.service.js";
import client from "../services/googleOauth.service.js";
import {
  EMAIL_EXPIRY,
  EMAIL_TOKEN_TYPES,
} from "../constants/email.constants.js";
import {
  generateEmailToken,
  generateEmailOtp,
} from "../utils/generateEmailToken.js";
import EmailToken from "../models/emailToken.model.js";

export const register = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (!existingUser.isEmailVerified) {
      await sendVerificationEmail(existingUser);

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Acoount already registered with this email.Please verify this email only. Verification Email has been sent successfuly on email.",
          ),
        );
    }

    throw new ApiError(400, "User already registered with this email.");
  }

  const user = await User.create({
    userName,
    email,
    password,
  });

  const createdUser = user.toObject();
  delete createdUser.password;

  const { rawToken, hashedToken } = generateEmailToken();

  await EmailToken.deleteMany({
    userId: user._id,
    type: EMAIL_TOKEN_TYPES.VERIFY_EMAIL,
  });

  const expiresAt = new Date(Date.now() + EMAIL_EXPIRY.VERIFY_EMAIL);

  await EmailToken.create({
    userId: user._id,
    token: hashedToken,
    type: EMAIL_TOKEN_TYPES.VERIFY_EMAIL,
    expiresAt,
  });

  await sendVerificationEmail(user, rawToken);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "A verification email has been sent to your email address. Please verify your email first. Also, check your spam folder if you don't see it in your inbox.",
      ),
    );
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified.So login.");
  }

  // Prevent requesting a new email too frequently (1 minute cooldown)
  const existingToken = await EmailToken.findOne({
    userId: user._id,
    type: EMAIL_TOKEN_TYPES.VERIFY_EMAIL,
  });

  if (
    existingToken &&
    existingToken.createdAt > new Date(Date.now() - 60 * 1000)
  ) {
    throw new ApiError(
      429,
      "Please wait 1 minute before requesting another verification email.",
    );
  }

  // Remove previous verification tokens
  await EmailToken.deleteMany({
    userId: user._id,
    type: EMAIL_TOKEN_TYPES.VERIFY_EMAIL,
  });

  const { rawToken, hashedToken } = generateEmailToken();

  const expiresAt = new Date(Date.now() + EMAIL_EXPIRY.VERIFY_EMAIL);

  await EmailToken.create({
    userId: user._id,
    token: hashedToken,
    type: EMAIL_TOKEN_TYPES.VERIFY_EMAIL,
    expiresAt,
  });

  await sendVerificationEmail(user, rawToken);

  return res
    .status(200)
    .json(new ApiResponse(200, "Verification email sent successfully."));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Verification token is required.");
  }

  // Hash the incoming token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find the verification token
  const matchedToken = await EmailToken.findOne({
    token: hashedToken,
    type: EMAIL_TOKEN_TYPES.VERIFY_EMAIL,
  });

  if (!matchedToken) {
    throw new ApiError(400, "Verification failed because link does not match.");
  }

  if (matchedToken.expiresAt < new Date()) {
    await EmailToken.findByIdAndDelete(matchedToken._id);
    throw new ApiError(400, "Verification token expired");
  }

  // Verify email in a single database query
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: matchedToken.userId,
      isEmailVerified: false,
    },
    {
      $set: {
        isEmailVerified: true,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password");

  // If  document was not updated
  if (!updatedUser) {
    const user = await User.findById(matchedToken.userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // User is already verified
    if (user.isVerified) {
      await EmailToken.findByIdAndDelete(matchedToken._id);

      throw new ApiError(400, "Email is already verified.So login.");
    }
  }

  // Remove verification token after successful verification
  await EmailToken.findByIdAndDelete(matchedToken._id);

  await sendWelcomeEmail(updatedUser);

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified successfully."));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe = false } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "Invalid Email or password");
  }

  if (!user.password) {
    throw new ApiError(
      400,
      "This account does not have a password. Please use email login or your social login.",
    );
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    throw new ApiError(400, "Invalid Email or password");
  }

  if (!user.isEmailVerified) {
    await sendVerificationEmail(user);
    throw new ApiError(
      400,
      "Please verify this email first. Verification email has been sent successfully.",
      "EMAIL_NOT_VERIFIED",
    );
  }

  const refreshToken = generateRefreshToken(user, rememberMe);
  const accessToken = generateAccessToken(user);

  res.cookie("refreshToken", refreshToken, refreshTokenOptions(rememberMe));

  return res.status(200).json(
    new ApiResponse(200, `Welcome ${user.userName}`, {
      user,
      accessToken,
    }),
  );
});

export const sendLoginEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "If an account with this email exists, a verification email has been sent.Please also check your spam email folder.",
        ),
      );
  }

  await EmailToken.deleteMany({
    userId: user._id,
    type: EMAIL_TOKEN_TYPES.LOGIN_EMAIL,
  });

  const { rawOtp, hashedOtp } = generateEmailOtp();

  const expiresAt = new Date(Date.now() + EMAIL_EXPIRY.LOGIN_EMAIL);

  await EmailToken.create({
    userId: user._id,
    token: hashedOtp,
    type: EMAIL_TOKEN_TYPES.LOGIN_EMAIL,
    expiresAt,
  });

  await sendloginEmailOtp(user.userName, user.email, rawOtp);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "If an account with this email exists, a verification email has been sent.Please also check your spam email folder.",
      ),
    );
});

export const verifyLoginEmailtOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const token = await EmailToken.findOne({
    type: EMAIL_TOKEN_TYPES.LOGIN_EMAIL,
    token: hashedOtp,
  }).populate("userId");

  if (!token) {
    throw new ApiError(400, "Invalid OTP.");
  }

  if (token.expiresAt < new Date()) {
    await EmailToken.findByIdAndDelete(token._id);
    throw new ApiError(400, "OTP expired.");
  }

  const userId = token.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // remove OTP after success (ONE TIME USE)
  await EmailToken.findByIdAndDelete(token._id);

  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);

  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      ` OTP verified successfully.Welcome ${user.userName}`,
      {
        user,
        accessToken,
      },
    ),
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "If an account with this email exists, a verification email has been sent.Please also check your spam email folder.",
        ),
      );
  }

  if (!user.password) {
    throw new ApiError(
      400,
      "This account does not have a password. Please use email login or your social login.",
    );
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email first.");
  }

  await EmailToken.deleteMany({
    userId: user._id,
    type: EMAIL_TOKEN_TYPES.RESET_PASSWORD,
  });

  const expiresAt = new Date(Date.now() + EMAIL_EXPIRY.RESET_PASSWORD);

  const { rawToken, hashedToken } = generateEmailToken();

  await EmailToken.create({
    userId: user._id,
    token: hashedToken,
    type: EMAIL_TOKEN_TYPES.RESET_PASSWORD,
    expiresAt,
  });

  await sendResetPasswordEmail(user, rawToken);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "If an account with this email exists, a verification email has been sent.Please also check your spam email folder.",
      ),
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  const { token } = req.params;

  if (!newPassword) {
    throw new ApiError(400, "New Password is required.");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const matchedToken = await EmailToken.findOne({
    token: hashedToken,
    type: EMAIL_TOKEN_TYPES.RESET_PASSWORD,
  });

  if (!matchedToken) {
    throw new ApiError(400, "Invalid or expired password reset Link.");
  }

  if (matchedToken.expiresAt < new Date()) {
    await EmailToken.findByIdAndDelete(matchedToken._id);

    throw new ApiError(400, "Reset link has expired.");
  }

  const user = await User.findById(matchedToken.userId).select("+password");

  if (!user) {
    await EmailToken.findByIdAndDelete(matchedToken._id);

    throw new ApiError(404, "User not found.");
  }

  user.password = newPassword;
  await user.save();

  await EmailToken.deleteMany({
    userId: user._id,
    type: EMAIL_TOKEN_TYPES.RESET_PASSWORD,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Password reset successful. Please log in with your new password.",
      ),
    );
});

export const googleLogin = asyncHandler(async (req, res) => {
  //This automatically generates the Google OAuth URL like https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile

  const url = client.generateAuthUrl({
    access_type: "offline", //This tell that we want to get a refresh token as well
    //This is the scopes we want to access from the user's Google account. In this case, we want to access the user's email and profile information.
    scope: [
      "openid", //"Authenticate this user and tell me who they are."
      "email",
      "profile",
    ],
  });

  return res.redirect(url);
});

export const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    throw new ApiError(400, "Authorization code is required");
  }

  const { tokens } = await client.getToken(code);

  client.setCredentials(tokens);

  const response = await client.request({
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
  });

  const { email, name, picture, email_verified } = response.data;

  if (!email) {
    throw new ApiError(400, "Google account has no email");
  }

  if (!email_verified) {
    throw new ApiError(400, "Email is not verified by Google");
  }

  const { refreshToken } = await oauthLoginHelper({
    email,
    userName: name,
    picture,
    provider: "google",
  });

  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return res.redirect(`${process.env.FRONTEND_URL}/oauth/success`);
});

export const githubLogin = asyncHandler(async (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;

  res.redirect(url);
});

export const githubCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) {
    throw new ApiError(400, "Authorization code is required");
  }

  const tokenResponse = await axios.post(
    "https://github.com/login/oauth/access_token",

    {
      client_id: process.env.GITHUB_CLIENT_ID,

      client_secret: process.env.GITHUB_CLIENT_SECRET,

      code,
    },

    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  const githubAccessToken = tokenResponse.data.access_token;

  if (!githubAccessToken) {
    throw new ApiError(400, "Failed to obtain GitHub access token.");
  }

  const userResponse = await axios.get(
    "https://api.github.com/user",

    {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
      },
    },
  );

  const githubUser = userResponse.data;

  const emailResponse = await axios.get(
    "https://api.github.com/user/emails",

    {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
      },
    },
  );

  const primaryEmail = emailResponse.data.find(
    (email) => email.primary && email.verified,
  );

  if (!primaryEmail) {
    throw new ApiError(
      400,
      "No verified primary email found for the GitHub user.",
    );
  }

  const { refreshToken } = await oauthLoginHelper({
    email: primaryEmail.email,
    userName: githubUser.login,
    picture: githubUser.avatar_url,
    provider: "github",
  });

  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return res.redirect(`${process.env.FRONTEND_URL}/oauth/success`);
});

export const logout = asyncHandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, "Please sign in again.");

  const decoded = verifyRefreshToken(token);

  const user = await User.findById(decoded.id);

  if (!user) throw new ApiError(404, "User not found. Please sign in again.");
  const rememberMe = decoded.rememberMe;

  const newRefreshToken = generateRefreshToken(user, rememberMe);
  const newAccessToken = generateAccessToken(user);

  res.cookie("refreshToken", newRefreshToken, refreshTokenOptions(rememberMe));

  return res.status(200).json(
    new ApiResponse(200, "Token refresh successfully", {
      accessToken: newAccessToken,
    }),
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { previousPassword, newPassword } = req.body;

  if (newPassword === previousPassword)
    throw new ApiError(
      400,
      "New password should be different from old password.",
    );

  const user = await User.findById(req.user._id).select("+password");

  if (!user) throw new ApiError(404, "User not found");

  const matchedPassword = await bcrypt.compare(previousPassword, user.password);

  if (!matchedPassword) throw new ApiError(400, "Your previous  password is incorrect.");

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password change successfully.Please login again."));
});
