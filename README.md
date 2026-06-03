This README is tailored specifically to the HealthVault AI project you described and the current modules shown in your screenshots.

# HealthVault AI – Lifelong Digital Medical Identity Platform

## Problem Statement

Patients often visit multiple hospitals throughout their lives, causing their medical history to become fragmented across different healthcare systems. Doctors frequently lack access to previous diagnoses, prescriptions, reports, allergies, and chronic conditions, resulting in delays, repeated tests, incomplete treatment decisions, and increased healthcare costs.

HealthVault AI solves this problem by creating a lifelong portable digital medical identity that follows a patient across hospitals. Every patient receives a unique HealthVault ID and Digital Health Card that stores medical history, hospital visits, prescriptions, reports, AI-generated summaries, and healthcare insights in a unified platform.

---

# Project Title

**HealthVault AI – Lifelong Digital Medical Identity Platform**

---

# Project Overview

HealthVault AI is a secure AI-powered healthcare platform that provides:

* Digital Health Identity Cards
* Lifelong Medical History Tracking
* Cross-Hospital Health Records
* AI Report Analysis
* AI Health Summaries
* Doctor Copilot Assistance
* QR-Based Patient Identification
* Role-Based Access Control
* AI Safety & Hallucination Monitoring

The platform enables doctors to instantly understand a patient's complete medical history in seconds rather than manually reviewing years of records.

---

# Key Features

## Patient Features

* Unique HealthVault ID
* Digital Health Card
* QR-Based Health Identity
* Lifelong Medical Timeline
* Prescription Tracking
* Appointment Management
* AI Health Summary
* AI Medical Report Analysis
* View Hospital Visits
* Secure Medical History Storage

---

## Doctor Features

* Patient Search by HealthVault ID
* QR Code Patient Lookup
* Complete Patient Medical Timeline
* Medical Report Analyzer
* AI Health Summary Generator
* Doctor Copilot Assistant
* Hospital Visit Logging
* Prescription Management
* Diagnosis Tracking
* Historical Record Verification

---

## Admin Features

* User Management
* Doctor Management
* Hospital Management
* System Monitoring
* AI Safety Evaluation
* OCR Monitoring
* API Monitoring
* Database Monitoring
* Activity Logs
* Analytics Dashboard

---

## AI Features

### AI Medical Report Analyzer

Upload:

* Prescription Images
* Medical Reports
* Lab Reports
* PDFs

AI performs:

* OCR Extraction
* Findings Detection
* Medical Data Structuring
* Health History Updating

---

### AI Health Summary

Generates:

* Patient Overview
* Chronic Conditions
* Active Medications
* Previous Diagnoses
* Important Medical Events

Doctors can understand a patient's history within seconds.

---

### Doctor Copilot

Allows doctors to ask:

* Has this patient had similar issues before?
* Previous diagnoses?
* Previous medications?
* Previous hospital visits?
* Chronic disease history?

All answers are generated from stored medical records.

---

### AI Safety Layer

Measures:

* AI Confidence Score
* Hallucination Risk
* Groundedness Score
* Record Verification
* OCR Accuracy

This helps improve trustworthiness for healthcare use cases.

---

# How It Works

## Step 1

Patient registers and receives:

* HealthVault ID
* Digital Health Card
* QR Code

---

## Step 2

Patient visits a hospital.

Doctor searches:

* HealthVault ID
  OR
* QR Code

---

## Step 3

Doctor accesses:

* Medical History
* Previous Reports
* Diagnoses
* Medications
* Timeline

---

## Step 4

Doctor adds:

* New Visit
* Diagnosis
* Prescription
* Notes

---

## Step 5

HealthVault automatically updates:

* Medical Timeline
* Health Card
* Patient History

---

## Step 6

Future hospitals instantly access the patient's medical history using the same HealthVault ID.

---

# Architecture Design

Frontend (React + Vite)

↓

Node.js + Express Backend

↓

MongoDB Database

↓

AI Services

* Groq LLM
* Gemini OCR

↓

HealthVault Digital Identity Engine

↓

Patient / Doctor / Admin Portals

---

# Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* CSS

---

## Backend

* Node.js
* Express.js

---

## Database

* MongoDB

---

## AI Models

* Groq Llama Models
* Gemini OCR

---

## Deployment

* Vercel
* MongoDB Atlas

---

# Environmental Variables

Create a .env file inside api folder.

```env
MONGODB_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key

GEMINI_API_KEY=your_gemini_api_key

PORT=5000
```

---

# Installation Steps

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Root Dependencies

```bash
npm install
```

---

