import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ScanLine,
  Grid3X3,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { supportedCrops, initialScanHistory } from '@/lib/data';

export function AgriDashboard() {
  const totalScans = 1482;
  const healthyPercentage = 81.6;
  const activeAlerts = 5;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" /> AI Farm Intelligence System
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Crop Health & Disease Monitor
          </h1>
          <p className="text-sm text-slate-500">
            Real-time Convolutional Neural Network (CNN) diagnostic dashboard for Indian agricultural crops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/scanner/single"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <ScanLine className="h-4 w-4" /> Quick Leaf Scan
          </Link>
          <Link
            to="/scanner/three-zone"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Grid3X3 className="h-4 w-4" /> 3-Zone Tray Scan
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total AI Scans</span>
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{totalScans}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> +14.2% scans this week
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Crop Health Index</span>
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{healthyPercentage}%</p>
          <p className="mt-2 text-xs text-slate-500">Optimal vegetative vigor</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Pathogen Alerts</span>
            <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-rose-600">{activeAlerts}</p>
          <p className="mt-2 text-xs text-rose-500 font-medium">Early Blight & Mosaic spread</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">CNN Model Spec</span>
            <div className="rounded-xl bg-purple-100 p-2.5 text-purple-700">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-slate-900">111K Params</p>
          <p className="mt-2 text-xs text-purple-600 font-medium">~120ms Lightweight CPU inference</p>
        </div>
      </div>

      {/* Action Launchers & Indian Crop Health Overview */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Indian Crop Overview (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Supported Indian Crops</h2>
              <p className="text-xs text-slate-500">Trained CNN classes and field status</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View Analytics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {supportedCrops.map((crop) => (
              <div
                key={crop.name}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{crop.name}</p>
                  {crop.tamilName && (
                    <p className="text-xs text-slate-500">{crop.tamilName}</p>
                  )}
                  <p className="mt-1 text-[11px] text-slate-400">
                    Diseases: <span className="text-slate-600">{crop.commonDiseases.join(', ')}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    crop.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' : (
                      crop.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    )
                  }`}>
                    {crop.riskLevel} Risk
                  </span>
                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {crop.healthyCount} scans
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Diagnostic Card (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/60 px-3 py-1 text-xs font-medium text-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" /> Edge & Cloud Ready
            </div>
            <h3 className="mt-4 text-xl font-bold">Diagnose Crop Leaf Instantly</h3>
            <p className="mt-2 text-xs leading-relaxed text-emerald-200">
              Our 6-layer custom Convolutional Neural Network achieves high diagnostic accuracy on real field photographs without requiring heavy GPU servers.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              to="/scanner/single"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-emerald-950 shadow-md hover:bg-emerald-50 transition"
            >
              <ScanLine className="h-4 w-4 text-emerald-700" /> Start Live Scanner
            </Link>
            <Link
              to="/scanner/three-zone"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 py-3 text-xs font-bold text-emerald-100 hover:bg-emerald-900/50 transition"
            >
              <Grid3X3 className="h-4 w-4" /> Three-Zone Tray Mode
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Diagnostic Scans Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Field Scans</h2>
            <p className="text-xs text-slate-500">Live feed from farm camera nodes and manual inspections</p>
          </div>
          <Link to="/history" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            Full History <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Crop</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3">Scan Mode</th>
                <th className="pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {initialScanHistory.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50/50">
                  <td className="py-3 font-semibold text-slate-900">
                    {scan.plant}
                    {scan.disease && (
                      <span className="block text-[11px] font-normal text-rose-600">
                        {scan.disease}
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      scan.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {scan.status === 'Healthy' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      {scan.status}
                    </span>
                  </td>
                  <td className="py-3 font-medium">
                    {scan.severity}
                  </td>
                  <td className="py-3 font-medium text-slate-900">
                    {scan.confidence}%
                  </td>
                  <td className="py-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {scan.scanMode === 'single' ? 'Single Leaf' : '3-Zone Box'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">
                    {scan.timestamp}
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
