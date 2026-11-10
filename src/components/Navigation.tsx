'use client';

import React from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import {
  LayoutDashboard,
  Droplets,
  Users,
  HeartHandshake,
  Ambulance,
  GitCompare,
  Tent,
  FileSpreadsheet,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'inventory'
  | 'donors'
  | 'record-donation'
  | 'dispatch'
  | 'compatibility'
  | 'camps'
  | 'staff-audit';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { requests } = useBloodBank();

  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Blood Inventory', icon: Droplets },
    { id: 'donors', label: 'Donors Directory', icon: Users },
    { id: 'record-donation', label: 'Record Donation', icon: HeartHandshake },
    { id: 'dispatch', label: 'Emergency Dispatch', icon: Ambulance, badge: pendingRequestsCount },
    { id: 'compatibility', label: 'Compatibility Matrix', icon: GitCompare },
    { id: 'camps', label: 'Donation Camps', icon: Tent },
    { id: 'staff-audit', label: 'Staff & Audit Logs', icon: FileSpreadsheet },
  ];

  return (
    <nav className="bg-white border-b border-surface-container-high shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-on-surface-variant'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-white text-primary'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
