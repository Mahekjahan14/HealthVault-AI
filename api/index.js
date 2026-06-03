import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
import express from "express";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import { nanoid } from "nanoid";
import { connectDB } from "./services/db.js";
import Patient from "./models/Patient.js";
import User from "./models/User.js";
import Hospital from "./models/Hospital.js";
import { demoPatients, demoUsers, demoHospitals } from "./utils/demoStore.js";
import { askGroq } from "./services/groq.js";
import { analyzeMedicalFile } from "./services/ocr.js";
import { evaluateAIOutput } from "./services/evaluator.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));

// ─── Authentication & Authorization Role-Based Guards ────────────────────────
const roleGuard = (req, res, next) => {
  const role = req.headers["x-user-role"];
  const patientId = req.headers["x-user-patient-id"];
  
  // Extract patient ID from path if present (e.g. /api/patients/HVAI-XXXXXX)
  const pathParts = req.path.split("/");
  const patientsIndex = pathParts.indexOf("patients");
  const id = (patientsIndex !== -1 && pathParts[patientsIndex + 1]) ? pathParts[patientsIndex + 1] : null;

  if (!role) {
    return next();
  }

  // 1. Patient constraints
  if (role === "patient") {
    // Patients can only access their own patientId
    if (id && id !== patientId) {
      return res.status(403).json({ message: "Access Denied: Patients can only access their own records." });
    }
    
    // Patients cannot access list of all patients
    if (req.path === "/api/patients" && req.method === "GET") {
      return res.status(403).json({ message: "Access Denied: Patients cannot view the patient directory." });
    }

    // Patients cannot create patient profiles
    if (req.path === "/api/patients" && req.method === "POST") {
      return res.status(403).json({ message: "Access Denied: Patients cannot create patient accounts." });
    }

    // Patients cannot modify clinical history, copilot, or admin logs
    const isRestrictedPath = req.path.includes("/history") || 
                            req.path.includes("/copilot");
    if (isRestrictedPath) {
      return res.status(403).json({ message: "Access Denied: Patients cannot edit clinical records or use Doctor Copilot." });
    }
  }

  // 2. Doctor constraints
  if (role === "doctor") {
    // Doctors cannot delete patient accounts
    if (req.method === "DELETE" && id && req.path === `/api/patients/${id}`) {
      return res.status(403).json({ message: "Access Denied: Doctors cannot delete patient accounts." });
    }

    // Doctors cannot use triage assistant
    if (req.path.includes("/triage")) {
      return res.status(403).json({ message: "Access Denied: Triage assistant is restricted to patients." });
    }
  }

  // 3. Admin constraints
  if (role === "admin") {
    // Admins cannot modify clinical records, upload reports, use copilot, triage, or schedule appointments
    const isClinicalWrite = req.path.includes("/history") || 
                            req.path.includes("/reports") || 
                            req.path.includes("/summary") || 
                            req.path.includes("/triage") || 
                            req.path.includes("/copilot") ||
                            req.path.includes("/appointments");
    
    if (isClinicalWrite && req.method !== "GET") {
      return res.status(403).json({ message: "Access Denied: Admins cannot write or edit clinical records or appointments." });
    }
  }

  next();
};

const adminGuard = (req, res, next) => {
  const role = req.headers["x-user-role"];
  if (role && role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Administrative role permissions required." });
  }
  next();
};

app.use(roleGuard);

let isSeedingCompleted = false;
const seedDatabase = async () => {
  if (isSeedingCompleted) return;
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding demo users into MongoDB...");
      await User.insertMany(demoUsers);
    }

    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      console.log("Seeding demo patients into MongoDB...");
      await Patient.insertMany(demoPatients);
    }

    const hospitalCount = await Hospital.countDocuments();
    if (hospitalCount === 0) {
      console.log("Seeding demo hospitals into MongoDB...");
      await Hospital.insertMany(demoHospitals);
    }
    isSeedingCompleted = true;
  } catch (err) {
    console.error("Database seeding failed:", err);
  }
};

const withDb = async () => {
  const db = await connectDB();
  if (db && !isSeedingCompleted) {
    await seedDatabase();
  }
  return db;
};
const today = () => new Date().toISOString().slice(0, 10);
const findDemo = (id) => demoPatients.find(p => p.patientId === id);

