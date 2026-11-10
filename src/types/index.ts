export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ComponentType =
  | 'Whole Blood'
  | 'Packed Red Cells (PRBC)'
  | 'Fresh Frozen Plasma (FFP)'
  | 'Platelet Concentrate'
  | 'Cryoprecipitate';

export type UnitStatus = 'available' | 'reserved' | 'dispatched' | 'expired' | 'quarantine';

export interface BloodUnit {
  id: string;
  bagNumber: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  volumeMl: number;
  collectionDate: string;
  expiryDate: string;
  status: UnitStatus;
  storageLocation: string;
  donorId: string;
  donorName: string;
  testedSafe: boolean;
}

export type EligibilityStatus = 'eligible' | 'deferred' | 'ineligible';

export interface Donor {
  id: string;
  fullName: string;
  cnic: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  city: string;
  address: string;
  lastDonationDate: string | null;
  totalDonations: number;
  eligibilityStatus: EligibilityStatus;
  deferralReason?: string;
  weightKg: number;
  hemoglobin: number;
}

export type UrgencyLevel = 'critical' | 'urgent' | 'routine';
export type RequestStatus = 'pending' | 'approved' | 'dispatched' | 'rejected';

export interface DispatchEmergencyRequest {
  id: string;
  requestNumber: string;
  hospitalName: string;
  patientName: string;
  patientAge: number;
  diagnosis: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  unitsRequested: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  requestDate: string;
  requiredBy: string;
  contactDoctor: string;
  contactPhone: string;
  notes?: string;
  assignedBagNumbers?: string[];
}

export interface DonationCamp {
  id: string;
  title: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
  targetUnits: number;
  collectedUnits: number;
  coordinatorName: string;
  coordinatorPhone: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: 'Morning' | 'Evening' | 'Night';
  department: string;
  phone: string;
  email: string;
  status: 'Active' | 'On Duty' | 'On Leave';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'Inventory' | 'Dispatch' | 'Donor' | 'System' | 'Camp';
  performedBy: string;
  details: string;
}
