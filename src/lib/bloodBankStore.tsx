'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BloodUnit,
  Donor,
  DispatchEmergencyRequest,
  DonationCamp,
  StaffMember,
  AuditLog,
  BloodGroup,
  UnitStatus,
  RequestStatus,
  ComponentType,
} from '../types';
import {
  INITIAL_BLOOD_UNITS,
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_CAMPS,
  INITIAL_STAFF,
  INITIAL_AUDIT_LOGS,
} from './mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface BloodBankContextType {
  units: BloodUnit[];
  donors: Donor[];
  requests: DispatchEmergencyRequest[];
  camps: DonationCamp[];
  staff: StaffMember[];
  auditLogs: AuditLog[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addDonor: (donor: Omit<Donor, 'id'>) => Donor;
  updateDonor: (id: string, updates: Partial<Donor>) => void;
  addBloodUnit: (unit: Omit<BloodUnit, 'id'>) => BloodUnit;
  updateUnitStatus: (id: string, status: UnitStatus) => void;
  addEmergencyRequest: (req: Omit<DispatchEmergencyRequest, 'id' | 'requestNumber' | 'status' | 'requestDate'>) => void;
  updateRequestStatus: (id: string, status: RequestStatus, assignedBagNumbers?: string[]) => void;
  recordDonation: (data: {
    donorId: string;
    bloodGroup: BloodGroup;
    component: ComponentType;
    volumeMl: number;
    storageLocation: string;
    hemoglobin: number;
    weightKg: number;
  }) => void;
  resetDemoData: () => void;
  getBloodGroupCount: (bg: BloodGroup, component?: ComponentType) => number;
  getRedCellCompatibility: (recipient: BloodGroup) => BloodGroup[];
  getPlasmaCompatibility: (recipient: BloodGroup) => BloodGroup[];
}

const BloodBankContext = createContext<BloodBankContextType | null>(null);

const STORAGE_KEYS = {
  UNITS: 'sistech_bbms_units_v1',
  DONORS: 'sistech_bbms_donors_v1',
  REQUESTS: 'sistech_bbms_requests_v1',
  CAMPS: 'sistech_bbms_camps_v1',
  STAFF: 'sistech_bbms_staff_v1',
  AUDIT: 'sistech_bbms_audit_v1',
};

