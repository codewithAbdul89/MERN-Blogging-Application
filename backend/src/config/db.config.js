import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo Connected Successfully!");
    } catch (error) {
        console.log("❌ Database connection error : ", error.message);
        throw error;
    }
}

export default connectDB;