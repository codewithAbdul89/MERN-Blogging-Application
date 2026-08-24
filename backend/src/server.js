import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import User from "./models/user.model.js";
import "./cron/deleteHiddenComments.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Build Mongoose indexes safely before listening to requests
    await User.syncIndexes();

    app.listen(PORT, () => {
      // TODO:Remove the port 0,0,0,0
      // app.listen(PORT,"0.0.0.0",  () => {
      console.log(`Production server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("❌ Critical server bootstrap failed:", error);
    process.exit(1);
  }
};

startServer();