## Install Backend Dependencies

```bash
cd api
npm install
```

---

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Configure Environment Variables

Create:

```env
api/.env
```

and add required keys.

---

## Run Backend

```bash
cd api
npm run dev
```

---

## Run Frontend

```bash
cd frontend
npm run dev
```

---

## Open Browser

```text
http://localhost:5173
```

---

# Evaluation

The platform is evaluated using:

## OCR Accuracy

Measures correctness of extracted medical data.

Target:

* 90%+ extraction accuracy

---

## AI Summary Quality

Measures:

* Relevance
* Completeness
* Medical Consistency

---

## Hallucination Detection

Measures:

* Unsupported claims
* Fabricated diagnoses
* Missing evidence

---

## Groundedness Evaluation

Checks whether AI responses are supported by:

* Medical Reports
* Hospital Visits
* Existing Records

---

## System Reliability

Measures:

* API Availability
* Response Time
* Database Consistency

---

# Challenges Overcome

* Designing a unified lifelong medical identity
* Cross-hospital patient record management
* OCR extraction from medical documents
* AI hallucination prevention
* Role-based healthcare access control
* Medical timeline synchronization
* Secure healthcare data organization
* Doctor-friendly patient summarization

---

# Future Improvements

* Aadhaar-based patient verification
* Blockchain-based medical records
* Multi-hospital federation network
* Telemedicine integration
* Voice-based patient interaction
* Wearable health device integration
* Drug interaction detection
* Disease risk prediction
* Medical appointment scheduling
* Mobile application

---

# Deployment & GitHub Upload Guide

This project is configured as a monorepo containing a Vite/React frontend and an Express API backend, optimized for unified deployment to **Vercel** with a shared domain and zero-CORS configuration.

## Step 1: Upload to GitHub

We have provided automated scripts (`deploy.bat` for Windows and `deploy.sh` for macOS/Linux) in the root of the project to initialize Git, commit all code, and push it to your GitHub account automatically.

### On Windows:
1. Create a new empty repository on [GitHub](https://github.com/new). Do not initialize it with a README, license, or `.gitignore`.
2. Double-click the `deploy.bat` file in your project root (or run `deploy.bat` in command prompt).
3. Paste the URL of your new GitHub repository (e.g., `https://github.com/username/repository-name.git`) when prompted, and press Enter.

### On macOS/Linux:
1. Create a new empty repository on [GitHub](https://github.com/new).
2. Open a terminal in the project root and make the script executable:
   ```bash
   chmod +x deploy.sh
   ```
3. Run the script:
   ```bash
   ./deploy.sh
   ```
4. Paste the URL of your new GitHub repository when prompted.

---

## Step 2: Deploy to Vercel

Once your code is pushed to GitHub, follow these steps:

1. **Log in to Vercel**: Go to [Vercel](https://vercel.com) and log in using your GitHub account.
2. **Import Repository**:
   - Click **Add New...** -> **Project**.
   - Import your newly uploaded `HealthVault-AI` repository.
3. **Configure Settings**:
   - Vercel will automatically read `vercel.json` and recognize the monorepo structure.
   - You do **not** need to change the root directory or build commands (Vercel uses the settings defined in `vercel.json`).
4. **Set Environment Variables**:
   Under the **Environment Variables** section, add the following key-value pairs:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `GROQ_API_KEY`: Your Groq API Key.
   - `GEMINI_API_KEY`: Your Gemini API Key.
5. **Click Deploy**:
   - Click **Deploy**. Vercel will build the frontend, package the serverless backend routes, and publish your project on a single unified URL (e.g. `healthvault-ai.vercel.app`).


# Demo Link

Add your deployed links here:

Frontend:

```text
https://your-vercel-link.vercel.app
```

GitHub:

```text
https://github.com/your-repository
```

Demo Video:

```text
https://youtube.com/your-demo-video
```

---

# Screenshots

Add screenshots of:

1. Login Page
2. Patient Dashboard
3. Doctor Dashboard
4. Admin Dashboard
5. Medical Report Analyzer
6. AI Health Summary
7. Doctor Copilot
8. Medical Timeline
9. User Management
10. HealthVault Digital Card

---

# Author Information

Name: Mahek Jahan

College: Anurag University

Department: Computer Science & Engineering

Project: HealthVault AI

GitHub: [https://github.com/Mahekjahan14](https://github.com/Mahekjahan14)

Year: 2026

---

## Vision

"One Patient. One HealthVault ID. One Lifelong Medical History."

This version is resume-worthy, GitHub-worthy, hackathon-worthy, and suitable for project demonstrations.
