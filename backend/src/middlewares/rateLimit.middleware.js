import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 3,

    message: "Too many  requests. Please try again later."

});

export default otpLimiter;