export const BloodBankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<BloodUnit[]>(INITIAL_BLOOD_UNITS);
  const [donors, setDonors] = useState<Donor[]>(INITIAL_DONORS);
  const [requests, setRequests] = useState<DispatchEmergencyRequest[]>(INITIAL_REQUESTS);
  const [camps, setCamps] = useState<DonationCamp[]>(INITIAL_CAMPS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedUnits = localStorage.getItem(STORAGE_KEYS.UNITS);
      if (storedUnits) setUnits(JSON.parse(storedUnits));

      const storedDonors = localStorage.getItem(STORAGE_KEYS.DONORS);
      if (storedDonors) setDonors(JSON.parse(storedDonors));

      const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (storedRequests) setRequests(JSON.parse(storedRequests));

      const storedCamps = localStorage.getItem(STORAGE_KEYS.CAMPS);
      if (storedCamps) setCamps(JSON.parse(storedCamps));

      const storedStaff = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (storedStaff) setStaff(JSON.parse(storedStaff));

      const storedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (storedAudit) setAuditLogs(JSON.parse(storedAudit));
    } catch (e) {
      console.warn('LocalStorage error, using initial dataset:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
      localStorage.setItem(STORAGE_KEYS.CAMPS, JSON.stringify(camps));
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [units, donors, requests, camps, staff, auditLogs, isInitialized]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAudit = (action: string, category: AuditLog['category'], details: string) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp,
      action,
      category,
      performedBy: 'Current Operator (Demo Admin)',
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addDonor = (donorData: Omit<Donor, 'id'>): Donor => {
    const newId = `DNR-${(donors.length + 1).toString().padStart(3, '0')}`;
    const newDonor: Donor = {
      ...donorData,
      id: newId,
    };
    setDonors((prev) => [newDonor, ...prev]);
    addAudit('Donor Registered', 'Donor', `Registered new donor ${newDonor.fullName} (${newDonor.bloodGroup}, CNIC: ${newDonor.cnic})`);
    addToast(`Donor ${newDonor.fullName} registered successfully!`, 'success');
    return newDonor;
  };

  const updateDonor = (id: string, updates: Partial<Donor>) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    addAudit('Donor Updated', 'Donor', `Updated donor records for ID ${id}`);
    addToast('Donor updated successfully!', 'info');
  };

  const addBloodUnit = (unitData: Omit<BloodUnit, 'id'>): BloodUnit => {
    const newId = `UNT-${(units.length + 101).toString()}`;
    const newUnit: BloodUnit = {
      ...unitData,
      id: newId,
    };
    setUnits((prev) => [newUnit, ...prev]);
    addAudit('Unit Added', 'Inventory', `New unit ${newUnit.bagNumber} (${newUnit.bloodGroup} - ${newUnit.component}) entered stock`);
    addToast(`Unit ${newUnit.bagNumber} added to inventory!`, 'success');
    return newUnit;
  };

  const updateUnitStatus = (id: string, status: UnitStatus) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
    addAudit('Unit Status Changed', 'Inventory', `Unit ${id} marked as ${status}`);
    addToast(`Unit ${id} status updated to ${status}`, 'info');
  };

  const addEmergencyRequest = (
    reqData: Omit<DispatchEmergencyRequest, 'id' | 'requestNumber' | 'status' | 'requestDate'>
  ) => {
    const reqNum = `EMG-2026-${(requests.length + 90).toString().padStart(3, '0')}`;
    const now = new Date();
    const requestDate = now.toISOString().replace('T', ' ').slice(0, 16);
    const newReq: DispatchEmergencyRequest = {
      ...reqData,
      id: `REQ-${Date.now().toString().slice(-4)}`,
      requestNumber: reqNum,
      status: 'pending',
      requestDate,
    };
    setRequests((prev) => [newReq, ...prev]);
    addAudit('Emergency Request Filed', 'Dispatch', `Request ${reqNum} filed by ${newReq.hospitalName} for ${newReq.unitsRequested}x ${newReq.bloodGroup}`);
    addToast(`Emergency Request ${reqNum} submitted!`, 'success');
  };

  const updateRequestStatus = (id: string, status: RequestStatus, assignedBagNumbers?: string[]) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status,
            assignedBagNumbers: assignedBagNumbers || r.assignedBagNumbers,
          };
        }
        return r;
      })
    );

    // If dispatched, update assigned units
    if (status === 'dispatched' && assignedBagNumbers && assignedBagNumbers.length > 0) {
      setUnits((prev) =>
        prev.map((u) => {
          if (assignedBagNumbers.includes(u.bagNumber)) {
            return { ...u, status: 'dispatched' };
          }
          return u;
        })
      );
    }

    addAudit('Dispatch Status Changed', 'Dispatch', `Request ${id} updated to status: ${status}`);
    addToast(`Emergency Request updated to ${status}!`, 'info');
  };

  const recordDonation = (data: {
    donorId: string;
    bloodGroup: BloodGroup;
    component: ComponentType;
    volumeMl: number;
    storageLocation: string;
    hemoglobin: number;
    weightKg: number;
  }) => {
    const donor = donors.find((d) => d.id === data.donorId);
    const donorName = donor ? donor.fullName : 'Voluntary Donor';
    const today = new Date().toISOString().slice(0, 10);
    const expiry = new Date();
    if (data.component.includes('Platelet')) {
      expiry.setDate(expiry.getDate() + 5);
    } else if (data.component.includes('Plasma') || data.component.includes('Cryo')) {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
      expiry.setDate(expiry.getDate() + 35);
    }

    const bagCode = `SUK-26-${data.bloodGroup.replace('+', 'P').replace('-', 'N')}-${(units.length + 101).toString()}`;
    const newUnit: BloodUnit = {
      id: `UNT-${Date.now().toString().slice(-4)}`,
      bagNumber: bagCode,
      bloodGroup: data.bloodGroup,
      component: data.component,
      volumeMl: data.volumeMl,
      collectionDate: today,
      expiryDate: expiry.toISOString().slice(0, 10),
      status: 'available',
      storageLocation: data.storageLocation,
      donorId: data.donorId,
      donorName,
      testedSafe: true,
    };

    setUnits((prev) => [newUnit, ...prev]);

    // Update donor record
    if (donor) {
      setDonors((prev) =>
        prev.map((d) =>
          d.id === data.donorId
            ? {
                ...d,
                lastDonationDate: today,
                totalDonations: d.totalDonations + 1,
                hemoglobin: data.hemoglobin,
                weightKg: data.weightKg,
              }
            : d
        )
      );
    }

    addAudit(
      'Blood Donation Recorded',
      'Inventory',
      `Donation from ${donorName} processed. Unit ${newUnit.bagNumber} created and placed in ${data.storageLocation}.`
    );
    addToast(`Donation recorded! Unit ${newUnit.bagNumber} added to inventory.`, 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.DONORS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.CAMPS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);

    setUnits(INITIAL_BLOOD_UNITS);
    setDonors(INITIAL_DONORS);
    setRequests(INITIAL_REQUESTS);
    setCamps(INITIAL_CAMPS);
    setStaff(INITIAL_STAFF);
    setAuditLogs(INITIAL_AUDIT_LOGS);

    addToast('Demo database restored to default Sistech sample data!', 'info');
  };

  const getBloodGroupCount = (bg: BloodGroup, component?: ComponentType): number => {
    return units.filter((u) => {
      const matchGroup = u.bloodGroup === bg;
      const matchStatus = u.status === 'available';
      const matchComp = component ? u.component === component : true;
      return matchGroup && matchStatus && matchComp;
    }).length;
  };

  const getRedCellCompatibility = (recipient: BloodGroup): BloodGroup[] => {
    switch (recipient) {
      case 'O-':
        return ['O-'];
      case 'O+':
        return ['O-', 'O+'];
      case 'A-':
        return ['O-', 'A-'];
      case 'A+':
        return ['O-', 'O+', 'A-', 'A+'];
      case 'B-':
        return ['O-', 'B-'];
      case 'B+':
        return ['O-', 'O+', 'B-', 'B+'];
      case 'AB-':
        return ['O-', 'A-', 'B-', 'AB-'];
      case 'AB+':
        return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
      default:
        return [];
    }
  };

  const getPlasmaCompatibility = (recipient: BloodGroup): BloodGroup[] => {
    const groupOnly = recipient.replace(/[+-]/g, '');
    switch (groupOnly) {
      case 'O':
        return ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
      case 'A':
        return ['A+', 'A-', 'AB+', 'AB-'];
      case 'B':
        return ['B+', 'B-', 'AB+', 'AB-'];
      case 'AB':
        return ['AB+', 'AB-'];
      default:
        return [];
    }
  };

  return (
    <BloodBankContext.Provider
      value={{
        units,
        donors,
        requests,
        camps,
        staff,
        auditLogs,
        toasts,
        addToast,
        removeToast,
        addDonor,
        updateDonor,
        addBloodUnit,
        updateUnitStatus,
        addEmergencyRequest,
        updateRequestStatus,
        recordDonation,
        resetDemoData,
        getBloodGroupCount,
        getRedCellCompatibility,
        getPlasmaCompatibility,
      }}
    >
      {children}
    </BloodBankContext.Provider>
  );
};

export const useBloodBank = () => {
  const context = useContext(BloodBankContext);
  if (!context) {
    throw new Error('useBloodBank must be used within a BloodBankProvider');
  }
  return context;
};
