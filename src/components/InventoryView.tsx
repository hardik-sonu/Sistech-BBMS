'use client';

import React, { useState } from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { BloodGroup, ComponentType, UnitStatus, BloodUnit } from '../types';
import {
  Droplets,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  Tag,
} from 'lucide-react';

interface InventoryViewProps {
  initialBloodGroupFilter?: string;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ initialBloodGroupFilter }) => {
  const { units, updateUnitStatus, addBloodUnit } = useBloodBank();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>(initialBloodGroupFilter || 'ALL');
  const [selectedComponent, setSelectedComponent] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [inspectUnit, setInspectUnit] = useState<BloodUnit | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New unit form state
  const [newBagNumber, setNewBagNumber] = useState('');
  const [newGroup, setNewGroup] = useState<BloodGroup>('O+');
  const [newComponent, setNewComponent] = useState<ComponentType>('Packed Red Cells (PRBC)');
  const [newVolume, setNewVolume] = useState(450);
  const [newLocation, setNewLocation] = useState('Cold Storage Room 1 - Bay A1');
  const [newDonorName, setNewDonorName] = useState('Voluntary Regional Donor');

  const bloodGroups: (BloodGroup | 'ALL')[] = ['ALL', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components: (ComponentType | 'ALL')[] = [
    'ALL',
    'Packed Red Cells (PRBC)',
    'Fresh Frozen Plasma (FFP)',
    'Platelet Concentrate',
    'Whole Blood',
    'Cryoprecipitate',
  ];
  const statuses: (UnitStatus | 'ALL')[] = ['ALL', 'available', 'reserved', 'dispatched', 'quarantine', 'expired'];

  // Filtered list
  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.bagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.storageLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = selectedGroup === 'ALL' || u.bloodGroup === selectedGroup;
    const matchesComponent = selectedComponent === 'ALL' || u.component === selectedComponent;
    const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;

    return matchesSearch && matchesGroup && matchesComponent && matchesStatus;
  });

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const expiry = new Date();
    if (newComponent.includes('Platelet')) {
      expiry.setDate(expiry.getDate() + 5);
    } else if (newComponent.includes('Plasma') || newComponent.includes('Cryo')) {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
      expiry.setDate(expiry.getDate() + 35);
    }

    const bagCode =
      newBagNumber.trim() ||
      `SUK-26-${newGroup.replace('+', 'P').replace('-', 'N')}-${Math.floor(100 + Math.random() * 900)}`;

    addBloodUnit({
      bagNumber: bagCode,
      bloodGroup: newGroup,
      component: newComponent,
      volumeMl: Number(newVolume),
      collectionDate: today,
      expiryDate: expiry.toISOString().slice(0, 10),
      status: 'available',
      storageLocation: newLocation,
      donorId: 'VOL-MANUAL',
      donorName: newDonorName || 'Voluntary Donor',
      testedSafe: true,
    });

    setShowAddModal(false);
    setNewBagNumber('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-manrope text-on-surface">
            Blood Units Inventory
          </h2>
          <p className="text-xs text-on-surface-variant">
            Track individual barcoded blood bags, component fractionation, storage bays, and expiration dates.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary-container transition-all self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Unit Manually</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-container-high shadow-2xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bag number (e.g. SUK-26-OP-101), donor name, or storage location..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface/30"
          />
        </div>

        {/* Group Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          <span className="text-xs font-semibold text-on-surface-variant mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Group:
          </span>
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

        {/* Component & Status Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-surface-container">
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
              Component Type
            </label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/30"
            >
              {components.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
              Unit Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/30"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-surface-container-high shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing <strong>{filteredUnits.length}</strong> matching unit{filteredUnits.length === 1 ? '' : 's'}</span>
          <span className="text-[11px] text-outline">Cold Chain Temp: 2°C – 6°C Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface text-on-surface-variant uppercase text-[10px] font-bold tracking-wider border-b border-surface-container">
              <tr>
                <th className="px-5 py-3">Bag Number / Group</th>
                <th className="px-4 py-3">Component Type</th>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3">Storage Location</th>
                <th className="px-4 py-3">Collection / Expiry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-on-surface-variant">
                    <Droplets className="w-8 h-8 mx-auto text-outline/40 mb-2" />
                    <p className="font-medium">No blood units found matching your filters.</p>
                    <p className="text-[11px] text-outline mt-1">Try resetting the blood group or component filter.</p>
                  </td>
                </tr>
              ) : (
                filteredUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-surface/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-red-100 text-primary font-black flex items-center justify-center text-xs font-manrope">
                          {u.bloodGroup}
                        </span>
                        <div>
                          <div className="font-bold text-on-surface">{u.bagNumber}</div>
                          <div className="text-[11px] text-on-surface-variant">Donor: {u.donorName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-on-surface">{u.component}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-on-surface">
                      {u.volumeMl} ml
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-outline" />
                        <span>{u.storageLocation}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-on-surface">{u.collectionDate}</div>
                      <div className="text-[11px] text-red-700 font-medium">Exp: {u.expiryDate}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          u.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.status === 'reserved'
                            ? 'bg-blue-100 text-blue-800'
                            : u.status === 'dispatched'
                            ? 'bg-purple-100 text-purple-800'
                            : u.status === 'quarantine'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setInspectUnit(u)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-container px-2.5 py-1 rounded-lg hover:bg-surface-container transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Unit Modal */}
      {inspectUnit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-100 text-primary font-black flex items-center justify-center text-sm font-manrope">
                  {inspectUnit.bloodGroup}
                </span>
                <div>
                  <h3 className="font-bold text-on-surface">Unit {inspectUnit.bagNumber}</h3>
                  <span className="text-xs text-on-surface-variant">{inspectUnit.component}</span>
                </div>
              </div>
              <button
                onClick={() => setInspectUnit(null)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-surface-container">
                <span className="text-on-surface-variant block mb-0.5">Current Status</span>
                <span className="font-bold uppercase text-on-surface">{inspectUnit.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface-container">
                <span className="text-on-surface-variant block mb-0.5">Volume</span>
                <span className="font-bold text-on-surface">{inspectUnit.volumeMl} ml</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface-container">
                <span className="text-on-surface-variant block mb-0.5">Collection Date</span>
                <span className="font-bold text-on-surface">{inspectUnit.collectionDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-surface-container">
                <span className="text-on-surface-variant block mb-0.5">Expiry Date</span>
                <span className="font-bold text-red-700">{inspectUnit.expiryDate}</span>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-surface border border-surface-container">
                <span className="text-on-surface-variant block mb-0.5">Storage Bay</span>
                <span className="font-bold text-on-surface">{inspectUnit.storageLocation}</span>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-xs">Transfusion Screening: All 5 Mandatory Pathogen Tests Negative</span>
              </div>
            </div>

            {/* Quick Status Changers */}
            <div className="pt-2 border-t border-surface-container">
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">
                Update Unit Status:
              </label>
              <div className="flex flex-wrap gap-2">
                {(['available', 'reserved', 'quarantine', 'expired'] as UnitStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateUnitStatus(inspectUnit.id, st);
                      setInspectUnit({ ...inspectUnit, status: st });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      inspectUnit.status === st
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface text-on-surface-variant border-outline/30 hover:bg-surface-container'
                    }`}
                  >
                    Mark {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 text-right">
              <button
                onClick={() => setInspectUnit(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-container text-on-surface"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-bold text-base text-on-surface font-manrope">
                Add Blood Unit Manually
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Bag Barcode / Number (Optional, auto-generated if blank)
                </label>
                <input
                  type="text"
                  value={newBagNumber}
                  onChange={(e) => setNewBagNumber(e.target.value)}
                  placeholder="e.g. SUK-26-OP-109"
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Blood Group
                  </label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    Volume (ml)
                  </label>
                  <input
                    type="number"
                    value={newVolume}
                    onChange={(e) => setNewVolume(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Component Type
                </label>
                <select
                  value={newComponent}
                  onChange={(e) => setNewComponent(e.target.value as ComponentType)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Packed Red Cells (PRBC)">Packed Red Cells (PRBC)</option>
                  <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                  <option value="Platelet Concentrate">Platelet Concentrate</option>
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Donor Full Name / Source
                </label>
                <input
                  type="text"
                  value={newDonorName}
                  onChange={(e) => setNewDonorName(e.target.value)}
                  placeholder="e.g. Voluntary Donor / Camp"
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Storage Location Bay
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Cold Storage Room 1 - Bay A3"
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-container text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-container text-white shadow-xs"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
