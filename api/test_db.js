import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Testing connection to:", process.env.MONGODB_URI ? "URI Present" : "URI Missing");
try {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "healthvault_ai", serverSelectionTimeoutMS: 5000 });
  console.log("MONGODB CONNECTION SUCCESS");
  await mongoose.disconnect();
} catch (e) {
  console.error("MONGODB CONNECTION FAILURE:", e.message);
}
process.exit(0);
