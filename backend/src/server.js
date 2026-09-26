import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.config.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🔥 LATEST CODE - DEPLOY TEST 001");
    console.log("🚀 Starting server...");
    console.log("PORT:", PORT);
    console.log("MONGO_URI exists:", Boolean(process.env.MONGO_URI));

    console.log("🔌 Connecting to MongoDB...");
    await connectDB();

    console.log("✅ MongoDB connection completed.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Production server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("❌ Critical server bootstrap failed:", error);
    process.exit(1);
  }
};

startServer();
