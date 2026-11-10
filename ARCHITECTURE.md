# Technical Architecture & Clinical Data Flow
### Sistech Blood Bank Management System (BBMS) • Sukkur, Sindh

---

## 1. System Architecture Overview

```
[ Browser / Client ]
       │
       ▼
[ Next.js App Router Shell (layout.tsx & page.tsx) ]
       │
       ├──► [ BloodBankProvider Context (bloodBankStore.tsx) ]
       │         │
       │         ├──► [ LocalStorage Persistence Layer ]
       │         │       (Units, Donors, Requests, Camps, Staff, Audit)
       │         │
       │         └──► [ Seed Data Fallback (mockData.ts) ]
       │
       └──► [ Presentation Tier (Tailwind CSS + Lucide Icons) ]
                 ├── Header (Live Emergency Ticker & Demo Reset)
                 ├── Navigation Tabs (Dashboard, Inventory, Donors, Intake, Dispatch, Matrix, Camps, Audit)
                 ├── Interactive Modals (Allocate Bags, New Requisition, New Donor, Inspect Unit)
                 └── Toast Notification Engine
```

---

## 2. Core Domain Models

```typescript
// Blood Unit Entity
interface BloodUnit {
  id: string;
  bagNumber: string;               // Format: SUK-26-[GROUP]-[SERIAL]
  bloodGroup: BloodGroup;          // 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-'
  component: ComponentType;        // PRBC, FFP, Platelets, Whole Blood, Cryo
  volumeMl: number;                // Standard 450ml / 250ml / 50ml
  collectionDate: string;          // ISO Date YYYY-MM-DD
  expiryDate: string;              // Calibrated per component shelf-life
  status: UnitStatus;              // 'available' | 'reserved' | 'dispatched' | 'quarantine' | 'expired'
  storageLocation: string;         // e.g., Cold Storage Room 1 - Bay A1 (2-6°C)
  donorId: string;
  donorName: string;
  testedSafe: boolean;             // 5-Pathogen serology negative
}

// Donor Entity
interface Donor {
  id: string;
  fullName: string;
  cnic: string;                    // Pakistani CNIC format (e.g. 45504-1234567-1)
  gender: 'Male' | 'Female' | 'Other';
  age: number;                     // Gate: 18 - 65
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  city: string;                    // Sukkur, Rohri, Khairpur, Shikarpur, Larkana
  address: string;
  lastDonationDate: string | null;
  totalDonations: number;
  eligibilityStatus: 'eligible' | 'deferred' | 'ineligible';
  weightKg: number;                // Gate: >= 50 kg
  hemoglobin: number;              // Gate: >= 12.5 g/dL
}

// Emergency Hospital Requisition
interface DispatchEmergencyRequest {
  id: string;
  requestNumber: string;           // Format: EMG-2026-XXX
  hospitalName: string;            // Civil Hospital Sukkur, SIUT, GMMMC, etc.
  patientName: string;
  patientAge: number;
  diagnosis: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  unitsRequested: number;
  urgency: 'critical' | 'urgent' | 'routine';
  status: 'pending' | 'approved' | 'dispatched' | 'rejected';
  requestDate: string;
  requiredBy: string;
  contactDoctor: string;
  contactPhone: string;
  notes?: string;
  assignedBagNumbers?: string[];
}
```

---

## 3. Cold-Chain Protocol & Shelf-Life Rules

| Blood Component | Storage Temperature | Shelf Life | Regulatory Notes |
| :--- | :--- | :--- | :--- |
| **Packed Red Blood Cells (PRBC)** | +2°C to +6°C | 35 to 42 Days | Monitored daily with calibrated digital sensors |
| **Fresh Frozen Plasma (FFP)** | ≤ -30°C | 12 Months | Stored frozen; thawed in 37°C water bath prior to use |
| **Platelet Concentrate** | +20°C to +24°C | 5 Days | Requires continuous horizontal agitation in agitator |
| **Cryoprecipitate** | ≤ -30°C | 12 Months | High Factor VIII and Fibrinogen reserve |
| **Whole Blood** | +2°C to +6°C | 35 Days | Used in major trauma resuscitation |

---

## 4. Serological Compatibility Architecture

* **Packed Red Blood Cells:**
  * Universal Donor: **O Negative (O-)** (no A or B antigens, no Rh factor).
  * Universal Recipient: **AB Positive (AB+)** (possesses all antigens, no circulating antibodies).
* **Fresh Frozen Plasma (Inverse Compatibility):**
  * Universal Plasma Donor: **AB Positive (AB+)** (contains neither anti-A nor anti-B antibodies).
  * Universal Plasma Recipient: **O Negative (O-)** (contains both anti-A and anti-B antibodies, requiring O plasma).

---

## 5. Security & Regulatory Compliance

* **Audit Logging:** Every state modification (donor intake, unit status changes, dispatch allocation) writes an immutable record to the audit stream with actor ID, timestamp, and metadata.
* **Sindh Blood Transfusion Authority (SBTA):** Designed in alignment with provincial licensing standards for blood screening, donor counseling, and cold-chain integrity.
