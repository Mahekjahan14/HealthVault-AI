export const demoUsers = [
  { email: "patient@healthvault.ai", password: "password123", role: "patient", name: "Aisha Khan", patientId: "HVAI-0001" },
  { email: "doctor@healthvault.ai", password: "password123", role: "doctor", name: "Dr. Sarah Jenkins", patientId: "" },
  { email: "admin@healthvault.ai", password: "password123", role: "admin", name: "System Admin", patientId: "" }
];

export const demoHospitals = [
  { _id: "60d5ec38f1b29a2e68407421", name: "Metro Care Hospital", location: "New Delhi", phone: "+91 11 4000 0001", email: "contact@metrocare.com", totalDoctors: 12, totalPatientsAdmitted: 150 },
  { _id: "60d5ec38f1b29a2e68407422", name: "Jeevan Hospital", location: "Mumbai", phone: "+91 22 5000 0002", email: "info@jeevan.com", totalDoctors: 8, totalPatientsAdmitted: 90 },
  { _id: "60d5ec38f1b29a2e68407423", name: "St. Jude Clinic", location: "Bangalore", phone: "+91 80 6000 0003", email: "admin@stjude.org", totalDoctors: 5, totalPatientsAdmitted: 45 }
];

export const demoPatients = [
  {
    patientId: "HVAI-0001",
    name: "Aisha Khan",
    email: "aisha@example.com",
    phone: "+91 90000 00001",
    dob: "1998-04-12",
    age: 28,
    gender: "Female",
    bloodGroup: "O+",
    emergencyContact: "+91 90000 00009",
    diseases: ["Asthma", "Vitamin D Deficiency"],
    allergies: ["Penicillin"],
    surgeries: ["Appendectomy - 2019"],
    medications: ["Vitamin D3 weekly", "Salbutamol inhaler when needed"],
    vaccinations: ["COVID-19", "Hepatitis B"],
    familyHistory: ["Diabetes in father"],
    visits: [
      { _id: "v1", date: "2019-06-10", title: "Appendectomy", type: "Surgery", description: "Appendix removal surgery completed successfully.", source: "Hospital Record" },
      { _id: "v2", date: "2024-11-14", title: "Asthma follow-up", type: "Visit", description: "Mild wheezing. Inhaler prescribed.", source: "Doctor Note" },
      { _id: "v3", date: "2026-02-02", title: "Vitamin D deficiency", type: "Lab Finding", description: "Vitamin D level low. Supplement advised.", source: "Lab Report" }
    ],
    reports: [],
    appointments: [
      { _id: "ap1", date: "2026-06-15", time: "10:30 AM", doctorName: "Dr. Sarah Jenkins", hospitalName: "Metro Care Hospital", reason: "Asthma checkup & prescription refill", status: "Scheduled" },
      { _id: "ap2", date: "2026-07-20", time: "02:00 PM", doctorName: "Dr. Raj Patel", hospitalName: "Jeevan Hospital", reason: "Follow-up blood sugar check", status: "Scheduled" }
    ],
    notes: ["Avoid penicillin-based antibiotics."]
  }
];
