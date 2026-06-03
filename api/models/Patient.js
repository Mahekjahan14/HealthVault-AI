import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, default: "Visit" },
  description: { type: String, default: "" },
  source: { type: String, default: "Manual" },
  hospitalName: { type: String, default: "" },
  doctorName: { type: String, default: "" },
  symptoms: { type: String, default: "" },
  diagnosis: { type: String, default: "" },
  medicines: { type: [String], default: [] },
  notes: { type: String, default: "" },
  reportTitle: { type: String, default: "" },
  reportUrl: { type: String, default: "" }
}, { _id: true });

const ReportSchema = new mongoose.Schema({
  title: String,
  type: String,
  uploadedAt: String,
  extractedText: String,
  aiExplanation: String,
  findings: [String]
}, { _id: true });

const AppointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  doctorName: { type: String, required: true },
  hospitalName: { type: String, required: true },
  reason: { type: String, default: "" },
  status: { type: String, default: "Scheduled" }
}, { _id: true });

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  dob: String,
  age: Number,
  gender: String,
  bloodGroup: String,
  emergencyContact: String,
  diseases: [String],
  allergies: [String],
  surgeries: [String],
  medications: [String],
  vaccinations: [String],
  familyHistory: [String],
  visits: [TimelineSchema],
  reports: [ReportSchema],
  appointments: [AppointmentSchema],
  notes: [String]
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
