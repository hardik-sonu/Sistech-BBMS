'use client';

import React, { useState } from 'react';
import { BloodBankProvider } from '../lib/bloodBankStore';
import { Header } from '../components/Header';
import { Navigation, NavTab } from '../components/Navigation';
import { DashboardView } from '../components/DashboardView';
import { InventoryView } from '../components/InventoryView';
import { DonorsView } from '../components/DonorsView';
import { RecordDonationView } from '../components/RecordDonationView';
import { EmergencyDispatchView } from '../components/EmergencyDispatchView';
import { CompatibilityView } from '../components/CompatibilityView';
import { CampsView } from '../components/CampsView';
import { StaffAuditView } from '../components/StaffAuditView';
import { NewRequestModal } from '../components/NewRequestModal';
import { ToastContainer } from '../components/ToastContainer';
import { Droplet, Heart, ShieldCheck, Building2, Phone } from 'lucide-react';

function BloodBankApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [inventoryGroupFilter, setInventoryGroupFilter] = useState<string>('ALL');
  const [selectedDonorForDonation, setSelectedDonorForDonation] = useState<string | undefined>();
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleNavigateWithFilter = (tab: NavTab, filter?: string) => {
    if (tab === 'inventory' && filter) {
      setInventoryGroupFilter(filter);
    } else if (tab === 'inventory' && !filter) {
      setInventoryGroupFilter('ALL');
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-inter text-on-surface">
      {/* Header */}
      <Header />

      {/* Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigateWithFilter}
            onOpenNewRequest={() => setShowRequestModal(true)}
            onOpenNewDonor={() => setActiveTab('donors')}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView initialBloodGroupFilter={inventoryGroupFilter} />
        )}

        {activeTab === 'donors' && (
          <DonorsView
            onNavigate={setActiveTab}
            onSelectDonorForDonation={(donorId) => {
              setSelectedDonorForDonation(donorId);
              setActiveTab('record-donation');
            }}
          />
        )}

        {activeTab === 'record-donation' && (
          <RecordDonationView
            initialDonorId={selectedDonorForDonation}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'dispatch' && (
          <EmergencyDispatchView
            onOpenNewRequest={() => setShowRequestModal(true)}
          />
        )}

        {activeTab === 'compatibility' && <CompatibilityView />}

        {activeTab === 'camps' && <CampsView />}

        {activeTab === 'staff-audit' && <StaffAuditView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-surface-container-high py-8 mt-12 text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                <Droplet className="w-4 h-4 fill-current text-white" />
              </div>
              <div>
                <p className="font-bold text-on-surface font-manrope">
                  Sistech Blood Bank & Transfusion Division — Sukkur, Sindh
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Licensed under Sindh Blood Transfusion Authority (SBTA-SUK-2024-089) • 24/7 Clinical Emergency Logistics
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                SBTA Certified Laboratory
              </span>
              <span className="text-outline">|</span>
              <a
                href="tel:+92715800000"
                className="hover:text-primary font-medium flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                Emergency Hotline: 071-5800000
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between text-[11px] text-outline">
            <p>© 2026 Sistech Sukkur. Demonstration System with full interactive sample dataset.</p>
            <p className="mt-2 sm:mt-0">
              Interactive Prototype • Click &quot;Reset Demo&quot; in header to restore default data.
            </p>
          </div>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <NewRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
      <ToastContainer />
    </div>
  );
}

export default function Page() {
  return (
    <BloodBankProvider>
      <BloodBankApp />
    </BloodBankProvider>
  );
}
