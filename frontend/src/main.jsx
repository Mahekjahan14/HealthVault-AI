import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, Bot, CalendarDays, FileText,
  HeartPulse, History, LayoutDashboard, Plus, Search,
  ShieldCheck, Sparkles, Stethoscope, Upload, UserRound,
  FlaskConical, Pill, ClipboardList, Syringe, ScanLine,
  ChevronRight, TrendingUp, Zap, Brain, Clock, QrCode,
  CheckCircle, XCircle, AlertOctagon, HelpCircle, Hospital, User,
  Edit, Trash2, LogOut, Sun, Moon, ShieldAlert, Key, Users,
  ArrowLeft, ChevronDown, Globe, Lock, Fingerprint, Eye, ArrowRight
} from "lucide-react";
import { api } from "./lib/api";
import "./index.css";

// ─── AI Accuracy & Hallucination Evaluation Display UI ────────────────────────
function AIEvaluationReport({ evaluation }) {
  if (!evaluation) return null;
  const { ocrConfidence, llmConfidence, hallucinationRisk, groundednessScore, verificationStatus, unsupportedClaims, safetyWarning } = evaluation;
  
  const riskColors = {
    Low: { bg: "rgba(52, 211, 153, 0.08)", border: "rgba(52, 211, 153, 0.2)", text: "#10b981" },
    Medium: { bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.2)", text: "#d97706" },
    High: { bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.3)", text: "#ef4444" }
  };
  
  const riskColor = riskColors[hallucinationRisk] || riskColors.Low;
  
  return (
    <div className="card shadow-md transition-all duration-300 animate-fade-up" style={{ marginTop: 16, padding: "16px 20px", background: "var(--c-surface)", borderColor: "var(--c-border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <ShieldCheck size={16} style={{ color: "var(--c-sky)" }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text)" }}>
          AI Safety & Evaluation Center
        </span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div style={{ padding: "8px 10px", borderRadius: 10, background: "rgba(129, 140, 248, 0.05)", border: "1px solid var(--c-border)" }}>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>LLM Confidence</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: llmConfidence > 80 ? "var(--c-emerald)" : "var(--c-sky)" }}>{llmConfidence}%</span>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 10, background: "rgba(129, 140, 248, 0.05)", border: "1px solid var(--c-border)" }}>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>OCR Confidence</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: ocrConfidence !== "N/A" ? "var(--c-emerald)" : "var(--c-muted)" }}>{ocrConfidence}</span>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 10, background: riskColor.bg, border: `1px solid ${riskColor.border}` }}>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Hallucination Risk</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: riskColor.text }}>{hallucinationRisk}</span>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 10, background: "rgba(129, 140, 248, 0.05)", border: "1px solid var(--c-border)" }}>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Groundedness</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--c-sky)" }}>{groundednessScore}%</span>
        </div>
      </div>

      {unsupportedClaims && unsupportedClaims.length > 0 && (
        <div style={{ marginBottom: 10, padding: 8, borderRadius: 8, background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "var(--c-rose)", marginBottom: 4 }}>
            <AlertOctagon size={12} /> Unsupported Claims:
          </span>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--c-text)" }}>
            {unsupportedClaims.map((claim, idx) => (
              <li key={idx} style={{ marginBottom: 2 }}>{claim}</li>
            ))}
          </ul>
        </div>
      )}

      {safetyWarning && safetyWarning !== "Heuristic check complete. No critical safety warnings." && (
        <div style={{ marginBottom: 10, padding: 8, borderRadius: 8, background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.15)" }}>
          <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#d97706", marginBottom: 2 }}>Safety Warning:</span>
          <p style={{ margin: 0, fontSize: 12, color: "var(--c-text)", lineHeight: 1.4 }}>{safetyWarning}</p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
        <span style={{ fontSize: 11, color: "var(--c-muted)" }}>Verification Status:</span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: verificationStatus === "Verified" ? "rgba(52, 211, 153, 0.12)" : "rgba(245, 158, 11, 0.12)", color: verificationStatus === "Verified" ? "var(--c-emerald)" : "#d97706" }}>
          {verificationStatus}
        </span>
      </div>
    </div>
  );
}

// ─── Mandatory Safety Disclaimer Helper ────────────────────────────────────────
function MedicalDisclaimer() {
  return (
    <div style={{
      marginTop: 12, padding: "10px 14px", borderRadius: 10,
      background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)",
      display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--c-rose)"
    }}>
      <AlertTriangle size={14} style={{ flexShrink: 0 }} />
      <span>
        <b>Disclaimer:</b> AI assistance only. Consult a qualified healthcare professional. Never present AI output as final medical diagnosis.
      </span>
    </div>
  );
}

