'use client';

import React from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { BloodGroup } from '../types';
import { NavTab } from './Navigation';
import {
  Droplets,
  AlertTriangle,
  Ambulance,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  Activity,
  HeartHandshake,
  GitCompare,
  Building2,
  Calendar,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: NavTab, filter?: string) => void;
  onOpenNewRequest: () => void;
  onOpenNewDonor: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewRequest,
  onOpenNewDonor,
}) => {
  const { units, requests, donors, camps, auditLogs, getBloodGroupCount } = useBloodBank();

  const availableUnits = units.filter((u) => u.status === 'available');
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const criticalRequests = requests.filter(
    (r) => r.status === 'pending' && (r.urgency === 'critical' || r.urgency === 'urgent')
  );

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  // Calculate stock thresholds
  const getStockStatus = (count: number, bg: BloodGroup) => {
    // Rare groups have lower thresholds
    const isRare = bg === 'O-' || bg === 'AB-' || bg === 'A-' || bg === 'B-';
    const criticalThreshold = isRare ? 1 : 2;
    const lowThreshold = isRare ? 2 : 3;

    if (count <= criticalThreshold) {
      return { label: 'Critical', color: 'text-red-700 bg-red-100 border-red-300' };
    }
    if (count <= lowThreshold) {
      return { label: 'Low', color: 'text-amber-800 bg-amber-100 border-amber-300' };
    }
    return { label: 'Adequate', color: 'text-emerald-800 bg-emerald-100 border-emerald-300' };
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Regional Header */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-[#501318] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Sindh Health Clinical Division • Sukkur Central Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-manrope tracking-tight text-white">
              Sistech Blood Bank Management
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Serving Civil Hospital Sukkur, SIUT Chhablani, GMMMC Hospital, and surrounding trauma centers across upper Sindh with clinical cold-chain inventory management and 24/7 emergency dispatch.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('record-donation')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary font-bold text-xs sm:text-sm shadow-sm hover:bg-surface transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-primary" />
              <span>Record Donation</span>
            </button>
            <button
              onClick={onOpenNewRequest}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-white border border-white/20 font-semibold text-xs sm:text-sm hover:bg-white/10 transition-all"
            >
              <Ambulance className="w-4 h-4 text-red-200" />
              <span>New Hospital Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Available Units */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-white p-5 rounded-xl border border-surface-container-high shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Total Active Units
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-on-surface font-tabular-nums">
              {availableUnits.length}
            </span>
            <span className="text-xs text-on-surface-variant">units in storage</span>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-primary font-medium">
            <span>View full inventory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Critical Dispatches */}
        <div
          onClick={() => onNavigate('dispatch')}
          className="bg-white p-5 rounded-xl border border-surface-container-high shadow-2xs hover:shadow-xs hover:border-red-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Pending Dispatches
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Ambulance className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-on-surface font-tabular-nums">
              {pendingRequests.length}
            </span>
            {criticalRequests.length > 0 && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                {criticalRequests.length} STAT / Critical
              </span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-amber-800 font-medium">
            <span>Review requests</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Registered Voluntary Donors */}
        <div
          onClick={() => onNavigate('donors')}
          className="bg-white p-5 rounded-xl border border-surface-container-high shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Registered Donors
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-on-surface font-tabular-nums">
              {donors.length}
            </span>
            <span className="text-xs text-on-surface-variant">
              ({donors.filter((d) => d.eligibilityStatus === 'eligible').length} eligible now)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Manage donor directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Community Donation Camps */}
        <div
          onClick={() => onNavigate('camps')}
          className="bg-white p-5 rounded-xl border border-surface-container-high shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Mobile Blood Camps
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-on-surface font-tabular-nums">
              {camps.filter((c) => c.status !== 'completed').length}
            </span>
            <span className="text-xs text-on-surface-variant">scheduled in Sindh</span>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-blue-700 font-medium">
            <span>Camp schedule & progress</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Live Blood Group Stock Levels Grid */}
      <div className="bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-bold font-manrope text-on-surface">
              Live Stock Levels by Blood Group
            </h3>
            <p className="text-xs text-on-surface-variant">
              Real-time available units in cold storage. Click any blood group to inspect individual bags.
            </p>
          </div>
          <button
            onClick={() => onNavigate('compatibility')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-container px-3 py-1.5 rounded-lg bg-surface border border-outline/20 hover:border-outline/40 transition-colors"
          >
            <GitCompare className="w-4 h-4 text-primary" />
            <span>Open Compatibility Matrix</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodGroups.map((bg) => {
            const count = getBloodGroupCount(bg);
            const status = getStockStatus(count, bg);
            return (
              <div
                key={bg}
                onClick={() => onNavigate('inventory', bg)}
                className="bg-surface p-3.5 rounded-xl border border-surface-container-high hover:border-primary/50 hover:bg-white hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black font-manrope text-primary">{bg}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-extrabold text-on-surface font-tabular-nums">
                    {count}
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-0.5">
                    {count === 1 ? '1 Unit' : `${count} Units`}
                  </div>
                </div>
                {/* Visual mini bar */}
                <div className="w-full bg-surface-container rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      count === 0 ? 'bg-zinc-300' : count <= 1 ? 'bg-red-600' : count <= 2 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, count * 25))}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Urgent Hospital Requests & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Urgent Hospital Dispatch Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold font-manrope text-on-surface">
                Urgent Hospital Dispatch Queue
              </h3>
            </div>
            <button
              onClick={() => onNavigate('dispatch')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all ({requests.length})
            </button>
          </div>

          {requests.slice(0, 3).map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-surface-container mb-3 last:mb-0 hover:border-outline/30 transition-all bg-surface/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-red-100 text-primary font-bold flex items-center justify-center text-sm font-manrope">
                    {req.bloodGroup}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{req.hospitalName}</h4>
                    <p className="text-xs text-on-surface-variant">
                      Patient: <span className="font-medium text-on-surface">{req.patientName}</span> ({req.patientAge}y) • {req.diagnosis}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      req.urgency === 'critical'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : req.urgency === 'urgent'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {req.urgency}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
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
              </div>

              <div className="mt-3 pt-3 border-t border-surface-container-high flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
                <div>
                  Requested: <strong className="text-on-surface">{req.unitsRequested} Unit(s)</strong> of {req.component}
                </div>
                <div className="flex items-center gap-3">
                  <span>Req #{req.requestNumber}</span>
                  <button
                    onClick={() => onNavigate('dispatch')}
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Manage Dispatch &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (1/3): Audit Logs & Regional Activity */}
        <div className="bg-white rounded-2xl border border-surface-container-high p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold font-manrope text-on-surface">
                  Live Audit Trail
                </h3>
              </div>
              <button
                onClick={() => onNavigate('staff-audit')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Full Log
              </button>
            </div>

            <div className="space-y-3.5">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs space-y-1 pb-3 border-b border-surface-container last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-semibold text-on-surface">{log.action}</span>
                    <span className="text-[10px]">{log.timestamp.slice(11, 19)}</span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed line-clamp-2">
                    {log.details}
                  </p>
                  <div className="text-[10px] text-outline font-medium">
                    By: {log.performedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick link to staff roster */}
          <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">On-Duty Clinical Staff: <strong>Dr. Tariq Mahar</strong></span>
            <button
              onClick={() => onNavigate('staff-audit')}
              className="text-primary font-semibold hover:underline"
            >
              Roster &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
