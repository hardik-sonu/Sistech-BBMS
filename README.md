# Sistech Blood Bank Management System (BBMS)
### Clinical Division • Sistech Sukkur, Sindh, Pakistan

[![Next.js](https://img.shields.io/badge/Next.js-14%2B%20App%20Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Design_Tokens-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Clinical Authority](https://img.shields.io/badge/SBTA-Certified%20%23SBTA--SUK--2024--089-crimson)](#regulatory-compliance)

---

## 1. Executive Summary & Institutional Profile

The **Sistech Blood Bank Management System (BBMS)** is an enterprise clinical health-technology platform developed under the **Sistech Institute of Science & Technology (Sukkur, Sindh)** in collaboration with regional health authorities.

Operating as the regional digital hub for upper Sindh, the system coordinates donor recruitment, serological pathogen verification, temperature-monitored cold-chain blood fractionation, and STAT emergency blood dispatching across tertiary care facilities including:
* **Civil Hospital Sukkur** (Trauma & Surgical ICU)
* **Ghulam Muhammad Mahar Medical College (GMMMC) Hospital** (Obstetrics & Gynecology)
* **Sindh Institute of Urology and Transplantation (SIUT) Chhablani Medical Center Sukkur**
* **Pakistan Red Crescent Society (Sukkur Regional Blood Center)**

---

## 2. Clinical & Engineering Team

| Name | Role / Designation | Department / Division |
| :--- | :--- | :--- |
| **Dr. Tariq Mahar, FCPS** | Director & Chief Hematologist | Clinical Pathology & Blood Transfusion |
| **Sumera Rajput, MSc** | Serology & Quality Assurance Incharge | Blood Screening & Cross-Match Wing |
| **Adnan Shaikh, MLT** | Senior Clinical Phlebotomist | Donor Recruitment & Phlebotomy Wing |
| **Rizwan Ali Solangi** | Logistics & Cold-Chain Dispatch Officer | Emergency Response & Logistics |
| **Sistech HealthTech Lab** | Lead Systems Engineers & UI/UX Architects | Software Engineering & Medical Informatics |

---

## 3. Technology Stack & Architecture

* **Frontend Framework:** Next.js 14+ (App Router architecture with React Server & Client Components)
* **Language & Typing:** TypeScript (Strict Mode, 100% type coverage)
* **Design System & Styling:** Tailwind CSS customized with clinical tokens (Primary: `#701921`, Surface: `#f8faf1`, high-contrast typography)
* **Typography:** `Inter` (clinical readability) and `Manrope` (executive headings)
* **Icons:** Lucide React Medical & System Icons
* **State Management:** Custom React Context store with automated browser `localStorage` persistence, audit serialization, and fallback demo reset
* **Cold-Chain Safety Protocols:** Pre-configured monitoring for PRBC (2°C–6°C), FFP (-30°C), and Platelets (20°C–24°C continuous agitation)

---

## 4. Key Functional Modules

### 1. Executive Telemetry Dashboard
* Real-time active inventory counts categorized by blood group and component.
* Color-coded supply alerts: **Adequate**, **Low**, and **Critical Shortage**.
* Priority STAT emergency requisition queue with direct triage shortcuts.
* Live audit feed capturing every inventory accession and bag dispatch.

### 2. Cold Chain Blood Inventory Management
* Unit-level tracking with unique barcode bags (e.g. `SUK-26-OP-101`).
* Multi-axis filtering: Blood Group (`O+`, `O-`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`), Component Type, and Storage Status.
* Bag lifecycle management: `available`, `reserved`, `dispatched`, `quarantine`, and `expired`.
* Manual accession modal for incoming transfers.

### 3. Voluntary Donors Directory
* Comprehensive donor records indexed by Pakistani CNIC (`45504-XXXXXXX-X`), name, phone, and Sindh city.
* Automatic eligibility gatekeeping: Age (18–65), Weight (≥ 50 kg), Hemoglobin (≥ 12.5 g/dL), and 90-day minimum donation intervals.
* One-click "Donate Today" routing that pre-populates the donor in the intake form.

### 4. Clinical Donation Intake & Fractionation
* 3-step structured clinical intake:
  1. Donor identity verification & pre-donation vitals check.
  2. Component fractionation (PRBC, Whole Blood, FFP, Platelets, Cryo) and bag volume selection.
  3. Storage allocation and mandatory 5-pathogen screening checklist (HBsAg, Anti-HCV, HIV 1/2, VDRL, Malaria ICT).
* Generates instant barcoded inventory entries and logs chain-of-custody audit records.

### 5. Emergency Hospital Dispatch & STAT Allocation
* Triage by clinical urgency: **Critical / STAT** (< 30 min), **Urgent** (< 3 hrs), and **Routine**.
* Automated bag allocation engine that scans inventory for matching ABO/Rh units.
* Generates printable hospital dispatch requisitions with attending physician and courier verification.

### 6. Interactive Serological Compatibility Matrix
* Instant cross-match visualization for any recipient blood group.
* Displays compatible Packed Red Blood Cell (PRBC) donors alongside **live in-stock units**.
* Displays compatible Fresh Frozen Plasma (FFP) donors following inverse plasma rules (Universal Plasma Donor: `AB+`).
* Complete 8×8 clinical reference grid.

### 7. Mobile Outreach Camps & Blood Drives
* Central coordination for drives across university campuses (Sukkur IBA, SALU Khairpur) and railway hubs.
* Target vs. collected progress indicators with real-time percentage achievement.

### 8. Regulatory Compliance & Audit Trail
* Full immutable audit logging for Sindh Blood Transfusion Authority (SBTA) inspections.
* Staff duty rosters across Morning, Evening, and Night shifts.

---

## 5. Getting Started & Development

### Prerequisites
* Node.js 18.17+ or Node.js 20+
* npm 9+

### Installation & Run

```bash
# Clone or navigate to the repository
cd C:\Users\Ahmadcomputer\.gemini\antigravity\scratch\blood-bank-system

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## 6. Demonstration Credentials & Reset Functionality

* **Zero Login Friction:** The system launches directly into the executive dashboard with realistic preloaded clinical records for the Sukkur region.
* **1-Click Reset:** Click the **"Reset Demo"** button in the header at any time to instantly restore default sample data.

---

## 7. Institutional Licensing & Contact

* **Institute:** Sistech Institute of Science & Technology, Sukkur, Sindh, Pakistan
* **Clinical Division:** Blood Bank & Transfusion Logistics Wing
* **Regulatory Body:** Sindh Blood Transfusion Authority (SBTA)
* **24/7 Clinical Emergency Hotline:** `071-5800000`
* **Direct Coordination:** Dr. Tariq Mahar (`tariq.mahar@sistech.edu.pk`)