// ─── HealthVault Card Component (Digital Health Identity) ──────────────────────
function HealthVaultCard({ patient, setActive, onQRClick, userRole }) {
  if (!patient) {
    return (
      <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--c-muted)" }}>
        <UserRound size={36} style={{ margin: "0 auto 10px", opacity: 0.25 }} />
        <p style={{ margin: 0, fontSize: 14 }}>
          {userRole === "patient" ? "Loading your Digital Health Card..." : "Select a patient to view their Digital Health Card"}
        </p>
      </div>
    );
  }
  
  const lastVisit = patient.visits?.[0];

  return (
    <div className="card card-glow animate-fade-up" style={{
      background: "linear-gradient(135deg, var(--c-surface) 0%, var(--c-bg) 100%)",
      border: "2px solid var(--c-border-hi)",
      padding: "24px",
      borderRadius: "24px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Visual Hologram Overlays */}
      <div style={{ position: "absolute", right: -40, bottom: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: -20, top: -20, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <ShieldCheck size={14} style={{ color: "var(--c-sky)" }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--c-sky)" }}>
              Digital Health Card
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "var(--c-text)", letterSpacing: "-0.02em" }}>{patient.name}</h3>
          <span className="mono" style={{ fontSize: 12, color: "var(--c-sky)", background: "rgba(56,189,248,0.06)", border: "1px solid var(--c-border)", padding: "2px 8px", borderRadius: 6, display: "inline-block", marginTop: 4 }}>
            {patient.patientId}
          </span>
        </div>

        {/* QR Code */}
        <div 
          onClick={onQRClick}
          className="qr-card-container"
          style={{
            width: 72, height: 72, background: "#fff", border: "1px solid var(--c-border)",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, position: "relative", overflow: "hidden", padding: 4, cursor: "pointer",
            transition: "transform 0.2s ease"
          }}
          title="Click to enlarge QR Code"
        >
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${patient.patientId}`} 
            alt="QR Code" 
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "14px 16px", fontSize: 13, borderTop: "1px solid var(--c-border)", paddingTop: 16 }}>
        <div>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Blood Group</span>
          <span className="badge badge-rose">{patient.bloodGroup || "O+"}</span>
        </div>
        <div>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Emergency Contact</span>
          <b style={{ color: "var(--c-text)" }}>{patient.emergencyContact || patient.phone || "Not Declared"}</b>
        </div>
        
        <div style={{ gridColumn: "1/-1" }}>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Allergies</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {patient.allergies?.map(x => <span className="badge badge-emerald" key={x}>{x}</span>)}
            {!patient.allergies?.length && <span style={{ color: "var(--c-muted)", fontSize: 12 }}>None Declared</span>}
          </div>
        </div>

        <div style={{ gridColumn: "1/-1" }}>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Chronic Conditions</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {patient.diseases?.map(x => <span className="badge badge-amber" key={x}>{x}</span>)}
            {!patient.diseases?.length && <span style={{ color: "var(--c-muted)", fontSize: 12 }}>None Declared</span>}
          </div>
        </div>

        <div style={{ gridColumn: "1/-1" }}>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Current Medications</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {patient.medications?.map(x => <span className="badge badge-violet" key={x}>{x}</span>)}
            {!patient.medications?.length && <span style={{ color: "var(--c-muted)", fontSize: 12 }}>None active</span>}
          </div>
        </div>

        <div style={{ gridColumn: "1/-1", padding: 10, borderRadius: 12, background: "rgba(0,0,0,0.1)", border: "1px solid var(--c-border)" }}>
          <span style={{ display: "block", fontSize: 9, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Last Hospital Visit</span>
          {lastVisit ? (
            <div>
              <b style={{ color: "var(--c-sky)", fontSize: 13 }}>{lastVisit.title}</b>
              <span style={{ color: "var(--c-muted)", fontSize: 11, marginLeft: 8 }}>{lastVisit.date}</span>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--c-text)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {lastVisit.description}
              </p>
            </div>
          ) : (
            <span style={{ color: "var(--c-muted)", fontSize: 12 }}>No visit record available</span>
          )}
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={() => setActive("Medical History")}
        style={{ width: "100%", marginTop: 16, padding: "10px", fontSize: 13 }}
      >
        <ClipboardList size={14} />
        View Complete Medical History
      </button>
    </div>
  );
}

// ─── Primitive Inputs ─────────────────────────────────────────────────────────
function Field({ label, ...props }) {
  return (
    <label className="block">
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--c-muted)", display: "block", marginBottom: 6 }}>
        {label}
      </span>
      <input className="input" {...props} />
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="block">
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--c-muted)", display: "block", marginBottom: 6 }}>
        {label}
      </span>
      <textarea className="input" {...props} />
    </label>
  );
}

// ─── Layout primitives ────────────────────────────────────────────────────────
function Section({ title, subtitle, accent = "var(--c-sky)", icon: Icon, children }) {
  return (
    <div className="card card-glow animate-fade-up" style={{ padding: "24px 28px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          {Icon && (
            <div style={{ padding: 8, borderRadius: 10, background: "rgba(56,189,248,0.08)", display: "flex" }}>
              <Icon size={18} style={{ color: accent }} />
            </div>
          )}
          <h2 className="section-title">{title}</h2>
        </div>
        {subtitle && <p style={{ color: "var(--c-muted)", fontSize: 14, margin: 0 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "var(--c-sky)" }) {
  return (
    <div className="stat-card animate-fade-up">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ padding: 8, borderRadius: 10, background: "rgba(56,189,248,0.08)" }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: 12, color: "var(--c-muted)", margin: "0 0 2px" }}>{label}</p>
        <h3 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: "-0.03em", color: "var(--c-text)" }}>{value}</h3>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ user, onLogout, toggleTheme, theme }) {
  return (
    <header className="glass" style={{ borderRadius: 20, padding: "24px 32px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, background: "rgba(56,189,248,0.06)", border: "1px solid var(--c-border)", fontSize: 11, fontWeight: 700, color: "var(--c-sky)", marginBottom: 8 }}>
            <ShieldCheck size={12} />
            A lifelong portable digital medical identity that follows a patient across hospitals.
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 4px", lineHeight: 1.1 }}>
            <span className="grad-text">HealthVault</span> <span style={{ color: "var(--c-text)" }}>AI</span>
          </h1>
          {user && (
            <p style={{ color: "var(--c-muted)", margin: 0, fontSize: 13 }}>
              Welcome back, <b>{user.name}</b> • Access Level: <span style={{ textTransform: "uppercase", fontWeight: 700, color: "var(--c-sky)" }}>{user.role}</span>
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Light/Dark mode swapper */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-soft" 
            style={{ padding: "10px", borderRadius: 12 }} 
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} style={{ color: "#fbbf24" }} />}
          </button>
          
          {user && (
            <button onClick={onLogout} className="btn btn-soft text-rose-400" style={{ padding: "10px 16px", borderRadius: 12 }}>
              <LogOut size={15} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TYPE_COLOR = {
  Visit:          "#38bdf8",
  "Lab Finding":  "#10b981",
  Prescription:   "#8b5cf6",
  Discharge:      "#e11d48",
  Scan:           "#f59e0b",
  Report:         "#6366f1",
  Surgery:        "#ef4444",
  "Hospital Visit": "#06b6d4",
};
const TYPE_ICON = {
  Visit:          CalendarDays,
  "Lab Finding":  FlaskConical,
  Prescription:   Pill,
  Discharge:      ClipboardList,
  Scan:           ScanLine,
  Report:         FileText,
  Surgery:        Syringe,
  "Hospital Visit": HeartPulse,
};

function Timeline({ visits = [], onEditEvent, onDeleteEvent }) {
  if (!visits.length) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0", color: "var(--c-muted)" }}>
        <Clock size={24} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
        <p style={{ margin: 0, fontSize: 13 }}>No timeline events yet</p>
      </div>
    );
  }
  return (
    <div style={{ maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
      {visits.map((v, i) => {
        const color = TYPE_COLOR[v.type] || "#64748b";
        const TIcon = TYPE_ICON[v.type] || Clock;
        return (
          <div key={v._id || i} style={{ display: "flex", gap: 12, marginBottom: 2 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", background: `${color}15`,
                border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 8px ${color}30`, flexShrink: 0,
              }}>
                <TIcon size={11} style={{ color }} />
              </div>
              {i < visits.length - 1 && (
                <div style={{ width: 1, flex: 1, background: "var(--c-border)", marginTop: 4, marginBottom: 4 }} />
              )}
            </div>
            <div style={{ paddingBottom: 16, flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: `${color}12`, color, fontWeight: 700, border: `1px solid ${color}25` }}>
                  {v.type || "Visit"}
                </span>
                <span style={{ fontSize: 10, color: "var(--c-muted)" }}>{v.date}</span>
                
                {/* Event Edit / Delete controls */}
                {(onEditEvent && onDeleteEvent && v._id) && (
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditEvent(v); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-muted)", padding: 2, display: "flex" }}
                      title="Edit Clinical Record"
                      onMouseEnter={e => e.currentTarget.style.color = "var(--c-sky)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--c-muted)"}
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteEvent(v._id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-muted)", padding: 2, display: "flex" }}
                      title="Delete Clinical Record"
                      onMouseEnter={e => e.currentTarget.style.color = "var(--c-rose)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--c-muted)"}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
              <h4 style={{ margin: "2px 0 2px", fontSize: 13, fontWeight: 700, color: "var(--c-text)" }}>{v.title}</h4>
              {v.description && <p style={{ margin: 0, fontSize: 12, color: "var(--c-text)", opacity: 0.8, lineHeight: 1.4 }}>{v.description}</p>}
              
              {(v.hospitalName || v.doctorName || v.symptoms || v.diagnosis || (v.medicines && (Array.isArray(v.medicines) ? v.medicines.length > 0 : v.medicines.length > 0)) || v.notes) && (
                <div style={{ marginTop: 6, padding: 8, borderRadius: 8, background: "rgba(0,0,0,0.06)", border: "1px solid var(--c-border)", fontSize: 11, display: "flex", flexDirection: "column", gap: 3 }}>
                  {v.hospitalName && <div><span style={{ color: "var(--c-muted)" }}>Hospital:</span> <span style={{ color: "var(--c-text)" }}>{v.hospitalName}</span> {v.doctorName && <span>(Dr. {v.doctorName})</span>}</div>}
                  {v.symptoms && <div><span style={{ color: "var(--c-muted)" }}>Symptoms:</span> <span style={{ color: "var(--c-text)" }}>{v.symptoms}</span></div>}
                  {v.diagnosis && <div><span style={{ color: "var(--c-muted)" }}>Diagnosis:</span> <span style={{ color: "var(--c-sky)", fontWeight: 600 }}>{v.diagnosis}</span></div>}
                  {v.medicines && (Array.isArray(v.medicines) ? v.medicines.length > 0 : v.medicines.length > 0) && (
                    <div>
                      <span style={{ color: "var(--c-muted)" }}>Medicines:</span>{" "}
                      <span style={{ color: "var(--c-sky)" }}>
                        {Array.isArray(v.medicines) ? v.medicines.join(", ") : v.medicines}
                      </span>
                    </div>
                  )}
                  {v.notes && <div><span style={{ color: "var(--c-muted)" }}>Notes:</span> <span style={{ color: "var(--c-text)" }}>{v.notes}</span></div>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Prescriptions Listing Component ──────────────────────────────────────────
function Prescriptions({ selected, patientSelect }) {
  if (!selected) {
    return (
      <div className="card shadow-md animate-fade-up" style={{ padding: "40px 24px", textAlign: "center", color: "var(--c-muted)" }}>
        <Pill size={48} style={{ margin: "0 auto 16px", opacity: 0.3, color: "var(--c-sky)" }} />
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--c-text)", margin: "0 0 8px" }}>No Patient Active</h3>
        <p style={{ maxWidth: 420, margin: "0 auto 24px", fontSize: 13, lineHeight: 1.5 }}>
          Please select a patient from the patient lookup to view prescriptions.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>{patientSelect}</div>
      </div>
    );
  }

  const prescriptions = (selected.visits || []).filter(v => v.type === "Prescription" || (v.medicines && v.medicines.length > 0));

  return (
    <Section title="Lifelong Prescription History" subtitle="Active and past clinical prescriptions linked to this identity card." icon={Pill}>
      <div style={{ marginBottom: 20 }}>{patientSelect}</div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {prescriptions.map((p, i) => (
          <div key={p._id || i} className="card animate-fade-up" style={{ padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid var(--c-border)", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--c-text)" }}>{p.title || "Prescription"}</h3>
                <span style={{ fontSize: 11, color: "var(--c-muted)" }}>
                  Issued on <b>{p.date}</b> {p.hospitalName && <span>at {p.hospitalName}</span>} {p.doctorName && <span>by Dr. {p.doctorName}</span>}
                </span>
              </div>
              <span className="badge badge-rose" style={{ fontSize: 10 }}>Rx ID: {p._id || "N/A"}</span>
            </div>
            
            {p.diagnosis && (
              <div style={{ marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: "var(--c-muted)", fontSize: 11 }}>Indication / Diagnosis:</span>
                <p style={{ margin: "2px 0 0", color: "var(--c-sky)", fontWeight: 600 }}>{p.diagnosis}</p>
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              <span style={{ color: "var(--c-muted)", fontSize: 11, display: "block", marginBottom: 6 }}>Prescribed Medications:</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {p.medicines && (Array.isArray(p.medicines) ? p.medicines : p.medicines.split(",").map(m => m.trim()).filter(Boolean)).map((m, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid var(--c-border)", padding: "10px 14px", borderRadius: 10 }}>
                    <Pill size={14} style={{ color: "var(--c-sky)" }} />
                    <span style={{ fontWeight: 700, fontSize: 13, color: "var(--c-text)" }}>{m}</span>
                  </div>
                ))}
                {(!p.medicines || (Array.isArray(p.medicines) ? p.medicines.length === 0 : p.medicines.length === 0)) && (
                  <span style={{ color: "var(--c-muted)", fontSize: 12 }}>No medicines recorded in visit.</span>
                )}
              </div>
            </div>

            {p.notes && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.1)", fontSize: 12 }}>
                <span style={{ color: "var(--c-muted)", fontSize: 10, display: "block", marginBottom: 2 }}>Instructions / Doctor Notes:</span>
                <p style={{ margin: 0, color: "var(--c-text)", opacity: 0.85, lineHeight: 1.4 }}>{p.notes}</p>
              </div>
            )}
          </div>
        ))}
        {prescriptions.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--c-muted)", fontSize: 13 }}>
            No prescriptions found in patient's digital health history.
          </div>
        )}
      </div>
    </Section>
  );
}

// ─── Appointments Component ───────────────────────────────────────────────────
function Appointments({ selected, patientSelect, userRole, reload }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const schedule = async (e) => {
    e.preventDefault();
    if (!selected) return alert("Select a patient first");
    if (!date || !time || !doctorName || !hospitalName) return alert("All fields are required");
    setBusy(true);
    try {
      await api.post(`/api/patients/${selected.patientId}/appointments`, { date, time, doctorName, hospitalName, reason });
      alert("Appointment scheduled successfully");
      setDate("");
      setTime("");
      setDoctorName("");
      setHospitalName("");
      setReason("");
      await reload();
    } catch (err) {
      console.error(err);
      alert("Failed to schedule appointment: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/api/patients/${selected.patientId}/appointments/${appId}`, { status: newStatus });
      alert(`Appointment status updated to ${newStatus}`);
      await reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  if (!selected) {
    return (
      <div className="card shadow-md animate-fade-up" style={{ padding: "40px 24px", textAlign: "center", color: "var(--c-muted)" }}>
        <CalendarDays size={48} style={{ margin: "0 auto 16px", opacity: 0.3, color: "var(--c-sky)" }} />
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--c-text)", margin: "0 0 8px" }}>No Patient Active</h3>
        <p style={{ maxWidth: 420, margin: "0 auto 24px", fontSize: 13, lineHeight: 1.5 }}>
          Please select a patient from the patient lookup directory to manage appointments.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>{patientSelect}</div>
      </div>
    );
  }

  const appts = selected.appointments || [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: userRole === "patient" ? "1.2fr 1.8fr" : "1fr", gap: 16 }} className="animate-fade-up">
      {userRole === "patient" && (
        <Section title="Schedule Appointment" subtitle="Book a new session for your digital health profile." icon={CalendarDays}>
          <form onSubmit={schedule} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Appointment Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <Field label="Appointment Time" placeholder="e.g. 10:30 AM" value={time} onChange={e => setTime(e.target.value)} required />
            <Field label="Consulting Doctor" placeholder="Dr. Sarah Jenkins" value={doctorName} onChange={e => setDoctorName(e.target.value)} required />
            <Field label="Hospital/Clinic Location" placeholder="Metro Care Hospital" value={hospitalName} onChange={e => setHospitalName(e.target.value)} required />
            <TextArea label="Reason for Appointment" placeholder="Routine checkup, inhaler review..." value={reason} onChange={e => setReason(e.target.value)} />
            
            <button className="btn btn-primary" style={{ marginTop: 10, padding: 12 }} disabled={busy}>
              <CalendarDays size={14} />
              {busy ? "Scheduling..." : "Schedule Appointment Slot"}
            </button>
          </form>
        </Section>
      )}

      <Section title="Appointment Log" subtitle="Scheduled clinical encounters across connected hospitals." icon={Clock}>
        {userRole === "patient" && patientSelect && <div style={{ marginBottom: 16 }}>{patientSelect}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {appts.map((a, i) => (
            <div key={a._id || i} style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid var(--c-border)", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <b style={{ fontSize: 14, color: "var(--c-text)" }}>{a.doctorName}</b>
                  <span style={{ fontSize: 11, color: "var(--c-muted)", marginLeft: 6 }}>at {a.hospitalName}</span>
                </div>
                <span className={`badge ${a.status === "Scheduled" ? "badge-violet" : a.status === "Completed" ? "badge-emerald" : "badge-rose"}`} style={{ fontSize: 10 }}>
                  {a.status}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--c-muted)" }}>
                Date: <b>{a.date}</b> • Time: <b>{a.time}</b>
              </p>
              {a.reason && <p style={{ margin: 0, fontSize: 12, color: "var(--c-text)", opacity: 0.8 }}>Reason: {a.reason}</p>}
              
              {userRole === "patient" && a.status === "Scheduled" && (
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <button onClick={() => updateStatus(a._id, "Completed")} className="btn btn-soft" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6 }}>
                    Mark Completed
                  </button>
                  <button onClick={() => updateStatus(a._id, "Cancelled")} className="btn btn-soft text-rose-400" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6, borderColor: "rgba(239, 68, 68, 0.1)" }}>
                    Cancel Slot
                  </button>
                </div>
              )}
            </div>
          ))}
          {appts.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--c-muted)", padding: 24, fontSize: 13 }}>No appointments scheduled.</p>
          )}
        </div>
      </Section>
    </div>
  );
}

// ─── Hospitals Management (Admin only) ──────────────────────────────────────────
function HospitalsManagement() {
  const [hospitals, setHospitals] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [totalDoctors, setTotalDoctors] = useState("");
  const [totalPatientsAdmitted, setTotalPatientsAdmitted] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadHospitals = async () => {
    try {
      const { data } = await api.get("/api/hospitals");
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHospitals(); }, []);

  const register = async (e) => {
    e.preventDefault();
    if (!name || !location) return alert("Name and location are required");
    setBusy(true);
    try {
      await api.post("/api/hospitals", { name, location, phone, email, totalDoctors, totalPatientsAdmitted });
      alert("Hospital registered successfully");
      setName("");
      setLocation("");
      setPhone("");
      setEmail("");
      setTotalDoctors("");
      setTotalPatientsAdmitted("");
      loadHospitals();
    } catch (err) {
      console.error(err);
      alert("Failed to register hospital: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  const deleteHospital = async (id, hName) => {
    if (!confirm(`Are you sure you want to revoke registration for "${hName}"?`)) return;
    try {
      await api.delete(`/api/hospitals/${id}`);
      alert("Hospital registration revoked");
      loadHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--c-muted)", padding: 40, textAlign: "center" }}>Loading hospital registries...</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.7fr", gap: 16 }} className="animate-fade-up">
      <Section title="Registered Hospitals" subtitle="Affiliated portals connected to the HealthVault network." icon={Hospital}>
        <div style={{ overflowY: "auto", maxHeight: 520 }}>
          {hospitals.map((h, i) => (
            <div key={h._id || i} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--c-border)", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--c-text)" }}>{h.name}</h4>
                <span style={{ fontSize: 11, color: "var(--c-muted)" }}>{h.location}</span>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <span className="badge" style={{ fontSize: 9 }}>Docs: {h.totalDoctors || 0}</span>
                  <span className="badge badge-emerald" style={{ fontSize: 9 }}>Capacity: {h.totalPatientsAdmitted || 0}</span>
                </div>
              </div>
              <button onClick={() => deleteHospital(h._id, h.name)} className="btn btn-soft text-rose-400" style={{ padding: "6px 10px", fontSize: 11, borderRadius: 8, borderColor: "rgba(239,68,68,0.12)" }}>
                Revoke
              </button>
            </div>
          ))}
          {hospitals.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--c-muted)", padding: 24, fontSize: 13 }}>No registered hospitals found.</p>
          )}
        </div>
      </Section>

      <Section title="Register Hospital Portal" subtitle="Establish node connectivity on the secure network." icon={Plus}>
        <form onSubmit={register} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <Field label="Hospital Name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <Field label="Location" placeholder="e.g. Mumbai, Maharashtra" value={location} onChange={e => setLocation(e.target.value)} required />
          </div>
          <Field label="Phone Contact" value={phone} onChange={e => setPhone(e.target.value)} />
          <Field label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Field label="Doctors Staff Count" type="number" value={totalDoctors} onChange={e => setTotalDoctors(e.target.value)} />
          <Field label="Active Patients Capacity" type="number" value={totalPatientsAdmitted} onChange={e => setTotalPatientsAdmitted(e.target.value)} />
          
          <div style={{ gridColumn: "1/-1", marginTop: 8 }}>
            <button className="btn btn-primary" style={{ width: "100%", padding: 12 }} disabled={busy}>
              Add Hospital Node
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}

