import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import commentRouter from "./routes/comment.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import contactRouter from "./routes/contact.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/comment", commentRouter);
app.use("/api/contact", contactRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running.....");
});

// Error handler LAST
app.use(errorHandler);

export default app;
