# AICTE SAMPARK
## Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System
**Organization:** All India Council for Technical Education (AICTE)  
**Problem Statement ID:** 26262  

---

## 1. Executive Summary

**AICTE SAMPARK** is an integrated digital governance platform engineered to automate approval-related administrative workflows, monitor institutional statutory compliance, track document validity across academic cycles, schedule Expert Visit Committee (EVC) activities, and proactively alert responsible stakeholders about pending and overdue actions.

The system addresses the core challenge of regulatory processing bottlenecks, redundant re-verification of multi-year institutional documents, and siloed administrative oversight by unifying Technical Institutions, Scrutiny Officers, Regional Administrators, EVC Coordinators, and Senior Council Authorities into a single coherent system.

---

## 2. Core Functional Modules

### A. Role-Based Access Control (5 Authorized Personas)
- **Institution Administrator**: Submits applications, accesses persistent Compliance Reuse Profile, uploads renewals, responds to deficiencies.
- **Scrutiny Officer**: Reviews submitted information, records observations, returns cases with mandatory reasons, verifies renewals.
- **Regional Administrator**: Monitors regional pendency, workload distribution, reviews Level 2 escalations.
- **EVC Coordinator**: Schedules inspection visits, assigns expert panels, compiles on-site reports.
- **Senior Authority (Member Secretary)**: Accesses council-wide analytics, reviews bottlenecks, executes statutory approval/rejection orders.

### B. Central Executive Command Dashboard
- **9 Metric Cards**: Total Applications, Under Scrutiny, Awaiting Clarification, Awaiting EVC, Committee Stage, Compliance Actions Due Soon, Expiring Documents, Overdue Applications, Escalated Cases.
- **Visual Analytics (Recharts)**: Stage-wise pipeline, Regional pendency vs. breaches, SLA turnaround velocity, and Officer workload distribution.
- **Priority Cases Grid**: Real-time ranking by urgency, days in stage, and SLA consumption.

### C. Configurable Workflow Engine
- **Configurable Routes**:
  1. *Route A*: Fast-Track Scrutiny Only (routine EoA)
  2. *Route B*: Scrutiny followed by EVC Inspection (Intake Variations & Divisions)
  3. *Route C*: Scrutiny, EVC & Committee Processing (New Institutions & Change of Site)
  4. *Route D*: EVC & Committee Special Review
- Configurable stage SLA deadlines, permitted transitions, and automated escalation triggers.

### D. USP: Compliance Reuse Profile (Institutional Digital Vault)
- Persistent digital repository of verified documents (Perpetual Land Titles, Building Completion Certificates, Approved Master Plans).
- Lifetime validity rules: prevents redundant re-uploading and reverification of valid certificates across annual approval cycles.
- Color-coded validity badges: `Verified & Reusable`, `Expiring Soon (<30d)`, `Expired / Renewal Due`, `Renewal In Review`.

### E. Undertaking & Compliance Monitoring
- Tracks post-approval statutory undertakings: Anti-Ragging Committee notifications, Internal Complaints Committee (ICC), Ombudsman appointment, and Faculty Cadre ratios.
- Preserves human oversight: requires explicit scrutiny verification before an obligation is marked compliant.

### F. Expert Visit Committee (EVC) Operations
- Table and calendar view of on-site inspections.
- Coordinator panel mobilization, visit date confirmation, and deficiency reporting.

### G. Alerts, Reminders & Tiered Escalations
- Multi-tier escalation engine: Level 1 (Assigned Officer), Level 2 (Regional Administrator), Level 3 (Council Bureau).
- **Time-Travel Simulation Sandbox**: Test mode allowing users to advance the clock (+7d, +15d, +30d) to dynamically observe SLA aging, reminder intervals, and escalation triggers.

### H. Gemini AI Feature 1: AICTE Compliance Copilot
- Grounded conversational assistant powered by `gemini-3.8-flash` via server-side `@google/genai`.
- Grounded on the AICTE Approval Process Handbook (APH 2026-27) and the active application's audit history.
- Explains recorded deficiencies, pending documents, and regulatory norms with statutory citations.

### I. Gemini AI Feature 2: Multimodal Document Anomaly Detection
- Computer-assisted preliminary triage analyzing certificate layouts, registration numbers, stamp duty, and expiration dates.
- Identifies font baseline inconsistencies and expiry date conflicts for human review.
- Regulatory safeguard notice: Advisory only; preserves mandatory statutory verification.

### J. Statutory Reports & CSV Export
- 10 standardized regulatory reports with live data filtering and one-click CSV file downloads.

### K. Immutable Audit Trail
- Cryptographic write-only event ledger tracking all submissions, stage transitions, observations, document reuses, and official decisions.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Node.js, Express, Vite Dev Middleware (running on port 3000).
- **AI Integration**: `@google/genai` TypeScript SDK (server-side integration with `gemini-3.8-flash`).
- **Persistence**: Browser LocalStorage persistence synchronized with full-stack state.

---

## 4. Environment Variables

Create a `.env` file in the project root:

```bash
# GEMINI_API_KEY: Required for live generative AI responses from Gemini 3.8-Flash.
# If omitted, the platform gracefully switches to the deterministic grounded knowledge base.
GEMINI_API_KEY="your_api_key_here"

# PORT: Server listening port (defaults to 3000)
PORT=3000

# NODE_ENV: 'development' or 'production'
NODE_ENV="development"
```

---

## 5. Quick Start Instructions

```bash
# Install dependencies
npm install

# Start full-stack development server on port 3000
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 6. Official Demonstration Scenario (Section 20)

Navigate to the **Demo Scenario Guide** tab in the sidebar:
1. Institution Administrator logs in (Sunrise Institute of Technology).
2. Opens Compliance Reuse Profile to inspect reusable perpetual documents.
3. Submits Intake Variation application `AICTE-DEMO-2026-001`.
4. Scrutiny Officer records Fire Safety NOC deficiency and returns the case.
5. Institution receives notification and uploads clarification.
6. Case enters Re-Scrutiny and advances to EVC inspection queue.
7. EVC Coordinator confirms on-site visit for 28-Oct-2026.
8. Institution consults AI Compliance Copilot for APH guidance.
9. Officer runs Multimodal Document Anomaly check.
10. Senior Authority inspects the complete immutable audit trail.
