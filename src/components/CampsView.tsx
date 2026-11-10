'use client';

import React, { useState } from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { DonationCamp } from '../types';
import {
  Tent,
  Plus,
  MapPin,
  Calendar,
  Users,
  Phone,
  CheckCircle2,
  Clock,
  X,
  Target,
} from 'lucide-react';

export const CampsView: React.FC = () => {
  const { camps, addToast } = useBloodBank();

  const [campsList, setCampsList] = useState<DonationCamp[]>(camps);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('Sukkur');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetUnits, setTargetUnits] = useState(100);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('+92 300 ');

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !startDate) {
      alert('Please fill out all required fields.');
      return;
    }

    const newCamp: DonationCamp = {
      id: `CMP-${Date.now().toString().slice(-3)}`,
      title,
      venue,
      city,
      startDate,
      endDate: endDate || startDate,
      targetUnits: Number(targetUnits),
      collectedUnits: 0,
      coordinatorName: coordinatorName || 'Sistech Mobile Team',
      coordinatorPhone: coordinatorPhone || '+92 300 0000000',
      status: 'upcoming',
    };

    setCampsList([newCamp, ...campsList]);
    setShowAddModal(false);
    addToast(`Donation Camp "${title}" scheduled successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-manrope text-on-surface">
            Mobile Blood Donation Drives & Camps
          </h2>
          <p className="text-xs text-on-surface-variant">
            Coordinate voluntary outreach drives across universities, railway hubs, and community centers in Sukkur and upper Sindh.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm hover:bg-primary-container transition-all self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Camp</span>
        </button>
      </div>

      {/* Camps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campsList.map((camp) => {
          const progressPercent = Math.min(100, Math.round((camp.collectedUnits / camp.targetUnits) * 100));
          return (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-surface-container-high p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Tent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface font-manrope line-clamp-1">
                        {camp.title}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-outline" />
                        <span>{camp.city}, Sindh</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      camp.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : camp.status === 'ongoing'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container space-y-2 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-outline shrink-0" />
                    <span className="line-clamp-1">{camp.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-outline shrink-0" />
                    <span>{camp.startDate} to {camp.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-outline shrink-0" />
                    <span>{camp.coordinatorName} ({camp.coordinatorPhone})</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-surface-container">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-outline" /> Target Collection:
                    </span>
                    <strong className="text-on-surface font-mono">
                      {camp.collectedUnits} / {camp.targetUnits} Units
                    </strong>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        progressPercent >= 100
                          ? 'bg-emerald-600'
                          : progressPercent > 50
                          ? 'bg-primary'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.max(5, progressPercent)}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-[10px] text-on-surface-variant mt-1 font-semibold">
                    {progressPercent}% Achieved
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Camp Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-bold text-base text-on-surface font-manrope">
                Schedule Community Blood Drive
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCamp} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Camp Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sukkur IBA Student Blood Drive"
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Venue & Location *
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Auditorium Hall, Airport Road"
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Target Units
                  </label>
                  <input
                    type="number"
                    min="20"
                    value={targetUnits}
                    onChange={(e) => setTargetUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Coordinator Name
                  </label>
                  <input
                    type="text"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    placeholder="e.g. Dr. Tariq Mahar"
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Coordinator Phone
                  </label>
                  <input
                    type="text"
                    value={coordinatorPhone}
                    onChange={(e) => setCoordinatorPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
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
                  Confirm Camp Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