app.get("/api/health", (req, res) => res.json({ ok: true, app: "HealthVault AI", time: new Date().toISOString() }));

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email/ID and password are required" });
    }

    const db = await withDb();
    let user = null;
    const identifier = email.trim();

    if (db) {
      if (identifier.includes("@")) {
        user = await User.findOne({ email: new RegExp(`^${identifier}$`, "i") });
      } else {
        user = await User.findOne({ patientId: new RegExp(`^${identifier}$`, "i") });
      }
    }
    
    // Check fallback demo users if not found in db
    if (!user) {
      user = demoUsers.find(u => 
        (identifier.includes("@") && u.email.toLowerCase() === identifier.toLowerCase()) ||
        (!identifier.includes("@") && u.patientId && u.patientId.toLowerCase() === identifier.toLowerCase())
      );
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email/ID or password credentials" });
    }

    res.json({
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        patientId: user.patientId || ""
      },
      token: "demo-session-token-" + nanoid(10)
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/auth/register", adminGuard, async (req, res, next) => {
  try {
    const { email, password, name, role, patientId } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Missing required fields for registration" });
    }

    const db = await withDb();
    const newUser = { email, password, name, role, patientId: patientId || "" };

    if (!db) {
      const exists = demoUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) return res.status(400).json({ message: "User email already registered" });
      demoUsers.push(newUser);
      return res.status(201).json({ message: "User registered successfully", user: newUser });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User email already registered" });

    const created = await User.create(newUser);
    res.status(201).json({ message: "User registered successfully", user: created });
  } catch (err) {
    next(err);
  }
});

app.post("/api/auth/register-patient", async (req, res, next) => {
  try {
    const { email, password, name, age, gender, bloodGroup, emergencyContact } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password and name are required." });
    }

    const db = await withDb();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    if (db) {
      const exists = await User.findOne({ email: new RegExp(`^${normalizedEmail}$`, "i") });
      if (exists) return res.status(400).json({ message: "Email already registered" });
    } else {
      const exists = demoUsers.some(u => u.email.toLowerCase() === normalizedEmail);
      if (exists) return res.status(400).json({ message: "Email already registered" });
    }

    const patientId = `HVAI-${nanoid(6).toUpperCase()}`;

    const newPatient = {
      patientId,
      name,
      email: normalizedEmail,
      age: Number(age) || 0,
      gender: gender || "Female",
      bloodGroup: bloodGroup || "O+",
      emergencyContact: emergencyContact || "",
      diseases: [],
      allergies: [],
      medications: [],
      visits: [],
      reports: [],
      appointments: []
    };

    const newUser = {
      email: normalizedEmail,
      password,
      name,
      role: "patient",
      patientId
    };

    if (!db) {
      demoPatients.unshift(newPatient);
      demoUsers.push(newUser);
      return res.status(201).json({
        message: "Patient registered successfully",
        user: newUser,
        patient: newPatient
      });
    }

    const savedPatient = await Patient.create(newPatient);
    const createdUser = await User.create(newUser);

    res.status(201).json({
      message: "Patient registered successfully",
      user: {
        email: createdUser.email,
        role: createdUser.role,
        name: createdUser.name,
        patientId: createdUser.patientId
      },
      patient: savedPatient
    });
  } catch (err) {
    next(err);
  }
});

