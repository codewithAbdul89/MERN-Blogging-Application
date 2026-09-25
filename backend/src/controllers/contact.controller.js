import asyncHandler from "express-async-handler";
import { sendContactEmail } from "../services/email/email.service.js";

export const sendContactMessage = asyncHandler(async (req, res) => {
  const { userName, email, subject, message } = req.body;

  await sendContactEmail({
    userName,
    userEmail: email,
    subject,
    message,
  });

  return res.status(200).json({
    statusCode: 200,
    success: true,
    message:
      "Your message has been sent successfully. We'll get back to you soon.",
  });
});
