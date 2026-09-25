import express from "express";
import { contactEmailValidator } from "../validators/contact.validator.js";
import validate from "../middlewares/validate.middleware.js";
import requestLimiter from "../middlewares/rateLimit.middleware.js";
import { sendContactMessage } from "../controllers/contact.controller.js";

const router = express.Router();

router.post(
  "/",
  contactEmailValidator,
  validate,
  requestLimiter,
  sendContactMessage,
);

const contactRouter = router;

export default contactRouter;
