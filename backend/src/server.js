import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.config.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Production server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("❌ Critical server bootstrap failed:", error);
    process.exit(1);
  }
};

startServer();
