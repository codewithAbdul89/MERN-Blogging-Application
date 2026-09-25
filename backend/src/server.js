import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import "./cron/deleteHiddenComments.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Production server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("❌ Critical server bootstrap failed:", error);
    process.exit(1);
  }
};

startServer();