// Admin Panel endpoints
app.get("/api/admin/stats", adminGuard, async (req, res, next) => {
  try {
    const db = await withDb();
    
    let totalPatients = demoPatients.length;
    let totalVisits = demoPatients.reduce((acc, p) => acc + (p.visits?.length || 0), 0);
    let totalReports = demoPatients.reduce((acc, p) => acc + (p.reports?.length || 0), 0);
    let totalDoctors = 5; // Static/dynamic demo value
    let safetyScore = 98.2;

    if (db) {
      totalPatients = await Patient.countDocuments();
      const allPatients = await Patient.find();
      totalVisits = allPatients.reduce((acc, p) => acc + (p.visits?.length || 0), 0);
      totalReports = allPatients.reduce((acc, p) => acc + (p.reports?.length || 0), 0);
      const docCount = await User.countDocuments({ role: "doctor" });
      if (docCount > 0) totalDoctors = docCount;
      
      // Calculate real safety score average if evaluations exist
      const evals = allPatients.flatMap(p => p.reports || []).map(r => r.evaluation?.confidenceScore).filter(score => score !== undefined);
      if (evals.length > 0) {
        safetyScore = evals.reduce((a, b) => a + b, 0) / evals.length;
      }
    }

    res.json({
      totalPatients,
      totalDoctors,
      totalVisits,
      totalReports,
      safetyScore: parseFloat(safetyScore.toFixed(1)),
      recentActivity: [
        { id: 1, action: "Patient report processed via Gemini OCR", time: "5 mins ago", status: "Verified" },
        { id: 2, action: "New hospital visit logged by Dr. Jenkins", time: "1 hour ago", status: "Completed" },
        { id: 3, action: "AI accuracy evaluation check passed", time: "2 hours ago", status: "98% Match" }
      ]
    });
  } catch (err) {
    next(err);
  }
});

app.get("/api/admin/users", adminGuard, async (req, res, next) => {
  try {
    const db = await withDb();
    if (!db) {
      return res.json(demoUsers);
    }
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/admin/users/:email", adminGuard, async (req, res, next) => {
  try {
    const db = await withDb();
    const { email } = req.params;
    if (!db) {
      const idx = demoUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (idx === -1) return res.status(404).json({ message: "User not found" });
      demoUsers.splice(idx, 1);
      return res.json({ message: "User deleted successfully" });
    }
    const deleted = await User.findOneAndDelete({ email });
    deleted ? res.json({ message: "User deleted successfully" }) : res.status(404).json({ message: "User not found" });
  } catch (err) {
    next(err);
  }
});

app.get("/api/patients", async (req, res, next) => {
  try {
    const db = await withDb();
    if (!db) return res.json(demoPatients);
    const patients = await Patient.find().sort({ createdAt: -1 });
    if (!patients.length) return res.json(demoPatients);
    res.json(patients);
  } catch (err) {
    next(err);
  }
});

app.post("/api/patients", adminGuard, async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload.name || !payload.email) return res.status(400).json({ message: "Name and email are required" });
    const patient = { ...payload, patientId: `HVAI-${nanoid(6).toUpperCase()}`, visits: payload.visits || [], reports: [] };
    const db = await withDb();
    if (!db) {
      demoPatients.unshift(patient);
      return res.status(201).json(patient);
    }
    const saved = await Patient.create(patient);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

app.get("/api/patients/:id", async (req, res, next) => {
  try {
    const db = await withDb();
    if (!db) {
      const p = findDemo(req.params.id);
      return p ? res.json(p) : res.status(404).json({ message: "Patient not found" });
    }
    const patient = await Patient.findOne({ patientId: req.params.id });
    patient ? res.json(patient) : res.status(404).json({ message: "Patient not found" });
  } catch (err) {
    next(err);
  }
});

app.post("/api/patients/:id/history", async (req, res, next) => {
  try {
    const payload = req.body;
    let medsArray = [];
    if (payload.medicines) {
      medsArray = Array.isArray(payload.medicines)
        ? payload.medicines
        : payload.medicines.split(",").map(m => m.trim()).filter(Boolean);
    }

    const item = {
      date: payload.date || today(),
      title: payload.title || "Hospital Visit",
      type: payload.type || "Visit",
      description: payload.description || `Visit to ${payload.hospitalName || "Hospital"} by Dr. ${payload.doctorName || "Unknown"}. Diagnosis: ${payload.diagnosis || "N/A"}.`,
      source: payload.source || "Hospital Visit Flow",
      hospitalName: payload.hospitalName || "",
      doctorName: payload.doctorName || "",
      symptoms: payload.symptoms || "",
      diagnosis: payload.diagnosis || "",
      medicines: medsArray,
      notes: payload.notes || "",
      reportTitle: payload.reportTitle || "",
      reportUrl: payload.reportUrl || ""
    };

    const db = await withDb();
    if (!db) {
      const p = findDemo(req.params.id);
      if (!p) return res.status(404).json({ message: "Patient not found" });
      
      p.visits.unshift({ ...item, _id: nanoid(6) });
      if (medsArray.length > 0) {
        p.medications = [...new Set([...(p.medications || []), ...medsArray])];
      }
      return res.json(p);
    }

    const updateObject = {
      $push: { visits: { $each: [item], $position: 0 } }
    };
    if (medsArray.length > 0) {
      updateObject.$addToSet = { medications: { $each: medsArray } };
    }

    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      updateObject,
      { new: true }
    );
    patient ? res.json(patient) : res.status(404).json({ message: "Patient not found" });
  } catch (err) {
    next(err);
  }
});

