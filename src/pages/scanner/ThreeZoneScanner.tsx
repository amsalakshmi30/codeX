import React, { useState, useRef } from 'react';
import {
  Grid3X3,
  UploadCloud,
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { predictThreeZones } from '@/lib/api';
import { ThreeZoneResult } from '@/lib/types';

export function ThreeZoneScanner() {
  const [selectedPreset, setSelectedPreset] = useState<'demo_trained' | 'physical_box'>('demo_trained');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ThreeZoneResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      runScan(file);
    }
  };

  const runScan = async (file: File) => {
    setIsScanning(true);
    try {
      const res = await predictThreeZones(file, selectedPreset, file.name);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDemoBox = async () => {
    setIsScanning(true);
    setPreviewUrl('https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80');
    const dummyBlob = new Blob([''], { type: 'image/jpeg' });
    const dummyFile = new File([dummyBlob], 'box_three_zones_demo.jpg', { type: 'image/jpeg' });
    try {
      const res = await predictThreeZones(dummyFile, selectedPreset, 'box_three_zones_demo.jpg');
      setResult(res);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            <Grid3X3 className="h-3.5 w-3.5" /> Hardware 3-Zone Detection
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Three-Zone Box Analyzer
          </h1>
          <p className="text-sm text-slate-500">
            Capture ONE photograph containing all 3 physical zones of your inspection box to segment and evaluate crops simultaneously.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Box Preset:</label>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value as any)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="demo_trained">Demo Trained (Okra / Tomato / Grape)</option>
            <option value="physical_box">Physical Box (Okra / Green Gram / Flat Beans)</option>
          </select>
        </div>
      </div>

      {/* Upload Banner / Demo Trigger */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-base font-bold text-slate-900">Upload 3-Zone Box Image</h2>
            <p className="text-xs text-slate-500 mt-1">
              The algorithm horizontally crops the image into 3 equal columns: Zone 1 (Left 0–33%), Zone 2 (Center 33–66%), and Zone 3 (Right 66–100%).
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDemoBox}
              disabled={isScanning}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition"
            >
              <Sparkles className="h-4 w-4" /> Load Sample 3-Zone Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <UploadCloud className="h-4 w-4" /> Upload Box Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Scanning Loader */}
      {isScanning && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
          <p className="text-base font-bold text-slate-800">Segmenting 3 Inspection Zones...</p>
          <p className="text-xs text-slate-400 mt-1">Extracting color features & running multi-class CNN inference</p>
        </div>
      )}

      {/* Results View */}
      {result && !isScanning && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-blue-700 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Box Inspection Verdict
                </p>
                <p className="text-sm font-semibold text-blue-950 mt-0.5">
                  {result.summary}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Zones Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {result.zones.map((zone, idx) => {
              const isDiseased = zone.status === 'Diseased';
              const isHealthy = zone.status === 'Healthy';
              const isNoLeaf = zone.status === 'No Leaf';

              return (
                <div
                  key={zone.zone}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                    isDiseased ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-200'
                  }`}
                >
                  {/* Zone Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Zone {idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {zone.expected_plant}
                      </h3>
                    </div>

                    {isHealthy && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Healthy
                      </span>
                    )}
                    {isDiseased && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                        <AlertTriangle className="h-3.5 w-3.5" /> Diseased
                      </span>
                    )}
                    {isNoLeaf && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                        <HelpCircle className="h-3.5 w-3.5" /> Empty / No Leaf
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="mt-4 space-y-3">
                    {zone.disease && (
                      <div>
                        <span className="text-[11px] text-slate-400">Diagnosis:</span>
                        <p className="text-sm font-bold text-rose-600">{zone.disease}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">Severity Level:</span>
                      <span className={`font-bold ${
                        zone.severity === 'High' ? 'text-rose-600' : (zone.severity === 'Medium' ? 'text-amber-600' : 'text-slate-700')
                      }`}>
                        {zone.severity}
                      </span>
                    </div>

                    {zone.affected_percent !== undefined && zone.affected_percent !== null && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Affected Area:</span>
                        <span className="font-semibold text-slate-800">{zone.affected_percent}%</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Confidence:</span>
                      <span className="font-semibold text-slate-800">{zone.confidence}%</span>
                    </div>

                    {zone.recommendations && zone.recommendations.length > 0 && (
                      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
                        <p className="font-bold text-slate-700 mb-1">Recommended Action:</p>
                        <p>{zone.recommendations[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isScanning && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 shadow-sm">
          <Layers className="h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No Box Scan Loaded</p>
          <p className="max-w-sm text-xs text-slate-400 mt-1">
            Click "Load Sample 3-Zone Photo" or upload your own 3-section physical tray photograph to see simultaneous crop evaluation.
          </p>
        </div>
      )}
    </div>
  );
}
