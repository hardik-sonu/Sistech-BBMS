'use client';

import React from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import { Droplet, RotateCcw, PhoneCall, ShieldAlert, Heart, Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { resetDemoData, requests, units } = useBloodBank();

  const pendingCritical = requests.filter(
    (r) => r.status === 'pending' && (r.urgency === 'critical' || r.urgency === 'urgent')
  ).length;

  const totalAvailable = units.filter((u) => u.status === 'available').length;

  return (
    <header className="bg-white border-b border-surface-container-high sticky top-0 z-40 shadow-xs">
      {/* Top Emergency Ticker */}
      {pendingCritical > 0 && (
        <div className="bg-primary text-on-primary px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-300"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase text-[11px] bg-red-900/60 px-2 py-0.5 rounded">
              High Priority Alert
            </span>
            <span>
              {pendingCritical} urgent hospital dispatch request{pendingCritical > 1 ? 's' : ''} awaiting action.
            </span>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm ring-4 ring-primary/10">
            <Droplet className="w-6 h-6 fill-current text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-manrope text-on-surface tracking-tight leading-none">
                Sistech BBMS
              </h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline/20">
                Sukkur Hub
              </span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span>Blood Bank & Transfusion Division</span>
              <span className="inline-block w-1 h-1 rounded-full bg-outline/40"></span>
              <span>Clinical Pathology Wing, Sindh</span>
            </p>
          </div>
        </div>

        {/* Right action metrics & controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Live stock quick pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-surface-container-high text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-on-surface-variant font-medium">Bank Reserves:</span>
            <span className="font-bold text-on-surface">{totalAvailable} Units Active</span>
          </div>

          {/* Emergency helpline */}
          <a
            href="tel:+92715800000"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-primary border border-red-200 hover:bg-red-100 transition-colors"
            title="Sistech Sukkur Emergency Blood Desk"
          >
            <PhoneCall className="w-3.5 h-3.5 text-primary" />
            <span className="hidden lg:inline">Emergency Desk:</span>
            <span>071-5800000</span>
          </a>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset all demo data back to default Sistech sample records?')) {
                resetDemoData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant bg-surface hover:bg-surface-container border border-outline/20 hover:border-outline/40 transition-colors"
            title="Restore original demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
