import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./Routes/auth.routes.js";
import blogRouter from "./Routes/blog.routes.js";
import userRouter from "./Routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import commentRouter from "./routes/comment.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// TODO: Remove the Origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    //   origin: "http://192.168.1.5:5173",
    credentials: true,
  }),
);

app.use(express.static("public"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/comment", commentRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running.....");
});

// Error handler LAST
app.use(errorHandler);

export default app;
