import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 3,

  handler: () => {
    throw new ApiError(429,
         "Too many requests. Please try again later.");
  },
});

export default otpLimiter;
