import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { initialScanHistory } from '@/lib/data';
import { ScanResult } from '@/lib/types';

export function ScanHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Healthy' | 'Diseased' | 'No Leaf'>('all');
  const [history] = useState<ScanResult[]>(initialScanHistory);

  const filtered = history.filter((item) => {
    const matchesSearch =
      (item.plant || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.disease || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Plant,Status,Disease,Severity,Confidence,AffectedPercent,Timestamp\n';
    const rows = filtered
      .map(
        (r) =>
          `"${r.id}","${r.plant || ''}","${r.status}","${r.disease || ''}","${r.severity}",${r.confidence},${r.affected_percent || 0},"${r.timestamp}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan_history_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
            <History className="h-3.5 w-3.5" /> Diagnostic Records
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Farm Inspection History
          </h1>
          <p className="text-sm text-slate-500">
            Complete audit trail of all single-leaf captures and 3-zone tray scans performed by the CNN model.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          <Download className="h-4 w-4" /> Export CSV Log
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop or disease..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Conditions</option>
            <option value="Healthy">Healthy Only</option>
            <option value="Diseased">Diseased Only</option>
            <option value="No Leaf">No Leaf</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Plant Variety</th>
                <th className="py-3 px-6">Diagnostic Result</th>
                <th className="py-3 px-6">Severity Level</th>
                <th className="py-3 px-6">Affected Area</th>
                <th className="py-3 px-6">Model Confidence</th>
                <th className="py-3 px-6">Mode</th>
                <th className="py-3 px-6">Scanned At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {item.plant || 'Unclassified Leaf'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      {item.status === 'Healthy' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" /> Healthy
                        </span>
                      )}
                      {item.status === 'Diseased' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                          <AlertTriangle className="h-3 w-3" /> {item.disease}
                        </span>
                      )}
                      {item.status === 'No Leaf' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                          <HelpCircle className="h-3 w-3" /> No Leaf
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    <span className={`font-bold ${
                      item.severity === 'High' ? 'text-rose-600' : (
                        item.severity === 'Medium' ? 'text-amber-600' : (
                          item.severity === 'None' ? 'text-emerald-600' : 'text-slate-600'
                        )
                      )
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-800">
                    {item.affected_percent !== null ? `${item.affected_percent}%` : 'N/A'}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {item.confidence}%
                  </td>
                  <td className="py-4 px-6">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {item.scanMode === 'single' ? 'Single Leaf' : '3-Zone Box'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {item.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
