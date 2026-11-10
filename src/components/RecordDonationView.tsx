'use client';

import React, { useState, useEffect } from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { BloodGroup, ComponentType } from '../types';
import { NavTab } from './Navigation';
import {
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  User,
  Activity,
  Droplet,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface RecordDonationViewProps {
  initialDonorId?: string;
  onNavigate: (tab: NavTab) => void;
}

export const RecordDonationView: React.FC<RecordDonationViewProps> = ({
  initialDonorId,
  onNavigate,
}) => {
  const { donors, recordDonation, staff } = useBloodBank();

  const [selectedDonorId, setSelectedDonorId] = useState<string>(initialDonorId || (donors[0]?.id || ''));
  const [component, setComponent] = useState<ComponentType>('Packed Red Cells (PRBC)');
  const [volumeMl, setVolumeMl] = useState(450);
  const [storageLocation, setStorageLocation] = useState('Cold Storage Room 1 - Bay A2');
  const [hemoglobin, setHemoglobin] = useState(14.2);
  const [weightKg, setWeightKg] = useState(72);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [pulse, setPulse] = useState(74);
  const [phlebotomist, setPhlebotomist] = useState(staff[2]?.name || 'Adnan Shaikh, MLT');
  const [screeningHepatitis, setScreeningHepatitis] = useState(true);
  const [screeningHiv, setScreeningHiv] = useState(true);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [lastBagCode, setLastBagCode] = useState('');

  useEffect(() => {
    if (initialDonorId) {
      setSelectedDonorId(initialDonorId);
    }
  }, [initialDonorId]);

  const currentDonor = donors.find((d) => d.id === selectedDonorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDonor) {
      alert('Please select a donor first.');
      return;
    }

    if (!screeningHepatitis || !screeningHiv) {
      alert('Screening tests must be passed prior to inventory accession.');
      return;
    }

    const bagCode = `SUK-26-${currentDonor.bloodGroup.replace('+', 'P').replace('-', 'N')}-${Math.floor(100 + Math.random() * 900)}`;
    setLastBagCode(bagCode);

    recordDonation({
      donorId: currentDonor.id,
      bloodGroup: currentDonor.bloodGroup,
      component,
      volumeMl: Number(volumeMl),
      storageLocation,
      hemoglobin: Number(hemoglobin),
      weightKg: Number(weightKg),
    });

    setDonationSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-manrope text-on-surface">
          Record Clinical Blood Donation
        </h2>
        <p className="text-xs text-on-surface-variant">
          Complete mandatory pre-donation donor vitals screening, phlebotomy logging, and storage cold-chain allocation.
        </p>
      </div>

      {donationSuccess ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface font-manrope">
              Donation Successfully Recorded!
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Unit barcoded as <strong>{lastBagCode}</strong> for donor <strong>{currentDonor?.fullName}</strong> ({currentDonor?.bloodGroup}).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-surface-container text-xs max-w-md mx-auto text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Assigned Unit Bag:</span>
              <span className="font-bold text-primary">{lastBagCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Component:</span>
              <span className="font-bold text-on-surface">{component}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Assigned Storage:</span>
              <span className="font-bold text-on-surface">{storageLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Phlebotomist:</span>
              <span className="font-bold text-on-surface">{phlebotomist}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setDonationSuccess(false);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-container text-on-surface"
            >
              Record Another Donation
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-white shadow-xs"
            >
              View in Inventory &rarr;
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Donor Selection & Vitals */}
          <div className="bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-container pb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm text-on-surface font-manrope">
                Step 1: Donor Identification & Clinical Screening
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Select Registered Donor *
                </label>
                <select
                  value={selectedDonorId}
                  onChange={(e) => setSelectedDonorId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/30 font-medium"
                >
                  {donors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.bloodGroup}) — CNIC: {d.cnic}
                    </option>
                  ))}
                </select>
              </div>

              {currentDonor && (
                <div className="p-3 bg-surface rounded-xl border border-surface-container flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-on-surface-variant block">Blood Group</span>
                    <span className="text-xl font-black text-primary font-manrope">
                      {currentDonor.bloodGroup}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-on-surface-variant block">Eligibility Status</span>
                    <span className="text-xs font-bold text-emerald-700 uppercase">
                      {currentDonor.eligibilityStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Vitals Check */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Hemoglobin (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="12.0"
                  max="18.0"
                  value={hemoglobin}
                  onChange={(e) => setHemoglobin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="48"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="120/80"
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Pulse Rate (bpm)
                </label>
                <input
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Collection & Bag Specifications */}
          <div className="bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-container pb-3">
              <Droplet className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm text-on-surface font-manrope">
                Step 2: Phlebotomy & Component Fractionation
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Component Fractionation
                </label>
                <select
                  value={component}
                  onChange={(e) => setComponent(e.target.value as ComponentType)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none bg-surface/30 font-medium"
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
                  Volume (ml)
                </label>
                <select
                  value={volumeMl}
                  onChange={(e) => setVolumeMl(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none bg-surface/30 font-medium"
                >
                  <option value={450}>450 ml Standard Bag</option>
                  <option value={500}>500 ml Bag</option>
                  <option value={250}>250 ml (Plasma/Component)</option>
                  <option value={50}>50 ml (Platelets)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Phlebotomist On Duty
                </label>
                <input
                  type="text"
                  value={phlebotomist}
                  onChange={(e) => setPhlebotomist(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-on-surface-variant mb-1 text-xs">
                Cold Chain Storage Bay Allocation
              </label>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none bg-surface/30 text-xs font-medium"
              >
                <option value="Cold Storage Room 1 - Bay A1">Cold Storage Room 1 - Bay A1 (Red Cells 2-6°C)</option>
                <option value="Cold Storage Room 1 - Bay A2">Cold Storage Room 1 - Bay A2 (Red Cells 2-6°C)</option>
                <option value="Cold Storage Room 2 - Bay C1">Cold Storage Room 2 - Bay C1 (General Reserves)</option>
                <option value="Deep Freezer (-30°C) - Rack 1">Deep Freezer (-30°C) - Rack 1 (Plasma & Cryo)</option>
                <option value="Agitator Unit 1 - Shelf 1">Agitator Unit 1 - Shelf 1 (Platelets 20-24°C with continuous agitation)</option>
                <option value="Emergency Reserve Fridge - Bay 1">Emergency Reserve Fridge - Bay 1 (STAT Trauma Reserves)</option>
              </select>
            </div>

            {/* Pathogen Screening Checkboxes */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Mandatory Serological Screening Checklist:
              </span>
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={screeningHepatitis}
                    onChange={(e) => setScreeningHepatitis(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span>HBsAg & Anti-HCV Non-Reactive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={screeningHiv}
                    onChange={(e) => setScreeningHiv(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span>HIV 1/2, VDRL (Syphilis) & Malaria ICT Negative</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-surface hover:bg-surface-container text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary-container text-white shadow-xs transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Complete & Credit to Bank</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