app.post("/api/patients/:id/summary", async (req, res, next) => {
  try {
    const db = await withDb();
    const patient = db ? await Patient.findOne({ patientId: req.params.id }) : findDemo(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    const prompt = `Create a concise clinical history summary for doctor review. Patient JSON: ${JSON.stringify(patient)}`;
    const summary = await askGroq({ task: "summary", patient, prompt });
    
    // Evaluate summary
    const evaluation = await evaluateAIOutput({ patient, task: "summary", output: summary, context: prompt });
    res.json({ summary, evaluation });
  } catch (err) {
    next(err);
  }
});

app.post("/api/patients/:id/triage", async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ message: "Symptoms are required" });
    const db = await withDb();
    const patient = db ? await Patient.findOne({ patientId: req.params.id }) : findDemo(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    const prompt = `Patient history: ${JSON.stringify(patient)}. Symptoms: ${symptoms}. Return only JSON: {"riskLevel":"Low|Medium|High","specialist":"string","advice":"string","reasoning":"string"}. Include safety disclaimer.`;
    const triage = await askGroq({ task: "triage", patient, prompt, extra: { symptoms } });
    
    // Evaluate triage
    const evalInput = `Risk Level: ${triage.riskLevel || "N/A"}. Specialist: ${triage.specialist || "N/A"}. Advice: ${triage.advice || "N/A"}. Reasoning: ${triage.reasoning || "N/A"}.`;
    const evaluation = await evaluateAIOutput({ patient, task: "triage", output: evalInput, context: { symptoms } });
    res.json({ ...triage, evaluation });
  } catch (err) {
    next(err);
  }
});

app.post("/api/patients/:id/copilot", async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Question is required" });
    const db = await withDb();
    const patient = db ? await Patient.findOne({ patientId: req.params.id }) : findDemo(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // --- Keyword-based RAG Retrieval ---
    const stopWords = new Set(["has", "this", "patient", "had", "have", "been", "ever", "show", "summarize", "history", "previous", "what", "is", "are", "the", "and", "for", "with", "any", "before", "did"]);
    const queryWords = question.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
    
    const matches = [];
    
    patient.diseases?.forEach(d => {
      if (queryWords.some(w => d.toLowerCase().includes(w))) matches.push(`Chronic Disease: ${d}`);
    });
    patient.allergies?.forEach(a => {
      if (queryWords.some(w => a.toLowerCase().includes(w))) matches.push(`Allergy: ${a}`);
    });
    patient.surgeries?.forEach(s => {
      if (queryWords.some(w => s.toLowerCase().includes(w))) matches.push(`Surgery: ${s}`);
    });
    patient.medications?.forEach(m => {
      if (queryWords.some(w => m.toLowerCase().includes(w))) matches.push(`Active Medication: ${m}`);
    });
    patient.visits?.forEach(v => {
      const text = `${v.title} ${v.description} ${v.diagnosis} ${v.hospitalName} ${v.notes}`.toLowerCase();
      if (queryWords.some(w => text.includes(w))) {
        matches.push(`History Visit (${v.date}): Title: ${v.title} | Diagnosis: ${v.diagnosis || "N/A"} | Notes: ${v.notes || "N/A"}`);
      }
    });

    const retrievedContext = matches.length > 0 
      ? matches.join("\n") 
      : "No direct matching clinical history logs found for query keywords.";

    const prompt = `You are a clinical copilot. Answer the doctor's query strictly using the following retrieved records from the patient's history. Do not invent any facts. If the retrieved records do not contain enough information to answer the question, state: "Not enough information available."

Patient Name: ${patient.name}
Patient ID: ${patient.patientId}

Retrieved Records (RAG context):
${retrievedContext}

Doctor Query: ${question}`;

    const answer = await askGroq({ task: "copilot", patient, prompt, extra: { question } });
    
    // Evaluate copilot answer
    const evaluation = await evaluateAIOutput({ patient, task: "copilot", output: answer, context: { question, retrievedContext } });
    res.json({ answer, evaluation });
  } catch (err) {
    next(err);
  }
});

