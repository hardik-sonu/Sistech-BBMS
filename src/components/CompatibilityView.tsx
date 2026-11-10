'use client';

import React, { useState } from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { BloodGroup } from '../types';
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  Droplet,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const CompatibilityView: React.FC = () => {
  const { getBloodGroupCount, getRedCellCompatibility, getPlasmaCompatibility } = useBloodBank();

  const [selectedRecipient, setSelectedRecipient] = useState<BloodGroup>('O-');

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const compatibleRedCellDonors = getRedCellCompatibility(selectedRecipient);
  const compatiblePlasmaDonors = getPlasmaCompatibility(selectedRecipient);

  // Can donate red cells to:
  const canDonateRedCellsTo = (donor: BloodGroup): BloodGroup[] => {
    return bloodGroups.filter((rec) => getRedCellCompatibility(rec).includes(donor));
  };

  const recipientCanDonateTo = canDonateRedCellsTo(selectedRecipient);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-manrope text-on-surface">
          Clinical Blood Compatibility Checker
        </h2>
        <p className="text-xs text-on-surface-variant">
          Interactive serological cross-match compatibility for packed red blood cells (PRBC) and fresh frozen plasma (FFP) with live inventory counts.
        </p>
      </div>

      {/* Recipient Blood Group Selector */}
      <div className="bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Select Patient (Recipient) Blood Group:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedRecipient(bg)}
              className={`py-3 px-2 rounded-xl text-center font-manrope transition-all ${
                selectedRecipient === bg
                  ? 'bg-primary text-white shadow-xs ring-4 ring-primary/20 scale-102'
                  : 'bg-surface hover:bg-surface-container text-on-surface border border-surface-container-high'
              }`}
            >
              <span className="block text-lg sm:text-xl font-black">{bg}</span>
              <span className="text-[10px] block opacity-80 mt-0.5">
                {getBloodGroupCount(bg)} in stock
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Compatibility Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Red Blood Cells (PRBC) Compatibility */}
        <div className="bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-primary flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-on-surface font-manrope">
                  Compatible Red Blood Cell (PRBC) Donors
                </h3>
                <span className="text-[11px] text-on-surface-variant">
                  Patient <strong className="text-primary">{selectedRecipient}</strong> can safely receive from:
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {bloodGroups.map((donorGroup) => {
              const isCompatible = compatibleRedCellDonors.includes(donorGroup);
              const countInStock = getBloodGroupCount(donorGroup);
              return (
                <div
                  key={donorGroup}
                  className={`p-3 rounded-xl border flex flex-col justify-between text-xs transition-all ${
                    isCompatible
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base font-manrope">{donorGroup}</span>
                    {isCompatible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <div className="mt-2 text-[11px]">
                    {isCompatible ? (
                      <span className="font-bold text-emerald-700">
                        {countInStock} Unit{countInStock === 1 ? '' : 's'} Ready
                      </span>
                    ) : (
                      <span>Incompatible</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-on-surface-variant bg-surface p-3 rounded-xl border border-surface-container flex items-start gap-2">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              {selectedRecipient === 'O-' && 'O Negative is the Universal Red Blood Cell Donor. However, O- patients can ONLY receive from O- donors.'}
              {selectedRecipient === 'AB+' && 'AB Positive is the Universal Red Blood Cell Recipient. This patient can receive packed red cells from ANY blood type.'}
              {selectedRecipient !== 'O-' && selectedRecipient !== 'AB+' && `Patient ${selectedRecipient} can receive red cells from ${compatibleRedCellDonors.join(', ')}.`}
            </p>
          </div>
        </div>

        {/* Fresh Frozen Plasma (FFP) Compatibility */}
        <div className="bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-on-surface font-manrope">
                  Compatible Fresh Frozen Plasma (FFP) Donors
                </h3>
                <span className="text-[11px] text-on-surface-variant">
                  Patient <strong className="text-amber-800">{selectedRecipient}</strong> can safely receive plasma from:
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {bloodGroups.map((donorGroup) => {
              const isCompatible = compatiblePlasmaDonors.includes(donorGroup);
              const countInStock = getBloodGroupCount(donorGroup, 'Fresh Frozen Plasma (FFP)');
              return (
                <div
                  key={donorGroup}
                  className={`p-3 rounded-xl border flex flex-col justify-between text-xs transition-all ${
                    isCompatible
                      ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base font-manrope">{donorGroup}</span>
                    {isCompatible ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <div className="mt-2 text-[11px]">
                    {isCompatible ? (
                      <span className="font-bold text-amber-800">
                        {countInStock} FFP in Bank
                      </span>
                    ) : (
                      <span>Incompatible</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-on-surface-variant bg-surface p-3 rounded-xl border border-surface-container flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p>
              Plasma compatibility is the INVERSE of red cell compatibility. AB blood contains no ABO antibodies, making <strong>AB the Universal Plasma Donor</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Complete Clinical 8x8 Compatibility Matrix Table */}
      <div className="bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="font-bold text-base text-on-surface font-manrope">
            Full 8×8 Clinical Compatibility Matrix (Red Blood Cells)
          </h3>
          <p className="text-xs text-on-surface-variant">
            Cross-reference of Donor (columns) to Patient / Recipient (rows).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-surface text-on-surface font-bold">
                <th className="p-2.5 text-left text-[11px] font-bold text-on-surface-variant border border-surface-container">
                  Recipient \ Donor
                </th>
                {bloodGroups.map((d) => (
                  <th key={d} className="p-2.5 border border-surface-container font-manrope font-black text-primary">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloodGroups.map((rec) => {
                const isCurrent = rec === selectedRecipient;
                return (
                  <tr
                    key={rec}
                    className={`${isCurrent ? 'bg-red-50/50 font-bold' : 'hover:bg-surface/50'}`}
                  >
                    <td className="p-2.5 text-left font-manrope font-black text-on-surface border border-surface-container">
                      {rec} {isCurrent && <span className="text-[10px] text-primary font-normal">(Selected)</span>}
                    </td>
                    {bloodGroups.map((don) => {
                      const match = getRedCellCompatibility(rec).includes(don);
                      return (
                        <td
                          key={don}
                          className={`p-2.5 border border-surface-container ${
                            match ? 'text-emerald-700 bg-emerald-50/40' : 'text-zinc-300'
                          }`}
                        >
                          {match ? '✓' : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
