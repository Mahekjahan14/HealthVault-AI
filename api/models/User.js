import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["patient", "doctor", "admin"], default: "patient" },
  patientId: { type: String, default: "" } // linked Patient document ID if role is patient
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