app.post("/api/patients/:id/reports", upload.single("file"), async (req, res, next) => {
  try {
    const db = await withDb();
    const patient = db ? await Patient.findOne({ patientId: req.params.id }) : findDemo(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    const analysis = await analyzeMedicalFile(req.file);
    
    // Evaluate report analysis
    const evalInput = `Document Type: ${analysis.documentType}. Explanation: ${analysis.aiExplanation}. Findings: ${analysis.findings?.join(", ") || "None"}.`;
    const evaluation = await evaluateAIOutput({ patient, task: "report", output: evalInput, context: { fileName: req.file.originalname } });
    
    const report = { 
      title: req.body.title || req.file.originalname, 
      type: req.body.type || "Medical Report", 
      uploadedAt: new Date().toISOString(), 
      ...analysis,
      evaluation
    };
    
    const documentType = analysis.documentType || "Other";
    const structuredData = analysis.structuredData || {};
    
    let timelineItem = {
      date: today(),
      title: "Report Processed",
      type: "Report",
      description: analysis.findings?.join(", ") || "Medical report analyzed.",
      source: "AI OCR"
    };

    let medicationsToPush = [];

    if (documentType === "Hospital Bill") {
      const hospitalName = structuredData.hospitalName || "Unknown Hospital";
      const totalAmount = structuredData.totalAmount || "0";
      const billNumber = structuredData.billNumber || "N/A";
      const billDate = structuredData.date || today();

      timelineItem = {
        date: billDate,
        title: "Hospital Visit",
        type: "Visit",
        description: `Hospital: ${hospitalName} | Bill No: ${billNumber} | Amount: ${totalAmount}`,
        source: "AI OCR",
        hospitalName,
        diagnosis: "Billing",
        notes: `Total bill amount: ${totalAmount}. No medical findings generated.`
      };
    } else if (documentType === "Blood Report" || documentType === "Lab Report") {
      const hgb = structuredData.hemoglobin ? `Hgb: ${structuredData.hemoglobin} g/dL` : "";
      const vitD = structuredData.vitaminD ? `Vit D: ${structuredData.vitaminD} ng/mL` : "";
      const details = [hgb, vitD, ...analysis.findings].filter(Boolean).join(", ");
      
      timelineItem = {
        date: structuredData.date || today(),
        title: "Lab Test Report",
        type: "Lab Finding",
        description: details || "Lab report analyzed.",
        source: "AI OCR"
      };
    } else if (documentType === "Prescription") {
      const meds = structuredData.medications || [];
      const medList = meds.map(m => `${m.name} (${m.dosage} for ${m.duration})`).join(", ");
      
      timelineItem = {
        date: structuredData.date || today(),
        title: "Prescription Received",
        type: "Prescription",
        description: medList || "Prescription processed.",
        source: "AI OCR",
        medicines: meds.map(m => m.name).filter(Boolean)
      };

      medicationsToPush = meds.map(m => m.name).filter(Boolean);
    } else if (documentType === "Discharge Summary") {
      const diag = structuredData.diagnosis || "Unknown Diagnosis";
      const treat = structuredData.treatment || "N/A";
      const stay = structuredData.hospitalStay || "N/A";
      
      timelineItem = {
        date: structuredData.date || today(),
        title: "Hospital Discharge",
        type: "Discharge",
        description: `Diagnosis: ${diag} | Treatment: ${treat} | Stay: ${stay}`,
        source: "AI OCR",
        diagnosis: diag,
        notes: `Discharged after ${stay}. Treatment: ${treat}.`
      };
    } else if (documentType === "Scan Report") {
      timelineItem = {
        date: structuredData.date || today(),
        title: "Scan Report Uploaded",
        type: "Scan",
        description: analysis.findings?.join(", ") || "Scan report analyzed.",
        source: "AI OCR"
      };
    }

    if (!db) {
      patient.reports.unshift({ ...report, _id: nanoid(6) });
      patient.visits.unshift({ ...timelineItem, _id: nanoid(6) });
      if (medicationsToPush.length > 0) {
        patient.medications = [...new Set([...(patient.medications || []), ...medicationsToPush])];
      }
      return res.json({ patient, report });
    }

    const updateObject = {
      $push: {
        reports: { $each: [report], $position: 0 },
        visits: { $each: [timelineItem], $position: 0 }
      }
    };
    if (medicationsToPush.length > 0) {
      updateObject.$addToSet = { medications: { $each: medicationsToPush } };
    }

    const updated = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      updateObject,
      { new: true }
    );
    res.json({ patient: updated, report });
  } catch (err) {
    next(err);
  }
});

