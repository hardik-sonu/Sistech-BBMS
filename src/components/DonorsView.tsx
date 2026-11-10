'use client';

import React, { useState } from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { Donor, BloodGroup, EligibilityStatus } from '../types';
import { NavTab } from './Navigation';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  AlertCircle,
  CheckCircle,
  X,
  CreditCard,
  HeartHandshake,
} from 'lucide-react';

interface DonorsViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectDonorForDonation: (donorId: string) => void;
}

export const DonorsView: React.FC<DonorsViewProps> = ({
  onNavigate,
  onSelectDonorForDonation,
}) => {
  const { donors, addDonor } = useBloodBank();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('ALL');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [inspectDonor, setInspectDonor] = useState<Donor | null>(null);

  // New Donor Form State
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [age, setAge] = useState(28);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('+92 300 ');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Sukkur');
  const [address, setAddress] = useState('');
  const [weightKg, setWeightKg] = useState(70);
  const [hemoglobin, setHemoglobin] = useState(14.0);

  const bloodGroups: (BloodGroup | 'ALL')[] = ['ALL', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const filteredDonors = donors.filter((d) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      d.fullName.toLowerCase().includes(query) ||
      d.cnic.includes(query) ||
      d.phone.includes(query) ||
      d.city.toLowerCase().includes(query);

    const matchesGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
    const matchesEligibility = selectedEligibility === 'ALL' || d.eligibilityStatus === selectedEligibility;

    return matchesSearch && matchesGroup && matchesEligibility;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !cnic || !phone) {
      alert('Please fill out all required fields (Name, CNIC, Phone)');
      return;
    }

    const isEligible = age >= 18 && age <= 65 && weightKg >= 50 && hemoglobin >= 12.5;

    addDonor({
      fullName,
      cnic,
      gender,
      age: Number(age),
      bloodGroup,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      city,
      address: address || `${city}, Sindh`,
      lastDonationDate: null,
      totalDonations: 0,
      eligibilityStatus: isEligible ? 'eligible' : 'deferred',
      deferralReason: isEligible ? undefined : 'Screening criteria not met (Age / Weight / Hb)',
      weightKg: Number(weightKg),
      hemoglobin: Number(hemoglobin),
    });

    setShowRegisterModal(false);
    // Reset fields
    setFullName('');
    setCnic('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-manrope text-on-surface">
            Voluntary Donors Directory
          </h2>
          <p className="text-xs text-on-surface-variant">
            Registered donor roster in Sukkur, Rohri, Khairpur, and surrounding Sindh districts.
          </p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary-container transition-all self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Donor</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-surface-container-high shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search donors by Name, CNIC (e.g. 45504-...), Phone, or City..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/30"
          />
        </div>

        {/* Group tabs & Eligibility toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-on-surface-variant mr-1 shrink-0">Blood Group:</span>
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedGroup === bg
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-on-surface-variant">Status:</span>
            <select
              value={selectedEligibility}
              onChange={(e) => setSelectedEligibility(e.target.value)}
              className="px-3 py-1 text-xs rounded-lg border border-outline/30 focus:outline-none bg-surface/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="eligible">Eligible Only</option>
              <option value="deferred">Deferred Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-surface-container text-on-surface-variant">
            <Users className="w-10 h-10 mx-auto text-outline/30 mb-2" />
            <p className="font-medium text-sm">No donors found matching your search.</p>
          </div>
        ) : (
          filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-2xl border border-surface-container-high p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-xl bg-red-100 text-primary font-black flex items-center justify-center text-base font-manrope shadow-2xs">
                      {donor.bloodGroup}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface font-manrope">
                        {donor.fullName}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <CreditCard className="w-3 h-3 text-outline" />
                        <span>CNIC: {donor.cnic}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      donor.eligibilityStatus === 'eligible'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {donor.eligibilityStatus}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container space-y-2 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-outline" />
                    <span>{donor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-outline" />
                    <span className="truncate">{donor.address} ({donor.city})</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px]">Last Donation:</span>
                    <strong className="text-on-surface text-[11px]">
                      {donor.lastDonationDate || 'First time donor'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">Total Donations:</span>
                    <span className="font-bold text-primary text-[11px]">
                      {donor.totalDonations} Unit(s) Given
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectDonor(donor)}
                  className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-2.5 py-1.5 rounded-lg hover:bg-surface-container"
                >
                  View Card
                </button>
                <button
                  onClick={() => onSelectDonorForDonation(donor.id)}
                  disabled={donor.eligibilityStatus !== 'eligible'}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    donor.eligibilityStatus === 'eligible'
                      ? 'bg-primary text-white hover:bg-primary-container shadow-2xs'
                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Donate Today</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Donor Card Modal */}
      {inspectDonor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-bold text-base text-on-surface font-manrope">
                Donor Registration Record
              </h3>
              <button
                onClick={() => setInspectDonor(null)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2">
              <span className="inline-block w-16 h-16 rounded-2xl bg-red-100 text-primary font-black text-2xl leading-none flex items-center justify-center mx-auto mb-2 shadow-xs">
                {inspectDonor.bloodGroup}
              </span>
              <h4 className="text-lg font-bold text-on-surface">{inspectDonor.fullName}</h4>
              <p className="text-xs text-on-surface-variant">Donor ID: {inspectDonor.id}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">CNIC:</span>
                <span className="font-bold text-on-surface">{inspectDonor.cnic}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Age / Gender:</span>
                <span className="font-bold text-on-surface">{inspectDonor.age} years / {inspectDonor.gender}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Weight / Hb:</span>
                <span className="font-bold text-on-surface">{inspectDonor.weightKg} kg / {inspectDonor.hemoglobin} g/dL</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Contact:</span>
                <span className="font-bold text-on-surface">{inspectDonor.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Location:</span>
                <span className="font-bold text-on-surface">{inspectDonor.address}, {inspectDonor.city}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant">Eligibility:</span>
                <span className="font-bold uppercase text-emerald-700">{inspectDonor.eligibilityStatus}</span>
              </div>
              {inspectDonor.deferralReason && (
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800 text-[11px]">
                  <strong>Deferral Note:</strong> {inspectDonor.deferralReason}
                </div>
              )}
            </div>

            <div className="pt-3 text-right">
              <button
                onClick={() => setInspectDonor(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-container text-on-surface"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Donor Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-surface-container-high space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-bold text-base text-on-surface font-manrope">
                Register New Voluntary Donor
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Asad Ali Junejo"
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    CNIC (National ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="45504-XXXXXXX-X"
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  >
                    {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="45"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    City (Sindh)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Sukkur Barrage / Airport Road"
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="p-3 bg-surface rounded-xl border border-surface-container text-[11px] text-on-surface-variant space-y-1">
                <strong>Standard Clinical Eligibility Check:</strong>
                <p>Donors must weigh ≥ 50kg, age 18-65, Hb ≥ 12.5 g/dL, with minimum 90 days interval between full blood donations.</p>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-container text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-white shadow-xs"
                >
                  Save Donor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
