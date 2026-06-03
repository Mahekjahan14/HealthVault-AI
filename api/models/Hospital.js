import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  totalDoctors: { type: Number, default: 0 },
  totalPatientsAdmitted: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Hospital || mongoose.model("Hospital", HospitalSchema);