// Edit Patient Details
app.put("/api/patients/:id", async (req, res, next) => {
  try {
    const db = await withDb();
    const payload = req.body;
    if (!db) {
      const idx = demoPatients.findIndex(p => p.patientId === req.params.id);
      if (idx === -1) return res.status(404).json({ message: "Patient not found" });
      demoPatients[idx] = { ...demoPatients[idx], ...payload };
      return res.json(demoPatients[idx]);
    }
    const updated = await Patient.findOneAndUpdate({ patientId: req.params.id }, payload, { new: true });
    updated ? res.json(updated) : res.status(404).json({ message: "Patient not found" });
  } catch (err) {
    next(err);
  }
});

// Delete Patient
app.delete("/api/patients/:id", async (req, res, next) => {
  try {
    const db = await withDb();
    if (!db) {
      const idx = demoPatients.findIndex(p => p.patientId === req.params.id);
      if (idx === -1) return res.status(404).json({ message: "Patient not found" });
      demoPatients.splice(idx, 1);
      return res.json({ message: "Patient deleted successfully" });
    }
    const deleted = await Patient.findOneAndDelete({ patientId: req.params.id });
    deleted ? res.json({ message: "Patient deleted successfully" }) : res.status(404).json({ message: "Patient not found" });
  } catch (err) {
    next(err);
  }
});

// Edit History Event
app.put("/api/patients/:id/history/:historyId", async (req, res, next) => {
  try {
    const db = await withDb();
    const payload = req.body;
    
    // Support parsing medicines if passed in body
    let medsArray = [];
    if (payload.medicines) {
      medsArray = Array.isArray(payload.medicines)
        ? payload.medicines
        : payload.medicines.split(",").map(m => m.trim()).filter(Boolean);
    }
    
    const updateFields = {
      title: payload.title,
      type: payload.type,
      description: payload.description,
      hospitalName: payload.hospitalName || "",
      doctorName: payload.doctorName || "",
      symptoms: payload.symptoms || "",
      diagnosis: payload.diagnosis || "",
      medicines: medsArray,
      notes: payload.notes || "",
      date: payload.date
    };

    if (!db) {
      const p = demoPatients.find(p => p.patientId === req.params.id);
      if (!p) return res.status(404).json({ message: "Patient not found" });
      const visit = p.visits.find(v => v._id === req.params.historyId);
      if (!visit) return res.status(404).json({ message: "History item not found" });
      
      Object.assign(visit, updateFields);
      if (medsArray.length > 0) {
        p.medications = [...new Set([...(p.medications || []), ...medsArray])];
      }
      return res.json(p);
    }

    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    const visit = patient.visits.id(req.params.historyId);
    if (!visit) return res.status(404).json({ message: "History item not found" });
    
    Object.assign(visit, updateFields);
    
    // Sync medications if present
    if (medsArray.length > 0) {
      medsArray.forEach(m => {
        if (!patient.medications.includes(m)) {
          patient.medications.push(m);
        }
      });
    }

    await patient.save();
    res.json(patient);
  } catch (err) {
    next(err);
  }
});

