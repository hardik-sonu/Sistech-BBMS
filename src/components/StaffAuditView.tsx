'use client';

import React, { useState } from 'react';
import { useBloodBank } from '../lib/bloodBankStore';
import {
  FileSpreadsheet,
  Users,
  Clock,
  Shield,
  Activity,
  Phone,
  Mail,
  Building,
  Filter,
} from 'lucide-react';

export const StaffAuditView: React.FC = () => {
  const { staff, auditLogs } = useBloodBank();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'staff'>('audit');

  const categories = ['ALL', 'Inventory', 'Dispatch', 'Donor', 'Camp'];

  const filteredLogs = auditLogs.filter((log) => {
    return categoryFilter === 'ALL' || log.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-manrope text-on-surface">
            Clinical Staff & Regulatory Audit Trail
          </h2>
          <p className="text-xs text-on-surface-variant">
            Sindh Blood Transfusion Authority (SBTA) compliance records, chain-of-custody tracking, and staff duty roster.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'audit'
                ? 'bg-white text-on-surface shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'staff'
                ? 'bg-white text-on-surface shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Staff Roster ({staff.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'audit' ? (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="bg-white p-3 rounded-2xl border border-surface-container-high shadow-2xs flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-semibold text-on-surface-variant mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-surface-container-high shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface text-on-surface-variant uppercase text-[10px] font-bold tracking-wider border-b border-surface-container">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Performed By</th>
                    <th className="px-5 py-3">Details / Audit Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-on-surface">
                        {log.timestamp}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-on-surface">
                        {log.action}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.category === 'Dispatch'
                              ? 'bg-red-100 text-red-700'
                              : log.category === 'Inventory'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.category === 'Donor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {log.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-on-surface-variant font-medium">
                        {log.performedBy}
                      </td>
                      <td className="px-5 py-3.5 text-on-surface-variant leading-relaxed">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Staff Roster Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-2xl border border-surface-container-high p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center text-sm font-manrope">
                    {st.name.slice(0, 2)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      st.status === 'On Duty'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {st.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-sm text-on-surface font-manrope">
                    {st.name}
                  </h3>
                  <p className="text-xs text-primary font-semibold">{st.role}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{st.department}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container space-y-2 text-xs text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span>Assigned Shift:</span>
                    <strong className="text-on-surface">{st.shift}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Phone className="w-3.5 h-3.5 text-outline shrink-0" />
                    <span>{st.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-outline shrink-0" />
                    <span className="truncate">{st.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
