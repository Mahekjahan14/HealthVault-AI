import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return true;
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI missing. Running in demo memory mode.");
    return false;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "healthvault_ai" });
    isConnected = true;
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return false;
  }
}