// Delete History Event
app.delete("/api/patients/:id/history/:historyId", async (req, res, next) => {
  try {
    const db = await withDb();
    if (!db) {
      const p = demoPatients.find(p => p.patientId === req.params.id);
      if (!p) return res.status(404).json({ message: "Patient not found" });
      const idx = p.visits.findIndex(v => v._id === req.params.historyId);
      if (idx === -1) return res.status(404).json({ message: "History item not found" });
      p.visits.splice(idx, 1);
      return res.json(p);
    }

    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      { $pull: { visits: { _id: req.params.historyId } } },
      { new: true }
    );
    patient ? res.json(patient) : res.status(404).json({ message: "Patient not found" });
  } catch (err) {
    next(err);
  }
});

// Hospitals CRUD Endpoints
app.get("/api/hospitals", async (req, res, next) => {
  try {
    const db = await withDb();
    if (!db) return res.json(demoHospitals);
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.json(hospitals);
  } catch (err) {
    next(err);
  }
});

app.post("/api/hospitals", adminGuard, async (req, res, next) => {
  try {
    const { name, location, phone, email, totalDoctors, totalPatientsAdmitted } = req.body;
    if (!name || !location) return res.status(400).json({ message: "Name and location are required" });
    
    const db = await withDb();
    const newHospital = { name, location, phone: phone || "", email: email || "", totalDoctors: Number(totalDoctors) || 0, totalPatientsAdmitted: Number(totalPatientsAdmitted) || 0 };
    
    if (!db) {
      const exists = demoHospitals.some(h => h.name.toLowerCase() === name.toLowerCase());
      if (exists) return res.status(400).json({ message: "Hospital name already exists" });
      const created = { ...newHospital, _id: nanoid(6) };
      demoHospitals.push(created);
      return res.status(201).json(created);
    }
    
    const exists = await Hospital.findOne({ name });
    if (exists) return res.status(400).json({ message: "Hospital name already exists" });
    
    const created = await Hospital.create(newHospital);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/hospitals/:id", adminGuard, async (req, res, next) => {
  try {
    const db = await withDb();
    const { id } = req.params;
    if (!db) {
      const idx = demoHospitals.findIndex(h => h._id === id);
      if (idx === -1) return res.status(404).json({ message: "Hospital not found" });
      demoHospitals.splice(idx, 1);
      return res.json({ message: "Hospital deleted successfully" });
    }
    const deleted = await Hospital.findByIdAndDelete(id);
    deleted ? res.json({ message: "Hospital deleted successfully" }) : res.status(404).json({ message: "Hospital not found" });
  } catch (err) {
    next(err);
  }
});

// Appointments Endpoints
app.get("/api/patients/:id/appointments", async (req, res, next) => {
  try {
    const db = await withDb();
    const patient = db ? await Patient.findOne({ patientId: req.params.id }) : findDemo(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient.appointments || []);
  } catch (err) {
    next(err);
  }
});

app.post("/api/patients/:id/appointments", async (req, res, next) => {
  try {
    const { date, time, doctorName, hospitalName, reason } = req.body;
    if (!date || !time || !doctorName || !hospitalName) {
      return res.status(400).json({ message: "Missing required fields for appointment" });
    }
    
    const appt = { date, time, doctorName, hospitalName, reason: reason || "", status: "Scheduled" };
    const db = await withDb();
    
    if (!db) {
      const patient = findDemo(req.params.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      if (!patient.appointments) patient.appointments = [];
      
      const created = { ...appt, _id: nanoid(6) };
      patient.appointments.unshift(created);
      return res.status(201).json(created);
    }
    
    const updated = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      { $push: { appointments: { $each: [appt], $position: 0 } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    res.status(201).json(updated.appointments[0]);
  } catch (err) {
    next(err);
  }
});

app.put("/api/patients/:id/appointments/:appId", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    
    const db = await withDb();
    if (!db) {
      const patient = findDemo(req.params.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      const appt = patient.appointments?.find(a => a._id === req.params.appId);
      if (!appt) return res.status(404).json({ message: "Appointment not found" });
      appt.status = status;
      return res.json(appt);
    }
    
    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    const appt = patient.appointments.id(req.params.appId);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    
    appt.status = status;
    await patient.save();
    res.json(appt);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") app.listen(PORT, () => console.log(`API running on ${PORT}`));
export default app;
