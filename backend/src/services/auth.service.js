import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const generateAccessToken = (payload) => {
  if (!payload || !payload._id || !payload.email) {
    throw new ApiError(400, "Invalid Payload");
  }

  return jwt.sign(
    { id: payload._id, email: payload.email, role: payload.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
  );
};

export const generateRefreshToken = (payload, rememberMe) => {
  if (!payload || !payload._id) {
    throw new ApiError(400, "Invalid Payload");
  }

  return jwt.sign(
    { id: payload._id, rememberMe },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION },
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};
