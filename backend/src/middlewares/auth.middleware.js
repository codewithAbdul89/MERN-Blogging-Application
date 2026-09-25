import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../Services/auth.service.js";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    req.user = null;
    const authHeader = req.header("Authorization");

    const token =
      req.cookies.accessToken ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return next(new ApiError(401, "Not authorized,token missing"));
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ApiError(401, "User not found or Token Invalid"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    req.user = null;

    const authHeader = req.header("Authorization");

    const token =
      req.cookies.accessToken ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    // No token = guest
    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-password");

    // Invalid user/token = treat as guest
    if (!user) {
      return next();
    }

    req.user = user;

    next();
  } catch (error) {
    // Invalid/expired token = treat as guest
    next();
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: Not allowed"));
    }
    next();
  };
};
