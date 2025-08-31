import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URL + process.env.DB_NAME);
        console.log("MongoDB connected successfully.", connected.connection.host);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;
