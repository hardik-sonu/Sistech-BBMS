'use client';

import React, { useState } from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { DispatchEmergencyRequest, RequestStatus, BloodUnit } from '../types';
import {
  Ambulance,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  Phone,
  Building2,
  User,
  PackageCheck,
  Send,
  FileText,
} from 'lucide-react';

interface EmergencyDispatchViewProps {
  onOpenNewRequest: () => void;
}

export const EmergencyDispatchView: React.FC<EmergencyDispatchViewProps> = ({
  onOpenNewRequest,
}) => {
  const { requests, units, updateRequestStatus } = useBloodBank();

  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<DispatchEmergencyRequest | null>(null);
  const [selectedBags, setSelectedBags] = useState<string[]>([]);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState<DispatchEmergencyRequest | null>(null);

  const filteredRequests = requests.filter((r) => {
    const matchUrgency = urgencyFilter === 'ALL' || r.urgency === urgencyFilter;
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchUrgency && matchStatus;
  });

  // Matching units for current selected request
  const matchingUnits = selectedRequest
    ? units.filter(
        (u) =>
          u.bloodGroup === selectedRequest.bloodGroup &&
          u.status === 'available'
      )
    : [];

  const handleOpenAllocate = (req: DispatchEmergencyRequest) => {
    setSelectedRequest(req);
    setSelectedBags([]);
    setShowAllocateModal(true);
  };

  const handleConfirmAllocation = (dispatchImmediately: boolean) => {
    if (!selectedRequest) return;
    if (selectedBags.length === 0) {
      alert('Please select at least 1 blood unit bag to allocate.');
      return;
    }

    const nextStatus: RequestStatus = dispatchImmediately ? 'dispatched' : 'approved';
    updateRequestStatus(selectedRequest.id, nextStatus, selectedBags);
    setShowAllocateModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-manrope text-on-surface">
            Emergency Dispatch & Hospital Requisitions
          </h2>
          <p className="text-xs text-on-surface-variant">
            Coordinate STAT clinical blood requests from Sukkur, Khairpur, Larkana, and regional trauma hospitals.
          </p>
        </div>
        <button
          onClick={onOpenNewRequest}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary-container transition-all self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Emergency Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-surface-container-high shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Urgency Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Urgency:</span>
          {['ALL', 'critical', 'urgent', 'routine'].map((u) => (
            <button
              key={u}
              onClick={() => setUrgencyFilter(u)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                urgencyFilter === u
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Status:</span>
          {['ALL', 'pending', 'approved', 'dispatched'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-on-surface text-white shadow-2xs'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-surface-container text-on-surface-variant">
            <Ambulance className="w-10 h-10 mx-auto text-outline/30 mb-2" />
            <p className="font-medium text-sm">No requests found matching your filter criteria.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all ${
                req.urgency === 'critical' && req.status === 'pending'
                  ? 'border-red-300 ring-2 ring-red-500/10'
                  : 'border-surface-container-high'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left side details */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-primary font-black flex items-center justify-center text-lg font-manrope shrink-0 shadow-2xs">
                    {req.bloodGroup}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-on-surface font-manrope">
                        {req.hospitalName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          req.urgency === 'critical'
                            ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                            : req.urgency === 'urgent'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          req.status === 'dispatched'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Patient: <strong className="text-on-surface">{req.patientName}</strong> ({req.patientAge} yrs) • Diagnosis: {req.diagnosis}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant pt-1">
                      <span>Requirement: <strong className="text-primary">{req.unitsRequested} Unit(s)</strong> of {req.component}</span>
                      <span>Required By: <strong>{req.requiredBy}</strong></span>
                      <span>Doctor: {req.contactDoctor} ({req.contactPhone})</span>
                    </div>
                  </div>
                </div>

                {/* Right side action controls */}
                <div className="flex flex-wrap items-center gap-2 lg:self-center shrink-0">
                  {req.status === 'pending' && (
                    <button
                      onClick={() => handleOpenAllocate(req)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-xs transition-all"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Allocate & Dispatch</span>
                    </button>
                  )}

                  {req.status === 'approved' && (
                    <button
                      onClick={() => updateRequestStatus(req.id, 'dispatched')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirm Cold Transit Dispatch</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowVoucherModal(req)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface hover:bg-surface-container text-on-surface-variant text-xs font-semibold border border-outline/20 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Requisition</span>
                  </button>
                </div>
              </div>

              {/* Assigned Bag Badges */}
              {req.assignedBagNumbers && req.assignedBagNumbers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-surface-container flex items-center gap-2 text-xs">
                  <span className="font-semibold text-on-surface-variant">Allocated Bags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {req.assignedBagNumbers.map((bag) => (
                      <span
                        key={bag}
                        className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-primary border border-outline/20"
                      >
                        {bag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Allocation Modal */}
      {showAllocateModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-surface-container-high space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="font-bold text-base text-on-surface font-manrope">
                  Allocate Blood Bags for Dispatch
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Requisition #{selectedRequest.requestNumber} • {selectedRequest.hospitalName}
                </p>
              </div>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-surface-container text-xs flex justify-between">
              <div>
                <span className="text-on-surface-variant block">Requested:</span>
                <span className="font-bold text-primary text-sm">
                  {selectedRequest.unitsRequested} Unit(s) {selectedRequest.bloodGroup}
                </span>
              </div>
              <div className="text-right">
                <span className="text-on-surface-variant block">Units Selected:</span>
                <span className="font-bold text-on-surface text-sm">
                  {selectedBags.length} / {selectedRequest.unitsRequested}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-on-surface-variant">
                Select Available Compatible Units in Cold Storage:
              </label>

              {matchingUnits.length === 0 ? (
                <div className="p-4 bg-red-50 text-red-800 rounded-xl text-xs border border-red-200">
                  <strong>Warning:</strong> No units of exact blood group {selectedRequest.bloodGroup} are currently marked as available in stock. Check the Compatibility Matrix for universal donor alternatives (e.g. O-).
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {matchingUnits.map((u) => {
                    const isChecked = selectedBags.includes(u.bagNumber);
                    return (
                      <label
                        key={u.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                          isChecked
                            ? 'bg-red-50/50 border-primary'
                            : 'bg-white border-surface-container hover:bg-surface'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBags([...selectedBags, u.bagNumber]);
                              } else {
                                setSelectedBags(selectedBags.filter((b) => b !== u.bagNumber));
                              }
                            }}
                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                          />
                          <div>
                            <span className="font-bold text-on-surface font-mono">{u.bagNumber}</span>
                            <span className="text-on-surface-variant text-[11px] block">{u.component} • {u.storageLocation}</span>
                          </div>
                        </div>
                        <div className="text-right text-[11px]">
                          <span className="text-red-700 font-semibold block">Exp: {u.expiryDate}</span>
                          <span className="text-outline">{u.volumeMl} ml</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-surface-container flex flex-wrap items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAllocateModal(false)}
                className="px-4 py-2 rounded-xl font-semibold bg-surface hover:bg-surface-container text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmAllocation(false)}
                disabled={selectedBags.length === 0}
                className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
              >
                Approve (Stage for Pickup)
              </button>
              <button
                type="button"
                onClick={() => handleConfirmAllocation(true)}
                disabled={selectedBags.length === 0}
                className="px-4 py-2 rounded-xl font-bold bg-primary hover:bg-primary-container text-white disabled:opacity-40 shadow-xs"
              >
                Instant STAT Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="font-bold text-base text-on-surface font-manrope">
                  Hospital Dispatch Slip
                </h3>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {showVoucherModal.requestNumber}
                </span>
              </div>
              <button
                onClick={() => setShowVoucherModal(null)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-surface rounded-xl border border-surface-container space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Receiving Hospital:</span>
                <span className="font-bold text-on-surface">{showVoucherModal.hospitalName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Patient Name & Age:</span>
                <span className="font-bold text-on-surface">{showVoucherModal.patientName} ({showVoucherModal.patientAge}y)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Blood Group & Component:</span>
                <span className="font-bold text-primary">{showVoucherModal.bloodGroup} • {showVoucherModal.component}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Units Quantity:</span>
                <span className="font-bold text-on-surface">{showVoucherModal.unitsRequested} Unit(s)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Attending Doctor:</span>
                <span className="font-bold text-on-surface">{showVoucherModal.contactDoctor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Dispatch Status:</span>
                <span className="font-bold uppercase text-emerald-700">{showVoucherModal.status}</span>
              </div>
              {showVoucherModal.notes && (
                <div className="pt-1 text-[11px] text-on-surface-variant">
                  <strong>Notes:</strong> {showVoucherModal.notes}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-outline">Sistech Clinical Transfusion Wing Sukkur</span>
              <button
                onClick={() => setShowVoucherModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-container text-on-surface"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