// ─── User & Registries Management (Admin only) ──────────────────────────────────
function AdminUserDirectory({ patientList, loadPatients, onSelect }) {
  const [activeSubTab, setActiveSubTab] = useState("accounts");
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(true);
  
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "password123", role: "doctor", patientId: "" });
  const [patientForm, setPatientForm] = useState({ name: "", email: "", age: "", gender: "Female", bloodGroup: "O+", emergencyContact: "", diseases: "", allergies: "", medications: "" });
  const [editingPatientId, setEditingPatientId] = useState(null);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/api/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const deleteUser = async (email) => {
    if (!confirm(`Are you sure you want to permanently revoke credentials for "${email}"?`)) return;
    try {
      await api.delete(`/api/admin/users/${email}`);
      alert("Credentials revoked successfully");
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const submitUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", userForm);
      alert("New login account registered successfully");
      setUserForm({ name: "", email: "", password: "password123", role: "doctor", patientId: "" });
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed: " + (err.response?.data?.message || err.message));
    }
  };

  const submitPatient = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...patientForm,
        age: Number(patientForm.age) || 0,
        diseases: patientForm.diseases.split(",").map(s => s.trim()).filter(Boolean),
        allergies: patientForm.allergies.split(",").map(s => s.trim()).filter(Boolean),
        medications: patientForm.medications.split(",").map(s => s.trim()).filter(Boolean)
      };

      if (editingPatientId) {
        await api.put(`/api/patients/${editingPatientId}`, payload);
        alert("Patient profile updated successfully");
        setEditingPatientId(null);
      } else {
        await api.post("/api/patients", payload);
        alert("Patient card generated successfully");
      }

      setPatientForm({ name: "", email: "", age: "", gender: "Female", bloodGroup: "O+", emergencyContact: "", diseases: "", allergies: "", medications: "" });
      await loadPatients();
    } catch (err) {
      console.error(err);
      alert("Failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditPatient = (p) => {
    setEditingPatientId(p.patientId);
    setPatientForm({
      name: p.name || "",
      email: p.email || "",
      age: p.age || "",
      gender: p.gender || "Female",
      bloodGroup: p.bloodGroup || "O+",
      emergencyContact: p.emergencyContact || "",
      diseases: (p.diseases || []).join(", "),
      allergies: (p.allergies || []).join(", "),
      medications: (p.medications || []).join(", ")
    });
  };

  const handleDeletePatient = async (p) => {
    if (!confirm(`Are you sure you want to permanently delete patient profile "${p.name}" (${p.patientId})? This deletes their entire history.`)) return;
    try {
      await api.delete(`/api/patients/${p.patientId}`);
      alert("Patient record deleted successfully");
      await loadPatients();
    } catch (err) {
      console.error(err);
      alert("Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="animate-fade-up">
      <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 12, width: "fit-content" }}>
        <button className={`btn ${activeSubTab === "accounts" ? "btn-primary" : "btn-soft"}`} onClick={() => setActiveSubTab("accounts")} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8 }}>
          User Login Accounts
        </button>
        <button className={`btn ${activeSubTab === "patients" ? "btn-primary" : "btn-soft"}`} onClick={() => setActiveSubTab("patients")} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8 }}>
          Patient Registry Profiles
        </button>
        <button className={`btn ${activeSubTab === "doctors" ? "btn-primary" : "btn-soft"}`} onClick={() => setActiveSubTab("doctors")} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8 }}>
          Doctors Directory
        </button>
      </div>

      {activeSubTab === "accounts" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 16 }}>
          <Section title="System Access Logins" subtitle="View and manage credentialed users." icon={Users}>
            <div style={{ overflowY: "auto", maxHeight: 420 }}>
              {users.map((u, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--c-border)", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{u.name}</h4>
                    <span style={{ fontSize: 11, color: "var(--c-muted)" }}>{u.email}</span>
                    <span className="badge badge-rose" style={{ display: "block", marginTop: 4, width: "fit-content", fontSize: 9 }}>{u.role}</span>
                  </div>
                  <button onClick={() => deleteUser(u.email)} className="btn btn-soft text-rose-400" style={{ padding: "4px 8px", fontSize: 11 }}>
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Register Login Access" subtitle="Add new doctor, admin, or patient credential accounts." icon={Plus}>
            <form onSubmit={submitUser} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Full Name" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
              <Field label="Email Address" type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
              <Field label="Password" type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required />
              <label className="block">
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--c-muted)", display: "block", marginBottom: 6 }}>Role</span>
                <select className="input" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                  <option value="doctor">Licensed Doctor / Clinician</option>
                  <option value="admin">System Admin</option>
                  <option value="patient">Patient Profile</option>
                </select>
              </label>
              {userForm.role === "patient" && (
                <Field label="Linked HealthVault ID (HVAI-XXXXXX)" value={userForm.patientId} onChange={e => setUserForm({ ...userForm, patientId: e.target.value })} required />
              )}
              <button className="btn btn-primary" style={{ marginTop: 10, padding: 12 }}>
                Create Login Credentials
              </button>
            </form>
          </Section>
        </div>
      )}

      {activeSubTab === "patients" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: 16 }}>
          <Section title="Patient Identity Cards" subtitle="Unified digital patient cards in database." icon={Users}>
            <div style={{ overflowY: "auto", maxHeight: 520 }}>
              {patientList.map(p => (
                <div key={p.patientId} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--c-border)", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{p.name}</h4>
                    <span className="mono" style={{ fontSize: 11, color: "var(--c-sky)" }}>{p.patientId}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleEditPatient(p)} className="btn btn-soft" style={{ padding: "6px 10px", fontSize: 12, borderRadius: 8 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeletePatient(p)} className="btn btn-soft text-rose-400" style={{ padding: "6px 10px", fontSize: 12, borderRadius: 8, borderColor: "rgba(239, 68, 68, 0.15)" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title={editingPatientId ? "Modify Patient Card" : "Generate Patient Card"} subtitle="Create a lifelong digital health profile card." icon={Plus}>
            <form onSubmit={submitPatient} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Full Name" value={patientForm.name} onChange={e => setPatientForm({ ...patientForm, name: e.target.value })} required />
              <Field label="Email" value={patientForm.email} onChange={e => setPatientForm({ ...patientForm, email: e.target.value })} required />
              <Field label="Age" value={patientForm.age} onChange={e => setPatientForm({ ...patientForm, age: e.target.value })} type="number" />
              <Field label="Blood Group" value={patientForm.bloodGroup} onChange={e => setPatientForm({ ...patientForm, bloodGroup: e.target.value })} />
              <Field label="Emergency Phone" value={patientForm.emergencyContact} onChange={e => setPatientForm({ ...patientForm, emergencyContact: e.target.value })} />
              <Field label="Chronic Diseases (comma-separated)" value={patientForm.diseases} onChange={e => setPatientForm({ ...patientForm, diseases: e.target.value })} />
              <Field label="Allergies (comma-separated)" value={patientForm.allergies} onChange={e => setPatientForm({ ...patientForm, allergies: e.target.value })} />
              <Field label="Medications (comma-separated)" value={patientForm.medications} onChange={e => setPatientForm({ ...patientForm, medications: e.target.value })} />
              
              <div style={{ display: "flex", gap: 8, gridColumn: "1/-1", marginTop: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: "12px" }}>
                  {editingPatientId ? "Update Patient Identity" : "Generate Digital Card"}
                </button>
                {editingPatientId && (
                  <button type="button" className="btn btn-soft" onClick={() => setEditingPatientId(null)} style={{ padding: "12px" }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </Section>
        </div>
      )}

      {activeSubTab === "doctors" && (
        <Section title="Doctors Directory" subtitle="Staff clinicians currently registered on the network." icon={Users}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email Login</th>
                  <th>Designation</th>
                  <th>Verification Node</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === "doctor").map((doc, idx) => (
                  <tr key={idx}>
                    <td><b>{doc.name}</b></td>
                    <td><span className="mono">{doc.email}</span></td>
                    <td><span className="badge">Licensed Practitioner</span></td>
                    <td><span className="badge badge-emerald">Online / Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Sidebar Navigation Tabs Configuration ────────────────────────────────────
const getTabsForRole = (role) => {
  if (role === "patient") {
    return [
      { label: "Dashboard", Icon: LayoutDashboard },
      { label: "Report Analyzer", Icon: FileText },
      { label: "AI Summary", Icon: Sparkles },
      { label: "Prescriptions", Icon: Pill },
      { label: "Appointments", Icon: CalendarDays }
    ];
  }
  if (role === "doctor") {
    return [
      { label: "Dashboard", Icon: LayoutDashboard },
      { label: "Medical History", Icon: History },
      { label: "Report Analyzer", Icon: FileText },
      { label: "AI Summary", Icon: Sparkles },
      { label: "Doctor Copilot", Icon: Bot }
    ];
  }
  if (role === "admin") {
    return [
      { label: "Dashboard", Icon: LayoutDashboard },
      { label: "User Directory", Icon: Users },
      { label: "Hospitals", Icon: Hospital }
    ];
  }
  return [];
};

// ─── Main Application Component ───────────────────────────────────────────────
function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [active, setActive] = useState("Dashboard");
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState("HVAI-0001");
  const [patient, setPatient] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === "light") {
      root.classList.add("light");
      body.classList.add("light");
    } else {
      root.classList.remove("light");
      body.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Headers propagation for API role validation
  useEffect(() => {
    if (user) {
      api.defaults.headers.common["x-user-role"] = user.role;
      api.defaults.headers.common["x-user-email"] = user.email;
      api.defaults.headers.common["x-user-patient-id"] = user.patientId || "";
    } else {
      delete api.defaults.headers.common["x-user-role"];
      delete api.defaults.headers.common["x-user-email"];
      delete api.defaults.headers.common["x-user-patient-id"];
    }
  }, [user]);

  // Handle default patient selections based on active logged-in role
  useEffect(() => {
    if (user) {
      if (user.role === "patient" && user.patientId) {
        setSelectedId(user.patientId);
      } else if (user.role === "doctor") {
        setSelectedId(""); // Doctors start with no patient selected
        setPatient(null);
      }
    }
  }, [user]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  const patientList = Array.isArray(patients) ? patients : [];
  const selected = useMemo(() => {
    if (!user) return null;
    if (user.role === "doctor" && !selectedId) return null;
    return patient || patientList.find(p => p.patientId === selectedId) || patientList[0] || null;
  }, [user, patient, patientList, selectedId]);

  const loadPatients = async () => {
    if (user?.role === "patient") return;
    try {
      const { data } = await api.get("/api/patients");
      const list = Array.isArray(data) ? data : [];
      setPatients(list);
      
      // If logged in as patient, force selection of their own profile
      if (user?.role === "patient" && user.patientId) {
        setSelectedId(user.patientId);
      }
    } catch (err) {
      console.error("Failed to load patients:", err);
      setPatients([]);
    }
  };
  
  const loadPatient = async (id = selectedId) => {
    if (!id) return;
    try {
      const { data } = await api.get(`/api/patients/${id}`);
      setPatient(data);
      if (user?.role !== "patient") {
        const listRes = await api.get("/api/patients");
        const list = Array.isArray(listRes.data) ? listRes.data : [];
        setPatients(list);
      }
    } catch (err) {
      console.error("Failed to load patient details:", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedId) {
      loadPatient(selectedId);
    }
  }, [selectedId, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPatient(null);
    setPatients([]);
    setActive("Dashboard");
  };

  const handleDeleteEvent = async (historyId) => {
    if (!selected) return;
    if (!confirm("Are you sure you want to permanently delete this clinical record from patient history?")) return;
    try {
      await api.delete(`/api/patients/${selected.patientId}/history/${historyId}`);
      await loadPatient(selected.patientId);
      alert("Timeline event deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditEvent = (visit) => {
    setEditingEvent(visit);
    setActive("Medical History");
  };

  const patientSelect = user?.role === "patient" ? null : (
    <select className="input" style={{ maxWidth: 380 }} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
      {user?.role === "doctor" && <option value="">-- Select Patient --</option>}
      {patientList.map(p => (
        <option className="text-black" key={p.patientId} value={p.patientId}>
          {p.name} — {p.patientId}
        </option>
      ))}
    </select>
  );

  // Return Landing Page or Login screen if not authenticated
  if (!user) {
    if (showLanding) {
      return <LandingPage onGoToLogin={() => setShowLanding(false)} theme={theme} toggleTheme={toggleTheme} />;
    }
    return <LoginPortal onLoginSuccess={(loggedInUser) => {
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setShowLanding(true);
    }} theme={theme} toggleTheme={toggleTheme} onBackToLanding={() => setShowLanding(true)} />;
  }

  // Derive visible sidebar tabs based on role
  const roleTabs = getTabsForRole(user.role);

  return (
    <main style={{ minHeight: "100vh", padding: "16px 20px 32px", maxWidth: 1600, margin: "0 auto" }}>
      <Header user={user} onLogout={handleLogout} toggleTheme={toggleTheme} theme={theme} />

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 20 }}>
        
        {/* ── Sidebar Nav ── */}
        <aside className="glass" style={{ borderRadius: 16, padding: 12, height: "fit-content", position: "sticky", top: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px 14px", borderBottom: "1px solid var(--c-border)", marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#0284c7,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(79,70,229,0.3)" }}>
              <HeartPulse size={16} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.1 }}>HealthVault</div>
              <div style={{ fontSize: 10, color: "var(--c-muted)", fontWeight: 500 }}>Monorepo MVP</div>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {roleTabs.map(({ label, Icon: NavIcon }) => (
              <button
                key={label}
                className={`nav-item${active === label ? " active" : ""}`}
                onClick={() => setActive(label)}
              >
                <NavIcon size={15} className="nav-icon" style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>
                  {label === "Dashboard" && user.role === "admin" ? "Admin Console" : label}
                </span>
                {active === label && <ChevronRight size={12} style={{ color: "var(--c-sky)", opacity: 0.6 }} />}
              </button>
            ))}
          </nav>

          <div style={{
            marginTop: 14, padding: "10px 12px", borderRadius: 10,
            background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)",
            fontSize: 11, color: "var(--c-emerald)", lineHeight: 1.5,
          }}>
            <Zap size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "text-bottom" }} />
            Connected as <b>{user.role}</b> in Secure SSL Sandbox mode.
          </div>
        </aside>

        {/* ── Main content pane ── */}
        <section>
          {user.role === "admin" ? (
            <>
              {active === "Dashboard" && <AdminDashboard />}
              {active === "User Directory" && <AdminUserDirectory patientList={patientList} loadPatients={loadPatients} onSelect={setSelectedId} />}
              {active === "Hospitals" && <HospitalsManagement />}
            </>
          ) : user.role === "doctor" ? (
            <>
              {active === "Dashboard"       && <Dashboard patients={patientList} selected={selected} onSelect={setSelectedId} setActive={setActive} onEditEvent={handleEditEvent} onDeleteEvent={handleDeleteEvent} userRole={user.role} />}
              {active === "Medical History" && <HistoryPage selected={selected} patientSelect={patientSelect} reload={loadPatient} editingEvent={editingEvent} setEditingEvent={setEditingEvent} onEditEvent={handleEditEvent} onDeleteEvent={handleDeleteEvent} userRole={user.role} />}
              {active === "Report Analyzer" && <Reports selected={selected} patientSelect={patientSelect} reload={loadPatient} />}
              {active === "AI Summary"      && <Summary selected={selected} patientSelect={patientSelect} />}
              {active === "Doctor Copilot"  && <Copilot selected={selected} patientSelect={patientSelect} />}
            </>
          ) : ( // patient role
            <>
              {active === "Dashboard"       && <Dashboard patients={patientList} selected={selected} onSelect={setSelectedId} setActive={setActive} onEditEvent={handleEditEvent} onDeleteEvent={handleDeleteEvent} userRole={user.role} />}
              {active === "Report Analyzer" && <Reports selected={selected} patientSelect={patientSelect} reload={loadPatient} />}
              {active === "AI Summary"      && <Summary selected={selected} patientSelect={patientSelect} />}
              {active === "Prescriptions"   && <Prescriptions selected={selected} patientSelect={patientSelect} />}
              {active === "Appointments"    && <Appointments selected={selected} patientSelect={patientSelect} userRole={user.role} reload={loadPatient} />}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

// ─── LANDING PAGE COMPONENT ──────────────────────────────────────────────────
function LandingPage({ onGoToLogin, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ── Sticky Navbar ── */}
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="landing-nav-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #0ea5e9, #4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(79,70,229,0.3)"
            }}>
              <HeartPulse size={18} style={{ color: "#fff" }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.03em" }}>
              <span className="grad-text">HealthVault</span> <span style={{ color: "var(--c-text)" }}>AI</span>
            </span>
          </div>

          <ul className="landing-nav-links">
            <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>Home</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollTo("features"); }}>Features</a></li>
            <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo("how-it-works"); }}>How It Works</a></li>
            <li><a href="#safety" onClick={(e) => { e.preventDefault(); scrollTo("safety"); }}>Safety</a></li>
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={toggleTheme} className="btn btn-soft" style={{ padding: 8, borderRadius: 10 }} title="Toggle Theme">
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} style={{ color: "#fbbf24" }} />}
            </button>
            <button onClick={onGoToLogin} className="btn btn-primary" style={{ padding: "9px 20px", fontSize: 13, borderRadius: 10 }}>
              <Key size={14} />
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="landing-hero" id="hero">
        <div className="landing-hero-bg" />
        <div className="landing-hero-blob" style={{ width: 300, height: 300, background: "rgba(56,189,248,0.15)", top: "10%", left: "5%" }} />
        <div className="landing-hero-blob" style={{ width: 250, height: 250, background: "rgba(99,102,241,0.12)", bottom: "15%", right: "8%", animationDelay: "4s" }} />

        <div className="landing-hero-inner">
          <div className="landing-hero-text">
            <div className="landing-section-badge">
              <ShieldCheck size={13} />
              Trusted Digital Health Platform
            </div>
            <h1>
              <span className="grad-text">HealthVault</span>{" "}
              <span style={{ color: "var(--c-text)" }}>AI</span>
            </h1>
            <p className="hero-tagline">
              A lifelong portable digital medical identity that follows a patient across hospitals. One Patient. One HealthVault ID. One Lifelong Medical History.
            </p>
            <div className="hero-cta-group">
              <button onClick={onGoToLogin} className="btn btn-primary">
                <Zap size={16} />
                Get Started
              </button>
              <button onClick={() => scrollTo("features")} className="btn btn-soft" style={{ border: "1px solid var(--c-border)" }}>
                <Eye size={16} />
                Explore Features
              </button>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="floating-health-card">
              {/* Decorative overlays */}
              <div style={{ position: "absolute", right: -30, bottom: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: -15, top: -15, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ position: "relative", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <ShieldCheck size={12} style={{ color: "var(--c-sky)" }} />
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--c-sky)" }}>Digital Health Card</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Aisha Khan</h3>
                <span className="mono" style={{ fontSize: 11, color: "var(--c-sky)", background: "rgba(56,189,248,0.06)", border: "1px solid var(--c-border)", padding: "2px 8px", borderRadius: 6, display: "inline-block", marginTop: 4 }}>HVAI-0001</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, borderTop: "1px solid var(--c-border)", paddingTop: 14 }}>
                <div>
                  <span style={{ display: "block", fontSize: 8, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Blood Group</span>
                  <span className="badge badge-rose" style={{ fontSize: 10 }}>B+</span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: 8, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Emergency</span>
                  <span style={{ color: "var(--c-text)", fontSize: 11, fontWeight: 700 }}>+91 90001</span>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <span style={{ display: "block", fontSize: 8, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Allergies</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <span className="badge badge-emerald" style={{ fontSize: 9 }}>Penicillin</span>
                    <span className="badge badge-emerald" style={{ fontSize: 9 }}>Dust</span>
                  </div>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <span style={{ display: "block", fontSize: 8, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Chronic Conditions</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <span className="badge badge-amber" style={{ fontSize: 9 }}>Asthma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", animation: "float 2s ease-in-out infinite" }}>
          <ChevronDown size={22} style={{ color: "var(--c-muted)", opacity: 0.5 }} />
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section className="landing-section" id="problem" style={{ background: "rgba(0,0,0,0.02)" }}>
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <div className="landing-section-badge"><AlertTriangle size={13} /> The Problem</div>
            <h2>Fragmented Medical Records <span className="grad-text">Cost Lives</span></h2>
            <p>Patients visit multiple hospitals throughout their lives. Medical history gets scattered, creating dangerous gaps in treatment decisions.</p>
          </div>

          <div className="problem-stats">
            <div className="problem-stat">
              <div className="stat-value" style={{ color: "var(--c-rose)" }}>86%</div>
              <div className="stat-label">of patients lack portable medical history across hospitals</div>
            </div>
            <div className="problem-stat">
              <div className="stat-value" style={{ color: "#d97706" }}>$750B</div>
              <div className="stat-label">wasted annually on repeated diagnostic tests worldwide</div>
            </div>
            <div className="problem-stat">
              <div className="stat-value" style={{ color: "var(--c-sky)" }}>44%</div>
              <div className="stat-label">of doctors report lacking patient history at critical moments</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solution Section ── */}
      <section className="landing-section" id="solution">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <div className="landing-section-badge"><Sparkles size={13} /> The Solution</div>
            <h2>One Patient. One <span className="grad-text">HealthVault ID</span>. One Lifelong History.</h2>
            <p>Every patient receives a unique digital health identity card that stores their entire medical history, accessible from any connected hospital.</p>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="landing-section" id="features" style={{ background: "rgba(0,0,0,0.02)" }}>
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <div className="landing-section-badge"><Zap size={13} /> Platform Features</div>
            <h2>Everything You Need for <span className="grad-text">Digital Health</span></h2>
            <p>From AI-powered report analysis to cross-hospital medical timelines, HealthVault AI covers every aspect of modern healthcare management.</p>
          </div>

          <div className="feature-grid">
            {[
              { icon: QrCode, title: "Digital Identity Card", desc: "QR-code enabled health card with allergies, chronic conditions, blood group, medications, and emergency contact — accessible instantly.", color: "var(--c-sky)" },
              { icon: FileText, title: "AI Report Analyzer", desc: "Upload medical reports and prescriptions. Our AI extracts, classifies, and explains findings with OCR-powered precision.", color: "var(--c-indigo)" },
              { icon: History, title: "Lifelong Health Timeline", desc: "Every hospital visit, prescription, diagnosis, and lab finding mapped chronologically across your entire medical journey.", color: "var(--c-emerald)" },
              { icon: Brain, title: "Doctor Copilot (RAG)", desc: "AI assistant that answers clinical queries grounded strictly in patient records — zero hallucination, retrieval-augmented.", color: "var(--c-violet)" },
              { icon: Activity, title: "Smart Triage", desc: "AI-powered symptom analysis that assesses urgency, recommends specialists, and provides evidence-based clinical rationale.", color: "var(--c-rose)" },
              { icon: Globe, title: "Cross-Hospital Portable", desc: "One HealthVault ID works across all connected hospitals. Doctors scan, access, and update records in real-time.", color: "#06b6d4" }
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-card-icon" style={{ background: `${f.color}12` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="landing-section" id="how-it-works">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <div className="landing-section-badge"><TrendingUp size={13} /> How It Works</div>
            <h2>Get Started in <span className="grad-text">4 Simple Steps</span></h2>
            <p>From registration to lifelong health tracking, the process is designed for simplicity and security.</p>
          </div>

          <div className="steps-grid">
            {[
              { num: "1", title: "Register", desc: "Create your patient account and receive a unique HealthVault ID instantly." },
              { num: "2", title: "Get Your Card", desc: "Your digital health card is generated with QR code, allergies, blood group, and more." },
              { num: "3", title: "Visit Hospital", desc: "Doctor scans your QR code to access your complete medical history and add new records." },
              { num: "4", title: "Access Anywhere", desc: "Your health identity follows you across all connected hospitals for life." }
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portal Previews ── */}
      <section className="landing-section" id="portals" style={{ background: "rgba(0,0,0,0.02)" }}>
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <div className="landing-section-badge"><Users size={13} /> Role-Based Access</div>
            <h2>Three Portals. <span className="grad-text">One Platform.</span></h2>
            <p>Each role gets a tailored experience designed for their specific healthcare workflow.</p>
          </div>

          <div className="portal-grid">
            <div className="portal-card">
              <div className="portal-card-icon" style={{ background: "rgba(56,189,248,0.08)" }}>
                <User size={26} style={{ color: "var(--c-sky)" }} />
              </div>
              <h3>Patient Portal</h3>
              <p>Own your health data with full visibility and control.</p>
              <ul>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> View HealthVault Card</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Medical Timeline</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Upload Reports</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> AI Health Summary</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Book Appointments</li>
              </ul>
            </div>

            <div className="portal-card">
              <div className="portal-card-icon" style={{ background: "rgba(99,102,241,0.08)" }}>
                <Stethoscope size={26} style={{ color: "var(--c-indigo)" }} />
              </div>
              <h3>Doctor Portal</h3>
              <p>Access patient records for informed treatment decisions.</p>
              <ul>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Search by HealthVault ID</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> View Patient Card</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Add Hospital Visits</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Doctor Copilot AI</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Analyze Reports</li>
              </ul>
            </div>

            <div className="portal-card">
              <div className="portal-card-icon" style={{ background: "rgba(167,139,250,0.08)" }}>
                <ShieldCheck size={26} style={{ color: "var(--c-violet)" }} />
              </div>
              <h3>Admin Portal</h3>
              <p>Full system oversight and user management controls.</p>
              <ul>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Manage User Accounts</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Patient Registry</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Register Hospitals</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> System Analytics</li>
                <li><CheckCircle size={12} style={{ color: "var(--c-emerald)" }} /> Doctors Directory</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Safety Section ── */}
      <section className="landing-section" id="safety">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <div className="landing-section-badge"><ShieldCheck size={13} /> AI Safety & Trust</div>
            <h2>Built with <span className="grad-text">Responsible AI</span></h2>
            <p>Every AI output is evaluated for accuracy, grounded in real patient records, and transparently scored for confidence.</p>
          </div>

          <div className="safety-grid">
            <div className="safety-card">
              <div className="safety-card-icon" style={{ background: "rgba(52,211,153,0.08)" }}>
                <ShieldCheck size={24} style={{ color: "var(--c-emerald)" }} />
              </div>
              <h3>Hallucination Detection</h3>
              <p>Every AI response is scored for hallucination risk. Unsupported claims are flagged and displayed transparently.</p>
            </div>
            <div className="safety-card">
              <div className="safety-card-icon" style={{ background: "rgba(56,189,248,0.08)" }}>
                <Fingerprint size={24} style={{ color: "var(--c-sky)" }} />
              </div>
              <h3>OCR Confidence Scoring</h3>
              <p>Medical reports processed via Gemini Vision OCR include confidence metrics so you know exactly how reliable the extraction is.</p>
            </div>
            <div className="safety-card">
              <div className="safety-card-icon" style={{ background: "rgba(167,139,250,0.08)" }}>
                <Lock size={24} style={{ color: "var(--c-violet)" }} />
              </div>
              <h3>RAG-Verified Answers</h3>
              <p>Doctor Copilot uses Retrieval-Augmented Generation — answers are grounded in real patient records, never fabricated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <h2>Ready to Transform Healthcare?</h2>
          <p>Join HealthVault AI and give every patient a lifelong portable digital medical identity.</p>
          <button onClick={onGoToLogin} className="btn" style={{ borderRadius: 14 }}>
            <ArrowRight size={16} />
            Get Started Now
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #0ea5e9, #4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <HeartPulse size={14} style={{ color: "#fff" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15 }}>
              <span className="grad-text">HealthVault</span> AI
            </span>
          </div>
          <p>A lifelong portable digital medical identity platform.</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            Built by <b>Mahek Jahan</b> • Anurag University • Computer Science & Engineering • 2026
          </p>
          <div className="footer-tech-badges">
            <span>React</span>
            <span>Vite</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>MongoDB</span>
            <span>Gemini Vision</span>
            <span>Groq Llama</span>
          </div>
          <p style={{ fontSize: 11, marginTop: 16, opacity: 0.6 }}>
            © 2026 HealthVault AI. All rights reserved. For academic demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── LOGIN PORTAL COMPONENT ──────────────────────────────────────────────────
// ─── LOGIN PORTAL COMPONENT ──────────────────────────────────────────────────
function LoginPortal({ onLoginSuccess, theme, toggleTheme, onBackToLanding }) {

  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regGender, setRegGender] = useState("Female");
  const [regBloodGroup, setRegBloodGroup] = useState("O+");
  const [regEmergencyContact, setRegEmergencyContact] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccessMessage("");
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      onLoginSuccess(data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to sign in. Please verify credentials.");
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccessMessage("");
    try {
      const { data } = await api.post("/api/auth/register-patient", {
        name: regName,
        email: regEmail,
        password: regPassword,
        age: regAge,
        gender: regGender,
        bloodGroup: regBloodGroup,
        emergencyContact: regEmergencyContact
      });
      setSuccessMessage(`Account created successfully! Your HealthVault ID is: ${data.patient.patientId}. You can now log in.`);
      setEmail(data.patient.patientId); // Auto-fill login field
      setPassword(regPassword); // Auto-fill password field
      setIsRegistering(false); // Switch to sign in view
      // Reset registration form
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegAge("");
      setRegGender("Female");
      setRegBloodGroup("O+");
      setRegEmergencyContact("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to register profile. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleQuickSignIn = (roleEmail) => {
    setEmail(roleEmail);
    setPassword("password123");
    setIsRegistering(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", padding: 20,
      position: "relative"
    }}>
      {/* Floating background shapes */}
      <div className="login-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      {/* Back to landing page link */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          style={{
            position: "absolute", top: 24, left: 24,
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            color: "var(--c-muted)", fontSize: 13, fontWeight: 600,
            fontFamily: "inherit", padding: "8px 14px", borderRadius: 10,
            transition: "color 0.2s ease, background 0.2s ease",
            zIndex: 2
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--c-text)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--c-muted)"; e.currentTarget.style.background = "none"; }}
        >
          <ArrowLeft size={15} />
          Back to Home
        </button>
      )}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn btn-soft"
        style={{ position: "absolute", top: 24, right: 24, padding: 8, borderRadius: 10, zIndex: 2 }}
        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === "light" ? <Moon size={15} /> : <Sun size={15} style={{ color: "#fbbf24" }} />}
      </button>

      <div className="glass shadow-2xl transition-all duration-300 animate-fade-up" style={{
        maxWidth: isRegistering ? 540 : 460, width: "100%", padding: "40px", borderRadius: "28px",
        position: "relative", zIndex: 1
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #0ea5e9, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: "0 6px 20px rgba(79,70,229,0.3)"
          }}>
            <HeartPulse size={26} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 6px" }}>

            <span className="grad-text">HealthVault</span> AI
          </h2>
          <p style={{ color: "var(--c-muted)", fontSize: 13, margin: 0 }}>
            {isRegistering ? "Register Lifelong Health Identity Card" : "Production-Grade Lifelong Medical History Portal"}
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: 16, padding: "10px 14px", borderRadius: 10,
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
            fontSize: 12, color: "var(--c-rose)", display: "flex", alignItems: "center", gap: 8
          }}>
            <ShieldAlert size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div style={{
            marginBottom: 16, padding: "10px 14px", borderRadius: 10,
            background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)",
            fontSize: 12, color: "var(--c-emerald)", display: "flex", alignItems: "center", gap: 8
          }}>
            <CheckCircle size={14} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Email Address or HealthVault ID" type="text" value={email} onChange={e => setEmail(e.target.value)} required placeholder="e.g. patient@healthvault.ai or HVAI-0001" />
            <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            
            <button className="btn btn-primary" style={{ width: "100%", padding: 13, marginTop: 6 }} disabled={busy}>
              <Key size={14} />
              {busy ? "Signing In..." : "Secure Login"}
            </button>
            
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--c-muted)", margin: "8px 0 0" }}>
              New patient?{" "}
              <button type="button" onClick={() => { setIsRegistering(true); setError(""); setSuccessMessage(""); }} style={{ background: "none", border: "none", color: "var(--c-sky)", fontWeight: 700, cursor: "pointer", padding: 0 }}>
                Register & Get HealthVault Card
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <Field label="Full Name" type="text" value={regName} onChange={e => setRegName(e.target.value)} required placeholder="Aisha Khan" />
              </div>
              <Field label="Email Address" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required placeholder="aisha@example.com" />
              <Field label="Password" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required placeholder="••••••••" />
              <Field label="Age" type="number" value={regAge} onChange={e => setRegAge(e.target.value)} placeholder="28" />
              
              <label className="block">
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--c-muted)", display: "block", marginBottom: 6 }}>Gender</span>
                <select className="input" value={regGender} onChange={e => setRegGender(e.target.value)}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block">
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--c-muted)", display: "block", marginBottom: 6 }}>Blood Group</span>
                <select className="input" value={regBloodGroup} onChange={e => setRegBloodGroup(e.target.value)}>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </label>

              <div style={{ gridColumn: "1/-1" }}>
                <Field label="Emergency Phone" type="tel" value={regEmergencyContact} onChange={e => setRegEmergencyContact(e.target.value)} placeholder="+91 90000 00009" />
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: "100%", padding: 13, marginTop: 10 }} disabled={busy}>
              <User size={14} />
              {busy ? "Generating Identity..." : "Register & Generate Card"}
            </button>

            <p style={{ textAlign: "center", fontSize: 13, color: "var(--c-muted)", margin: "8px 0 0" }}>
              Already registered?{" "}
              <button type="button" onClick={() => { setIsRegistering(false); setError(""); setSuccessMessage(""); }} style={{ background: "none", border: "none", color: "var(--c-sky)", fontWeight: 700, cursor: "pointer", padding: 0 }}>
                Sign In Instead
              </button>
            </p>
          </form>
        )}

        {/* Quick Demo Sign In Panel */}
        <div style={{ marginTop: 20, borderTop: "1px solid var(--c-border)", paddingTop: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-muted)", marginBottom: 10, textAlign: "center" }}>
            Quick Demo Sign-In
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            <button onClick={() => handleQuickSignIn("patient@healthvault.ai")} className="btn btn-soft" style={{ fontSize: 12, padding: "8px 12px", justifyContent: "flex-start" }}>
              <User size={13} style={{ marginRight: 6 }} /> Log In as <b>Aisha Khan (Patient)</b>
            </button>
            <button onClick={() => handleQuickSignIn("doctor@healthvault.ai")} className="btn btn-soft" style={{ fontSize: 12, padding: "8px 12px", justifyContent: "flex-start" }}>
              <Stethoscope size={13} style={{ marginRight: 6 }} /> Log In as <b>Dr. Jenkins (Doctor)</b>
            </button>
            <button onClick={() => handleQuickSignIn("admin@healthvault.ai")} className="btn btn-soft" style={{ fontSize: 12, padding: "8px 12px", justifyContent: "flex-start" }}>
              <Users size={13} style={{ marginRight: 6 }} /> Log In as <b>System Admin (Admin)</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── ADMIN DASHBOARD PANEL ────────────────────────────────────────────────────
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(true);

  const loadStats = async () => {
    try {
      const { data } = await api.get("/api/admin/stats");
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  if (busy) {
    return <div style={{ color: "var(--c-muted)", padding: 40, textAlign: "center" }}>Loading admin insights data...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <StatCard icon={UserRound} label="Total Patient Identity Cards" value={stats?.totalPatients} color="var(--c-sky)" />
        <StatCard icon={Stethoscope} label="Licensed Doctors" value={stats?.totalDoctors} color="var(--c-indigo)" />
        <StatCard icon={FileText} label="OCR Reports Indexed" value={stats?.totalReports} color="var(--c-emerald)" />
        <StatCard icon={CalendarDays} label="Clinical Visits Logged" value={stats?.totalVisits} color="#06b6d4" />
        <StatCard icon={ShieldCheck} label="AI Safety Confidence Index" value={`${stats?.safetyScore}%`} color="var(--c-violet)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        <Section title="System Activity Log" subtitle="Real-time clinical processing queue." icon={Activity}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {stats?.recentActivity.map(act => (
              <div key={act.id} style={{
                padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--c-border)", display: "flex", justify: "space-between", alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--c-emerald)" }} />
                  <span style={{ fontSize: 13 }}>{act.action}</span>
                </div>
                <span className="badge" style={{ fontSize: 10 }}>{act.time}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Server Status & Connections" subtitle="HealthVault monorepo nodes." icon={HeartPulse}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { node: "REST Server Endpoint", status: "Online", latency: "12ms" },
              { node: "Gemini Vision OCR Client", status: "Connected", latency: "145ms" },
              { node: "Groq Llama API Node", status: "Connected", latency: "210ms" },
              { node: "MongoDB Cluster Primary", status: "Active", latency: "45ms" }
            ].map((n, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--c-border)" }}>
                <div>
                  <b style={{ fontSize: 13, color: "var(--c-text)" }}>{n.node}</b>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--c-muted)" }}>{n.latency}</span>
                  <span className="badge badge-emerald" style={{ fontSize: 10 }}>{n.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

// ─── USER MANAGEMENT (ADMIN ONLY) ────────────────────────────────────────────
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "password123", role: "doctor", patientId: "" });

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/api/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", form);
      alert("User account registered successfully");
      setForm({ name: "", email: "", password: "password123", role: "doctor", patientId: "" });
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteUser = async (email) => {
    if (!confirm(`Are you sure you want to delete credential logins for "${email}"?`)) return;
    try {
      await api.delete(`/api/admin/users/${email}`);
      alert("User deleted");
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 16 }}>
      <Section title="Account Listing" subtitle="Credential access controls." icon={Users}>
        <div style={{ overflowY: "auto", maxHeight: 500 }}>
          {users.map((u, i) => (
            <div key={i} style={{
              padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--c-border)", marginBottom: 8,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{u.name}</h4>
                <span style={{ fontSize: 11, color: "var(--c-muted)" }}>{u.email}</span>
                <span className="badge badge-emerald" style={{ display: "block", marginTop: 4, width: "fit-content", fontSize: 9 }}>{u.role}</span>
              </div>
              <button onClick={() => deleteUser(u.email)} className="btn btn-soft text-rose-400" style={{ padding: "4px 8px", fontSize: 11 }}>
                Revoke
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Create Logins" subtitle="Provide clinician or administrative access." icon={Plus}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Field label="Email Address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Field label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <label className="block">
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--c-muted)", display: "block", marginBottom: 6 }}>Role</span>
            <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="doctor">Licensed Doctor / Clinician</option>
              <option value="admin">System Admin</option>
              <option value="patient">Patient Profile</option>
            </select>
          </label>
          {form.role === "patient" && (
            <Field label="Linked HealthVault ID (HVAI-XXXXXX)" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required />
          )}
          <button className="btn btn-primary" style={{ marginTop: 10, padding: 12 }}>
            Register New Account
          </button>
        </form>
      </Section>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ patients, selected, onSelect, setActive, onEditEvent, onDeleteEvent, userRole }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  
  const totalVisits = selected?.visits?.length || 0;
  const totalReports = selected?.reports?.length || 0;
  const chronicConditionsCount = selected?.diseases?.length || 0;

  const lastUpdated = useMemo(() => {
    if (!selected) return "N/A";
    const dates = [
      ...(selected.visits || []).map(v => v.date),
      ...(selected.reports || []).map(r => r.uploadedAt?.slice(0, 10))
    ].filter(Boolean);
    if (!dates.length) return "N/A";
    dates.sort();
    return dates[dates.length - 1];
  }, [selected]);

  const aiSafetyScore = useMemo(() => {
    if (!selected) return "100%";
    const reports = selected.reports || [];
    const evals = reports.map(r => r.evaluation?.confidenceScore).filter(score => score !== undefined);
    if (!evals.length) return "98.5%";
    const avg = evals.reduce((a, b) => a + b, 0) / evals.length;
    return `${avg.toFixed(1)}%`;
  }, [selected]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase();
    return patients.filter(p => 
      p.patientId.toLowerCase().includes(q) || 
      p.name.toLowerCase().includes(q)
    );
  }, [patients, searchQuery]);

  const scannerModal = showScanner && (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(2, 8, 23, 0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      padding: 20
    }}>
      <div className="card shadow-glow" style={{
        maxWidth: 480, width: "100%", padding: 28, background: "var(--c-surface)",
        border: "2px solid var(--c-border-hi)", borderRadius: 24, textAlign: "center"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ScanLine size={18} style={{ color: "var(--c-emerald)" }} />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "var(--c-text)" }}>HealthVault ID Scanner</h3>
          </div>
          <button 
            onClick={() => setShowScanner(false)} 
            className="btn btn-soft" 
            style={{ padding: "4px 8px", fontSize: 12 }}
          >
            ✕ Close
          </button>
        </div>

        <p style={{ color: "var(--c-muted)", fontSize: 13, marginBottom: 20 }}>
          Simulate scanning a patient's HealthVault digital card QR code below.
        </p>

        {/* Scanning Viewport Simulation */}
        <div style={{
          width: 200, height: 200, margin: "0 auto 24px", background: "#090e1b",
          border: "2px solid var(--c-border-hi)", borderRadius: 16, position: "relative",
          overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {/* Corner brackets */}
          <div style={{ position: "absolute", top: 12, left: 12, width: 16, height: 16, borderTop: "3px solid #10b981", borderLeft: "3px solid #10b981" }} />
          <div style={{ position: "absolute", top: 12, right: 12, width: 16, height: 16, borderTop: "3px solid #10b981", borderRight: "3px solid #10b981" }} />
          <div style={{ position: "absolute", bottom: 12, left: 12, width: 16, height: 16, borderBottom: "3px solid #10b981", borderLeft: "3px solid #10b981" }} />
          <div style={{ position: "absolute", bottom: 12, right: 12, width: 16, height: 16, borderBottom: "3px solid #10b981", borderRight: "3px solid #10b981" }} />

          {isScanning ? (
            <>
              <div className="scan-laser" />
              <div style={{ color: "#10b981", fontSize: 12, fontWeight: 700, animation: "pulse-glow 1.5s infinite" }}>
                PROCESSING ENCRYPTED DATA...
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <QrCode size={48} style={{ opacity: 0.25 }} />
              <span style={{ fontSize: 11, color: "var(--c-muted)" }}>Awaiting Device scan</span>
            </div>
          )}
        </div>

        {/* Quick simulated scan options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--c-muted)", margin: 0, textAlign: "left" }}>
            Select Patient QR Card to Scan:
          </p>
          {patients.map(p => (
            <button
              key={p.patientId}
              className="btn btn-soft"
              style={{ justifyContent: "space-between", padding: "12px 16px" }}
              disabled={isScanning}
              onClick={async () => {
                setIsScanning(true);
                // Mock scanning duration
                await new Promise(resolve => setTimeout(resolve, 1500));
                setIsScanning(false);
                setShowScanner(false);
                onSelect(p.patientId);
                alert(`Card successfully scanned! Active patient loaded: ${p.name} (${p.patientId})`);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <User size={14} style={{ color: "var(--c-sky)" }} />
                <span style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</span>
              </div>
              <span className="mono" style={{ fontSize: 11, color: "var(--c-sky)" }}>{p.patientId}</span>
            </button>
          ))}
          {patients.length === 0 && (
            <p style={{ color: "var(--c-muted)", fontSize: 12 }}>No patient profiles registered in system yet.</p>
          )}
        </div>
      </div>
    </div>
  );

  const qrModal = showQRModal && selected && (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(2, 8, 23, 0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      padding: 20
    }} onClick={() => setShowQRModal(false)}>
      <div className="card shadow-glow animate-fade-up" style={{
        maxWidth: 400, width: "100%", padding: 28, background: "var(--c-surface)",
        border: "2px solid var(--c-border-hi)", borderRadius: 24, textAlign: "center"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <QrCode size={18} style={{ color: "var(--c-sky)" }} />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "var(--c-text)" }}>Patient Identity QR</h3>
          </div>
          <button 
            onClick={() => setShowQRModal(false)} 
            className="btn btn-soft" 
            style={{ padding: "4px 8px", fontSize: 12 }}
          >
            ✕ Close
          </button>
        </div>
        
        <div style={{
          width: 220, height: 220, margin: "0 auto 20px", background: "#fff",
          border: "1px solid var(--c-border)", borderRadius: 16, padding: 12,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${selected.patientId}`} 
            alt="QR Code" 
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
        
        <h4 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800 }}>{selected.name}</h4>
        <span className="mono" style={{ fontSize: 12, color: "var(--c-sky)", background: "rgba(56,189,248,0.06)", border: "1px solid var(--c-border)", padding: "2px 8px", borderRadius: 6, display: "inline-block", marginBottom: 16 }}>
          {selected.patientId}
        </span>
        
        <p style={{ color: "var(--c-muted)", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
          {userRole === "patient" 
            ? "Show this QR code to your consulting doctor at any connected clinic or hospital to securely transfer your medical identity card and timeline."
            : "This QR code contains the secure digital signature for this patient identity card."
          }
        </p>
      </div>
    </div>
  );

  // Patient Dashboard loading fallback
  if (userRole === "patient" && !selected) {
    return (
      <div className="card shadow-md animate-fade-up" style={{ padding: 40, textAlign: "center", color: "var(--c-muted)" }}>
        <HeartPulse size={48} style={{ margin: "0 auto 16px", opacity: 0.3, color: "var(--c-sky)", animation: "float 2s infinite" }} />
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--c-text)", margin: "0 0 8px" }}>Loading Your HealthVault Profile...</h3>
        <p style={{ maxWidth: 420, margin: "0 auto", fontSize: 13, lineHeight: 1.5 }}>
          Retrieving your secure digital health card and clinical timeline.
        </p>
      </div>
    );
  }

  // Doctor Dashboard - patient search section first if no patient is active
  if (userRole === "doctor" && !selected) {
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="animate-fade-up">
          <Section 
            title="Patient Directory Lookup" 
            subtitle="Search and select a patient by HealthVault ID or name to view their lifelong medical identity." 
            icon={Search}
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <input 
                className="input" 
                type="text" 
                placeholder="Search by Patient HealthVault ID (e.g. HVAI-0001) or Name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: 14 }}
              />
              <button 
                className="btn btn-soft" 
                onClick={() => {
                  setShowScanner(true);
                  setIsScanning(false);
                }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px" }}
              >
                <ScanLine size={16} style={{ color: "var(--c-sky)" }} />
                Scan QR Code
              </button>
              {searchQuery && (
                <button className="btn btn-soft" onClick={() => setSearchQuery("")} style={{ padding: "0 16px" }}>
                  Clear Search
                </button>
              )}
            </div>

            <div style={{ overflowX: "auto", maxHeight: 450 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>HealthVault ID</th>
                    <th>Name</th>
                    <th>Age / Gender</th>
                    <th>Blood Group</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(p => (
                    <tr key={p.patientId} onClick={() => onSelect(p.patientId)} style={{ cursor: "pointer" }}>
                      <td><span className="mono" style={{ color: "var(--c-sky)", fontSize: 13, fontWeight: 700 }}>{p.patientId}</span></td>
                      <td><span style={{ fontWeight: 700 }}>{p.name}</span></td>
                      <td style={{ color: "var(--c-muted)" }}>{p.age}y • {p.gender}</td>
                      <td><span className="badge">{p.bloodGroup}</span></td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: 12, borderRadius: 8 }}>
                          Load Identity
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", color: "var(--c-muted)", padding: 32 }}>
                        No patients found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
        {scannerModal}
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="animate-fade-up">
        
        {userRole === "doctor" && selected && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(56,189,248,0.05)", border: "1px solid var(--c-border)", padding: "10px 16px", borderRadius: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--c-emerald)" }} />
              <span style={{ fontSize: 13, color: "var(--c-muted)" }}>
                Active Patient: <b style={{ color: "var(--c-text)" }}>{selected.name}</b> (<span className="mono" style={{ color: "var(--c-sky)" }}>{selected.patientId}</span>)
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                className="btn btn-soft" 
                onClick={() => {
                  setShowScanner(true);
                  setIsScanning(false);
                }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, borderRadius: 8 }}
              >
                <ScanLine size={14} style={{ color: "var(--c-sky)" }} />
                Quick Scan
              </button>
              <button className="btn btn-soft" onClick={() => onSelect("")} style={{ padding: "6px 12px", fontSize: 12, borderRadius: 8 }}>
                Switch / Search
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 16, alignItems: "stretch" }}>
          
          {/* Left Side: Prominent Digital Card */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <HealthVaultCard patient={selected} setActive={setActive} onQRClick={() => setShowQRModal(true)} userRole={userRole} />
          </div>

          {/* Right Side: Quick Stats and directory search for Doctor */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            {/* Dashboard Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <StatCard icon={CalendarDays} label="Total Visits"      value={totalVisits}             color="var(--c-sky)" />
              <StatCard icon={FileText}     label="Total Reports"     value={totalReports}            color="var(--c-violet)" />
              <StatCard icon={AlertTriangle} label="Chronic Illnesses" value={chronicConditionsCount} color="var(--c-rose)" />
              <StatCard icon={Clock}         label="Last Updated"      value={lastUpdated}             color="var(--c-emerald)" />
              <StatCard icon={ShieldCheck}   label="AI Safety Score"   value={aiSafetyScore}           color="#06b6d4" />
              {userRole === "patient" ? (
                <StatCard icon={Pill} label="Active Medications" value={selected?.medications?.length || 0} color="var(--c-violet)" />
              ) : (
                <StatCard icon={Bot} label="Total Patients" value={patients.length} color="var(--c-violet)" />
              )}
            </div>

            {userRole === "doctor" && (
              <Section title="Patient Registry Directory" subtitle="Quick selection from current database records." icon={UserRound}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder="Quick filter registry..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", fontSize: 13 }}
                  />
                </div>
                <div style={{ overflowX: "auto", maxHeight: 150 }}>
                  <table className="data-table">
                    <tbody>
                      {filteredPatients.slice(0, 5).map(p => (
                        <tr
                          key={p.patientId}
                          onClick={() => onSelect(p.patientId)}
                          className={selected?.patientId === p.patientId ? "selected-row" : ""}
                          style={{ cursor: "pointer" }}
                        >
                          <td><span className="mono" style={{ color: "var(--c-sky)", fontSize: 11 }}>{p.patientId}</span></td>
                          <td><span style={{ fontWeight: 700, fontSize: 12 }}>{p.name}</span></td>
                          <td><span className="badge" style={{ fontSize: 10 }}>{p.bloodGroup}</span></td>
                          <td style={{ textAlign: "right" }}>
                            <button className="btn btn-soft" style={{ padding: "3px 6px", fontSize: 10, borderRadius: 4 }}>
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

          </div>
        </div>

        {/* Snapshot and timeline view below */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {selected && (
            <Section title="Lifelong Health Timeline & Clinical Events" subtitle="Complete clinical history for real-time monitoring." icon={History}>
              <Timeline visits={selected.visits || []} onEditEvent={userRole === "doctor" ? onEditEvent : null} onDeleteEvent={userRole === "doctor" ? onDeleteEvent : null} />
            </Section>
          )}
        </div>

      </div>
      {scannerModal}
      {qrModal}
    </>
  );
}

// ─── Patients Registration & Directory Management ──────────────────────────────
function Patients({ patients, selected, onSelect, loadPatients }) {
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", age: "", gender: "Female", bloodGroup: "O+", emergencyContact: "", diseases: "", allergies: "", medications: "" });

  const handleEdit = (p) => {
    setEditingPatientId(p.patientId);
    setForm({
      name: p.name || "",
      email: p.email || "",
      age: p.age || "",
      gender: p.gender || "Female",
      bloodGroup: p.bloodGroup || "O+",
      emergencyContact: p.emergencyContact || "",
      diseases: (p.diseases || []).join(", "),
      allergies: (p.allergies || []).join(", "),
      medications: (p.medications || []).join(", ")
    });
  };

  const handleCancel = () => {
    setEditingPatientId(null);
    setForm({ name: "", email: "", age: "", gender: "Female", bloodGroup: "O+", emergencyContact: "", diseases: "", allergies: "", medications: "" });
  };

  const handleDelete = async (p) => {
    if (!confirm(`Are you sure you want to delete patient "${p.name}" (${p.patientId})? This will permanently delete their health identity record.`)) return;
    try {
      await api.delete(`/api/patients/${p.patientId}`);
      alert("Patient deleted successfully");
      if (selected?.patientId === p.patientId) {
        onSelect(null);
      }
      await loadPatients();
    } catch (err) {
      console.error(err);
      alert("Failed to delete patient: " + (err.response?.data?.message || err.message));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        age: Number(form.age) || 0,
        diseases:    form.diseases.split(",").map(s => s.trim()).filter(Boolean),
        allergies:   form.allergies.split(",").map(s => s.trim()).filter(Boolean),
        medications: form.medications.split(",").map(s => s.trim()).filter(Boolean),
      };

      if (editingPatientId) {
        await api.put(`/api/patients/${editingPatientId}`, payload);
        alert("Patient profile updated successfully");
        setEditingPatientId(null);
      } else {
        await api.post("/api/patients", payload);
        alert("Patient created successfully");
      }
      
      setForm({ name: "", email: "", age: "", gender: "Female", bloodGroup: "O+", emergencyContact: "", diseases: "", allergies: "", medications: "" });
      await loadPatients();
    } catch (err) {
      console.error(err);
      alert("Failed to save patient: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: 16 }}>
      
      {/* Left Pane: Patient Directory List */}
      <Section title="Patient Directory" subtitle="Manage and search clinical profile files." icon={UserRound}>
        <div style={{ overflowY: "auto", maxHeight: 520, paddingRight: 4 }}>
          {patients.map(p => (
            <div key={p.patientId} style={{
              padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--c-border)", marginBottom: 8,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{p.name}</h4>
                <span className="mono" style={{ fontSize: 11, color: "var(--c-sky)" }}>{p.patientId}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button 
                  onClick={() => handleEdit(p)} 
                  className="btn btn-soft" 
                  style={{ padding: "6px 10px", fontSize: 12, borderRadius: 8 }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(p)} 
                  className="btn btn-soft text-rose-400" 
                  style={{ padding: "6px 10px", fontSize: 12, borderRadius: 8, borderColor: "rgba(239, 68, 68, 0.15)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {patients.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--c-muted)", fontSize: 13, padding: "24px 0" }}>No patients found.</p>
          )}
        </div>
      </Section>

      {/* Right Pane: Form */}
      <Section 
        title={editingPatientId ? "Edit Patient Profile" : "Register Patient"} 
        subtitle={editingPatientId ? `Updating record for ID: ${editingPatientId}` : "Create a unified lifelong medical profile."} 
        icon={editingPatientId ? Edit : Plus}
      >
        <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
          <Field label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Field label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Field label="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} type="number" />
          <Field label="Blood Group" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} />
          <Field label="Emergency Contact Phone" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
          <Field label="Chronic Diseases (comma-separated)" value={form.diseases} onChange={e => setForm({ ...form, diseases: e.target.value })} />
          <Field label="Allergies (comma-separated)" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} />
          <Field label="Medications (comma-separated)" value={form.medications} onChange={e => setForm({ ...form, medications: e.target.value })} />
          
          <div style={{ display: "flex", gap: 8, gridColumn: "1/-1", marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1, padding: "12px" }}>
              {editingPatientId ? "Save Patient Profile" : "Create Patient Health Identity"}
            </button>
            {editingPatientId && (
              <button type="button" className="btn btn-soft" onClick={handleCancel} style={{ padding: "12px" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </Section>
    </div>
  );
}

// ─── Medical History & Hospital Visit Flow ───────────────────────────────────
function HistoryPage({ selected, patientSelect, reload, editingEvent, setEditingEvent, onEditEvent, onDeleteEvent, userRole }) {
  const [formMode, setFormMode] = useState("visit"); // "visit" or "general"
  
  // Hospital Visit specific fields
  const [visit, setVisit] = useState({
    hospitalName: "",
    doctorName: "",
    symptoms: "",
    diagnosis: "",
    medicines: "",
    notes: "",
    date: ""
  });
  
  // General event fields
  const [general, setGeneral] = useState({
    title: "",
    type: "Visit",
    description: "",
    date: ""
  });

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!selected) {
    return (
      <div className="card shadow-md animate-fade-up" style={{ padding: "40px 24px", textAlign: "center", color: "var(--c-muted)" }}>
        <UserRound size={48} style={{ margin: "0 auto 16px", opacity: 0.3, color: "var(--c-sky)" }} />
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--c-text)", margin: "0 0 8px" }}>No Patient Active</h3>
        <p style={{ maxWidth: 420, margin: "0 auto 24px", fontSize: 13, lineHeight: 1.5 }}>
          Please select a patient from the patient directory lookup or registry directory to view or modify medical history.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>{patientSelect}</div>
      </div>
    );
  }

  // Load editing event into form state
  useEffect(() => {
    if (editingEvent) {
      const isHospitalVisit = !!(editingEvent.hospitalName || editingEvent.doctorName || editingEvent.diagnosis);
      setFormMode(isHospitalVisit ? "visit" : "general");
      
      if (isHospitalVisit) {
        setVisit({
          hospitalName: editingEvent.hospitalName || "",
          doctorName: editingEvent.doctorName || "",
          symptoms: editingEvent.symptoms || "",
          diagnosis: editingEvent.diagnosis || "",
          medicines: (editingEvent.medicines || []).join(", "),
          notes: editingEvent.notes || "",
          date: editingEvent.date || ""
        });
      } else {
        setGeneral({
          title: editingEvent.title || "",
          type: editingEvent.type || "Visit",
          description: editingEvent.description || "",
          date: editingEvent.date || ""
        });
      }
    }
  }, [editingEvent]);

  const submitHospitalVisit = async (e) => {
    e.preventDefault();
    if (!selected) return alert("Select a patient first");
    setBusy(true);
    try {
      let reportResult = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("title", file.name);
        const { data } = await api.post(`/api/patients/${selected.patientId}/reports`, fd);
        reportResult = data.report;
      }

      const visitPayload = {
        title: `Hospital Visit — ${visit.hospitalName || "General"}`,
        type: "Visit",
        hospitalName: visit.hospitalName,
        doctorName: visit.doctorName,
        symptoms: visit.symptoms,
        diagnosis: visit.diagnosis,
        medicines: visit.medicines,
        notes: visit.notes,
        date: visit.date || undefined,
        reportTitle: reportResult ? reportResult.title : (editingEvent?.reportTitle || ""),
        reportUrl: reportResult ? `/api/reports/${reportResult._id}` : (editingEvent?.reportUrl || "")
      };

      if (editingEvent) {
        await api.put(`/api/patients/${selected.patientId}/history/${editingEvent._id}`, visitPayload);
        alert("Hospital visit clinical details updated");
        setEditingEvent(null);
      } else {
        await api.post(`/api/patients/${selected.patientId}/history`, visitPayload);
        alert("Hospital visit added to lifelong medical history");
      }
      
      setVisit({ hospitalName: "", doctorName: "", symptoms: "", diagnosis: "", medicines: "", notes: "", date: "" });
      setFile(null);
      await reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save visit: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  const submitGeneralEvent = async (e) => {
    e.preventDefault();
    if (!selected) return alert("Select a patient first");
    setBusy(true);
    try {
      const generalPayload = {
        title: general.title,
        type: general.type,
        description: general.description,
        date: general.date || undefined
      };

      if (editingEvent) {
        await api.put(`/api/patients/${selected.patientId}/history/${editingEvent._id}`, generalPayload);
        alert("Clinical event updated");
        setEditingEvent(null);
      } else {
        await api.post(`/api/patients/${selected.patientId}/history`, generalPayload);
        alert("General event added to medical history");
      }
      
      setGeneral({ title: "", type: "Visit", description: "", date: "" });
      await reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save event: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setVisit({ hospitalName: "", doctorName: "", symptoms: "", diagnosis: "", medicines: "", notes: "", date: "" });
    setGeneral({ title: "", type: "Visit", description: "", date: "" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      
      {userRole === "doctor" && (
        <Section 
          title={editingEvent ? "Edit Clinical Record" : "Add Hospital Visit Record"} 
          subtitle={editingEvent ? `Modifying clinical timeline item ID: ${editingEvent._id}` : "Doctors can append a hospital visit to update clinical records."} 
          icon={editingEvent ? Edit : History}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
            {patientSelect}
            {!editingEvent && (
              <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10 }}>
                <button
                  onClick={() => setFormMode("visit")}
                  className={`btn ${formMode === "visit" ? "btn-primary" : "btn-soft"}`}
                  style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8 }}
                >
                  Hospital Visit Flow
                </button>
                <button
                  onClick={() => setFormMode("general")}
                  className={`btn ${formMode === "general" ? "btn-primary" : "btn-soft"}`}
                  style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8 }}
                >
                  General Event
                </button>
              </div>
            )}
          </div>

          {formMode === "visit" ? (
            <form onSubmit={submitHospitalVisit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Hospital Name" value={visit.hospitalName} onChange={e => setVisit({ ...visit, hospitalName: e.target.value })} required />
              <Field label="Consulting Doctor" value={visit.doctorName} onChange={e => setVisit({ ...visit, doctorName: e.target.value })} required />
              <Field label="Symptoms / Presenting Complaints" value={visit.symptoms} onChange={e => setVisit({ ...visit, symptoms: e.target.value })} required />
              <Field label="Diagnosis" value={visit.diagnosis} onChange={e => setVisit({ ...visit, diagnosis: e.target.value })} required />
              <Field label="Medicines Prescribed (comma-separated)" value={visit.medicines} onChange={e => setVisit({ ...visit, medicines: e.target.value })} placeholder="e.g. Paracetamol, Ibuprofen" />
              <Field label="Visit Date (Optional)" type="date" value={visit.date} onChange={e => setVisit({ ...visit, date: e.target.value })} />
              
              <div style={{ gridColumn: "1/-1" }}>
                <TextArea label="Doctor Notes & Observations" value={visit.notes} onChange={e => setVisit({ ...visit, notes: e.target.value })} />
              </div>

              {!editingEvent && (
                <div style={{ gridColumn: "1/-1", marginTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--c-muted)", display: "block", marginBottom: 6 }}>
                    Upload Associated Report / Prescription (Optional)
                  </span>
                  <div 
                    className="upload-zone" 
                    onClick={() => document.getElementById("visit-file-input").click()}
                    style={{ padding: 16 }}
                  >
                    <Upload size={18} style={{ margin: "0 auto 4px", display: "block", color: "var(--c-sky)", opacity: 0.7 }} />
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
                      {file ? file.name : "Select medical report file"}
                    </p>
                    <input
                      id="visit-file-input"
                      type="file"
                      accept="image/*,.pdf"
                      style={{ display: "none" }}
                      onChange={e => setFile(e.target.files[0])}
                    />
                  </div>
                </div>
              )}

              <div style={{ gridColumn: "1/-1", display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: 12 }} disabled={busy}>
                  <Hospital size={16} />
                  {busy ? "Saving..." : editingEvent ? "Update Visit Details" : "Save Hospital Visit & Sync Medications"}
                </button>
                {editingEvent && (
                  <button type="button" className="btn btn-soft" onClick={handleCancelEdit} style={{ padding: 12 }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={submitGeneralEvent} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Event Title" value={general.title} onChange={e => setGeneral({ ...general, title: e.target.value })} required placeholder="e.g. Surgery, Vaccine Dose" />
              <Field label="Event Type" value={general.type} onChange={e => setGeneral({ ...general, type: e.target.value })} placeholder="e.g. Surgery, Vaccination, Lab Finding" />
              <Field label="Date (Optional)" type="date" value={general.date} onChange={e => setGeneral({ ...general, date: e.target.value })} />
              <div style={{ gridColumn: "1/-1" }}>
                <TextArea label="Description" value={general.description} onChange={e => setGeneral({ ...general, description: e.target.value })} required />
              </div>
              <div style={{ gridColumn: "1/-1", display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: 12 }} disabled={busy}>
                  <Plus size={16} />
                  {busy ? "Saving..." : editingEvent ? "Update Event Details" : "Add to Lifelong History"}
                </button>
                {editingEvent && (
                  <button type="button" className="btn btn-soft" onClick={handleCancelEdit} style={{ padding: 12 }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </Section>
      )}

      {userRole === "patient" && (
        <div style={{ marginBottom: 10 }}>
          {patientSelect}
        </div>
      )}

      <Section title="Lifelong Medical History Repository" subtitle="Visual timeline of registered clinical events." icon={CalendarDays}>
        <Timeline visits={selected?.visits || []} onEditEvent={userRole === "doctor" ? onEditEvent : null} onDeleteEvent={userRole === "doctor" ? onDeleteEvent : null} />
      </Section>
    </div>
  );
}

// ─── Reports Analyzer ─────────────────────────────────────────────────────────
function Reports({ selected, patientSelect, reload }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!selected) {
    return (
      <div className="card shadow-md animate-fade-up" style={{ padding: "40px 24px", textAlign: "center", color: "var(--c-muted)" }}>
        <FileText size={48} style={{ margin: "0 auto 16px", opacity: 0.3, color: "var(--c-sky)" }} />
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--c-text)", margin: "0 0 8px" }}>No Patient Active</h3>
        <p style={{ maxWidth: 420, margin: "0 auto 24px", fontSize: 13, lineHeight: 1.5 }}>
          Please select a patient from the patient directory lookup or registry directory to upload or analyze medical reports.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>{patientSelect}</div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!selected) return alert("Select a patient first");
    if (!file) return alert("Choose a file");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", file.name);
      const { data } = await api.post(`/api/patients/${selected.patientId}/reports`, fd);
      setResult(data.report);
      await reload();
      alert("Report processed successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze report: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  const renderStructuredData = () => {
    if (!result?.structuredData) return null;
    const { documentType, structuredData } = result;

    if (documentType === "Hospital Bill") {
      return (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)" }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "var(--c-sky)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Hospital Bill Details</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
            {[["Hospital", structuredData.hospitalName], ["Patient", structuredData.patientName], ["Bill No.", structuredData.billNumber], ["Total Amount", structuredData.totalAmount], ["Date", structuredData.date]].map(([k, v]) => (
              <div key={k}><span style={{ color: "var(--c-muted)", fontSize: 11 }}>{k}: </span><b style={{ color: "var(--c-text)" }}>{v || "N/A"}</b></div>
            ))}
          </div>
        </div>
      );
    }
    if (documentType === "Lab Report" || documentType === "Blood Report") {
      return (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.12)" }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "var(--c-emerald)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Extracted Lab Values</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
            {[["Hemoglobin", structuredData.hemoglobin ? `${structuredData.hemoglobin} g/dL` : null], ["WBC", structuredData.wbc ? `${structuredData.wbc} ×10³/µL` : null], ["RBC", structuredData.rbc ? `${structuredData.rbc} ×10⁶/µL` : null], ["Vitamin D", structuredData.vitaminD ? `${structuredData.vitaminD} ng/mL` : null], ["Blood Sugar", structuredData.sugar ? `${structuredData.sugar} mg/dL` : null], ["Test Date", structuredData.date]].map(([k, v]) => (
              <div key={k}><span style={{ color: "var(--c-muted)", fontSize: 11 }}>{k}: </span><b style={{ color: "var(--c-text)" }}>{v || "Not enough information available"}</b></div>
            ))}
          </div>
        </div>
      );
    }
    if (documentType === "Prescription") {
      const meds = structuredData.medications || [];
      return (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "var(--c-violet)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Extracted Medications</p>
          {meds.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {meds.map((med, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{med.name}</span>
                    <span style={{ fontSize: 11, color: "var(--c-muted)", display: "block" }}>Dosage: {med.dosage || "Not enough information available"}</span>
                  </div>
                  <span className="badge badge-violet">{med.duration || "N/A"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "var(--c-muted)", margin: 0 }}>No medications identified.</p>
          )}
        </div>
      );
    }
    if (documentType === "Discharge Summary") {
      return (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "rgba(251,113,133,0.04)", border: "1px solid rgba(251,113,133,0.12)" }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "var(--c-rose)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Discharge Overview</p>
          {[["Diagnosis", structuredData.diagnosis], ["Treatment", structuredData.treatment], ["Hospital Stay", structuredData.hospitalStay], ["Doctor Notes", structuredData.doctorNotes]].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 8, fontSize: 13 }}>
              <span style={{ fontSize: 10, color: "var(--c-muted)", display: "block", marginBottom: 2 }}>{k}</span>
              <b style={{ color: "var(--c-text)" }}>{v || "Not enough information available"}</b>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Section title="Medical Report Analyzer" subtitle="Upload medical report scan or PDF to classify type and index metrics." icon={FileText}>
      <div style={{ marginBottom: 20 }}>{patientSelect}</div>

      <form onSubmit={submit}>
        <div className="upload-zone" onClick={() => document.getElementById("report-file-input").click()}>
          <Upload size={24} style={{ margin: "0 auto 8px", display: "block", color: "var(--c-sky)", opacity: 0.7 }} />
          <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14 }}>
            {file ? file.name : "Drop document scan here or click to browse"}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "var(--c-muted)" }}>PNG, JPG, PDF supported</p>
          <input
            id="report-file-input"
            type="file"
            accept="image/*,.pdf"
            style={{ display: "none" }}
            onChange={e => setFile(e.target.files[0])}
          />
        </div>

        {file && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, padding: "8px 12px", borderRadius: 10, background: "rgba(56,189,248,0.05)", border: "1px solid var(--c-border)" }}>
            <FileText size={14} style={{ color: "var(--c-sky)" }} />
            <span style={{ fontSize: 12, flex: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{file.name}</span>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Analyzing…" : "Analyze & Save"}
            </button>
          </div>
        )}
      </form>

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr", gap: 16, marginTop: 20 }}>
          {/* Main analysis findings */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 10, marginBottom: 12, borderBottom: "1px solid var(--c-border)" }}>
              <div>
                <h3 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 800 }}>Analysis Findings</h3>
                <span style={{ fontSize: 11, color: "var(--c-muted)" }}>Processed via Gemini Vision OCR</span>
              </div>
              <span className="badge badge-violet">Type: {result.documentType || "Other"}</span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-muted)", margin: "0 0 6px" }}>AI Explanation</p>
              <p style={{ fontSize: 13, color: "var(--c-text)", opacity: 0.85, lineHeight: 1.5, margin: 0 }}>{result.aiExplanation}</p>
            </div>

            {renderStructuredData()}

            {result.findings?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-muted)", margin: "0 0 6px" }}>Extracted Clinical Findings</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {result.findings.map(f => <span className="badge" key={f}>{f}</span>)}
                </div>
              </div>
            )}
            
            <MedicalDisclaimer />
          </div>

          <div>
            <AIEvaluationReport evaluation={result.evaluation} />
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── AI Health Summary ────────────────────────────────────────────────────────
function Summary({ selected, patientSelect }) {
  const [summary, setSummary] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!selected) {
    return (
      <div className="card shadow-md animate-fade-up" style={{ padding: "40px 24px", textAlign: "center", color: "var(--c-muted)" }}>
        <Sparkles size={48} style={{ margin: "0 auto 16px", opacity: 0.3, color: "var(--c-sky)" }} />
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--c-text)", margin: "0 0 8px" }}>No Patient Active</h3>
        <p style={{ maxWidth: 420, margin: "0 auto 24px", fontSize: 13, lineHeight: 1.5 }}>
          Please select a patient from the patient directory lookup or registry directory to compile their AI health summary.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>{patientSelect}</div>
      </div>
    );
  }

  const run = async () => {
    if (!selected) return alert("Select a patient first");
    setBusy(true);
    try {
      const { data } = await api.post(`/api/patients/${selected.patientId}/summary`);
      setSummary(data.summary);
      setEvaluation(data.evaluation);
    } catch (err) {
      console.error(err);
      alert("Failed to generate summary: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="AI Health Summary" subtitle="Consolidate patient history into a 30-second summary checklist." icon={Sparkles}>
      <div style={{ marginBottom: 20 }}>{patientSelect}</div>
      <button onClick={run} className="btn btn-primary" disabled={busy}>
        <Sparkles size={16} />
        {busy ? "Generating Summary…" : "Generate Summary"}
      </button>

      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr", gap: 16, marginTop: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-muted)", margin: "0 0 8px" }}>Clinician Overview</p>
            <div style={{ background: "rgba(0,0,0,0.05)", padding: 16, borderRadius: 12, border: "1px solid var(--c-border)", whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 13, color: "var(--c-text)" }}>
              {summary}
            </div>
            <MedicalDisclaimer />
          </div>
          <div>
            <AIEvaluationReport evaluation={evaluation} />
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── Triage Assistant ────────────────────────────────────────────────────────
function Triage({ selected, patientSelect }) {
  const [symptoms, setSymptoms] = useState("");
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!selected) return alert("Select a patient first");
    if (!symptoms.trim()) return alert("Please enter symptoms");
    setBusy(true);
    try {
      const { data } = await api.post(`/api/patients/${selected.patientId}/triage`, { symptoms });
      setOut(data);
    } catch (err) {
      console.error(err);
      alert("Triage failed: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  const riskColor = out?.riskLevel === "High" ? "var(--c-rose)" : out?.riskLevel === "Medium" ? "#d97706" : "var(--c-emerald)";

  return (
    <Section title="Healthcare Triage Assistant" subtitle="Triage clinical urgency based on symptoms and medical profile." icon={Activity}>
      <div style={{ marginBottom: 20 }}>{patientSelect}</div>
      <TextArea label="Enter Current Symptoms" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Example: chest pain and shortness of breath" />
      <button onClick={run} className="btn btn-primary" style={{ marginTop: 14 }} disabled={busy}>
        <Activity size={16} />
        {busy ? "Running Triage…" : "Run Triage"}
      </button>

      {out && (
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr", gap: 16, marginTop: 20 }}>
          <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.03)", border: "1px solid var(--c-border)" }}>
                <span style={{ display: "block", fontSize: 10, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Urgency Level</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={18} style={{ color: riskColor }} />
                  <span style={{ fontSize: 20, fontWeight: 900, color: riskColor }}>{out.riskLevel}</span>
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 12, background: "rgba(56,189,248,0.05)", border: "1px solid var(--c-border)" }}>
                <span style={{ display: "block", fontSize: 10, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Specialist Type</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--c-text)" }}>{out.specialist}</span>
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.02)", border: "1px solid var(--c-border)" }}>
              <span style={{ display: "block", fontSize: 10, color: "var(--c-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Triage Advice & Step</span>
              <p style={{ margin: 0, fontSize: 13, color: "var(--c-text)", lineHeight: 1.5 }}>{out.advice}</p>
              {out.reasoning && (
                <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--c-muted)", fontStyle: "italic" }}>
                  Clinical Rationale: {out.reasoning}
                </p>
              )}
            </div>
            
            <MedicalDisclaimer />
          </div>

          <div>
            <AIEvaluationReport evaluation={out.evaluation} />
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── Doctor Copilot ──────────────────────────────────────────────────────────
function Copilot({ selected, patientSelect }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!selected) {
    return (
      <div className="card shadow-md animate-fade-up" style={{ padding: "40px 24px", textAlign: "center", color: "var(--c-muted)" }}>
        <Brain size={48} style={{ margin: "0 auto 16px", opacity: 0.3, color: "var(--c-sky)" }} />
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--c-text)", margin: "0 0 8px" }}>No Patient Active</h3>
        <p style={{ maxWidth: 420, margin: "0 auto 24px", fontSize: 13, lineHeight: 1.5 }}>
          Please select a patient from the patient directory lookup or registry directory to enable RAG verification.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>{patientSelect}</div>
      </div>
    );
  }

  const run = async () => {
    if (!selected) return alert("Select a patient first");
    if (!question.trim()) return alert("Please enter a question");
    setBusy(true);
    try {
      const { data } = await api.post(`/api/patients/${selected.patientId}/copilot`, { question });
      setAnswer(data.answer);
      setEvaluation(data.evaluation);
    } catch (err) {
      console.error(err);
      alert("Copilot query failed: " + (err.response?.data?.message || err.message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Doctor Copilot (RAG Verification)" subtitle="Verify clinical history against primary records only. No hallucination." icon={Brain}>
      <div style={{ marginBottom: 20 }}>{patientSelect}</div>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          className="input"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="e.g. Has this patient ever had kidney issues or surgery?"
          onKeyDown={e => e.key === "Enter" && run()}
          style={{ flex: 1 }}
        />
        <button onClick={run} className="btn btn-primary" disabled={busy} style={{ padding: "10px 16px" }}>
          {busy ? <Sparkles size={16} style={{ animation: "spin 1.2s linear infinite" }} /> : <Search size={16} />}
        </button>
      </div>

      {answer && (
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr", gap: 16, marginTop: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-muted)", margin: "0 0 8px" }}>Copilot Context Response</p>
            <div style={{ background: "rgba(0,0,0,0.05)", padding: 16, borderRadius: 12, border: "1px solid var(--c-border)", whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 13, color: "var(--c-text)" }}>
              {answer}
            </div>
            <MedicalDisclaimer />
          </div>
          <div>
            <AIEvaluationReport evaluation={evaluation} />
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── Mount ────────────────────────────────────────────────────────────────────
createRoot(document.getElementById("root")).render(<App />);
