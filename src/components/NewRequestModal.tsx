'use client';

import React, { useState } from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { BloodGroup, ComponentType, UrgencyLevel } from '../types';
import { Ambulance, X, Building2, User, Phone, AlertTriangle } from 'lucide-react';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({ isOpen, onClose }) => {
  const { addEmergencyRequest } = useBloodBank();

  const [hospitalName, setHospitalName] = useState('Civil Hospital Sukkur (ICU Trauma Ward)');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(35);
  const [diagnosis, setDiagnosis] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<ComponentType>('Packed Red Cells (PRBC)');
  const [unitsRequested, setUnitsRequested] = useState(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('critical');
  const [requiredBy, setRequiredBy] = useState('Immediate / STAT (Under 30 mins)');
  const [contactDoctor, setContactDoctor] = useState('Dr. Ghulam Sarwar Soomro');
  const [contactPhone, setContactPhone] = useState('+92 300 9876543');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !diagnosis) {
      alert('Please fill out patient name and clinical diagnosis.');
      return;
    }

    addEmergencyRequest({
      hospitalName,
      patientName,
      patientAge: Number(patientAge),
      diagnosis,
      bloodGroup,
      component,
      unitsRequested: Number(unitsRequested),
      urgency,
      requiredBy,
      contactDoctor,
      contactPhone,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-surface-container-high space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-primary flex items-center justify-center">
              <Ambulance className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface font-manrope">
                New Emergency Hospital Requisition
              </h3>
              <p className="text-xs text-on-surface-variant">
                Intake STAT blood transfusion request for clinical dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">
              Requesting Hospital / Trauma Facility *
            </label>
            <select
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/30 font-medium"
            >
              <option value="Civil Hospital Sukkur (ICU Trauma Ward)">Civil Hospital Sukkur (ICU Trauma Ward)</option>
              <option value="SIUT Chhablani Medical Center Sukkur">SIUT Chhablani Medical Center Sukkur</option>
              <option value="GMMMC Hospital Sukkur (Gynecology Ward)">GMMMC Hospital Sukkur (Gynecology Ward)</option>
              <option value="Red Crescent Hospital Sukkur">Red Crescent Hospital Sukkur</option>
              <option value="Taluka Hospital Rohri">Taluka Hospital Rohri</option>
              <option value="Civil Hospital Khairpur Mirs">Civil Hospital Khairpur Mirs</option>
              <option value="Chandka Medical College Hospital Larkana">Chandka Medical College Hospital Larkana</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-on-surface-variant mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Muhammad Tariq Lashari"
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">
                Age
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">
              Clinical Diagnosis / Medical Indication *
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Major hemorrhagic shock, PPH, Thalassemia, or Pre-op bypass"
              className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">
                Blood Group *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-primary"
              >
                {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">
                Component
              </label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as ComponentType)}
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
              >
                <option value="Packed Red Cells (PRBC)">Packed Red Cells (PRBC)</option>
                <option value="Whole Blood">Whole Blood</option>
                <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                <option value="Platelet Concentrate">Platelet Concentrate</option>
                <option value="Cryoprecipitate">Cryoprecipitate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">
                Units Count
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsRequested}
                onChange={(e) => setUnitsRequested(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none font-bold"
              >
                <option value="critical">CRITICAL (STAT Emergency)</option>
                <option value="urgent">URGENT (Within 2-3 Hours)</option>
                <option value="routine">ROUTINE (Scheduled Procedure)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">
                Required By
              </label>
              <input
                type="text"
                value={requiredBy}
                onChange={(e) => setRequiredBy(e.target.value)}
                placeholder="e.g. Immediate / STAT"
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">
                Attending Doctor
              </label>
              <input
                type="text"
                value={contactDoctor}
                onChange={(e) => setContactDoctor(e.target.value)}
                placeholder="e.g. Dr. Munir Ahmed"
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">
              Special Handling / Cross-Match Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Major cross-match requested; patient in OT Room 2"
              className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-container text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-container text-white shadow-xs"
            >
              Submit Emergency Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
