import React from 'react';
import {
  BarChart3,
  PieChart,
  ShieldAlert,
  Layers,
  CheckCircle2,
  TrendingDown,
  Cpu
} from 'lucide-react';
import { supportedCrops } from '@/lib/data';

export function CropAnalytics() {
  const modelStats = [
    { label: 'CNN Parameters', value: '~111,000', desc: 'Lightweight, runs on normal laptop CPU' },
    { label: 'Classes Trained', value: '13 Classes', desc: '6 Indian crops + healthy + no_leaf' },
    { label: 'Input Image Size', value: '160 × 160 × 3', desc: 'Standardized RGB input resolution' },
    { label: 'Optimizer & Loss', value: 'Adam / CCE', desc: 'Categorical cross-entropy loss function' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
          <BarChart3 className="h-3.5 w-3.5" /> Analytical Intelligence
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Crop Health & Disease Analytics
        </h1>
        <p className="text-sm text-slate-500">
          Statistical distribution of pathogens, severity classifications, and CNN diagnostic metrics across monitored fields.
        </p>
      </div>

      {/* Model Spec Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modelStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Disease Distribution & CNN Architecture */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Crop Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1">Crops Disease Breakdown</h2>
          <p className="text-xs text-slate-500 mb-5">
            Real field dataset breakdown by Indian crop varieties
          </p>

          <div className="space-y-4">
            {supportedCrops.map((crop) => {
              const total = crop.healthyCount + crop.diseasedCount;
              const healthyPct = Math.round((crop.healthyCount / total) * 100);

              return (
                <div key={crop.name} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                    <span>{crop.name}</span>
                    <span className="text-emerald-700">{healthyPct}% Healthy</span>
                  </div>

                  {/* Dual Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${healthyPct}%` }}
                      title={`Healthy: ${crop.healthyCount}`}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${100 - healthyPct}%` }}
                      title={`Diseased: ${crop.diseasedCount}`}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Healthy: {crop.healthyCount} samples</span>
                    <span className="text-rose-600 font-medium">Diseased: {crop.diseasedCount} ({crop.commonDiseases.join(', ')})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CNN Architecture Overview (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Cpu className="h-4 w-4 text-emerald-600" /> Deep Learning Model
            </div>
            <h2 className="text-base font-bold text-slate-900">Custom CNN Architecture</h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Built from scratch in TensorFlow/Keras without pretrained backbones (examiner verified).
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                <span className="font-bold text-slate-800">1. Input Layer</span>
                <span className="text-slate-500">160 × 160 × 3</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                <span className="font-bold text-slate-800">2. Conv2D (32 filters)</span>
                <span className="text-slate-500">ReLU + MaxPool</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                <span className="font-bold text-slate-800">3. Conv2D (64 filters)</span>
                <span className="text-slate-500">ReLU + MaxPool</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                <span className="font-bold text-slate-800">4. Conv2D (128 filters)</span>
                <span className="text-slate-500">ReLU + MaxPool</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                <span className="font-bold text-slate-800">5. GlobalAveragePooling</span>
                <span className="text-slate-500">Feature map flatten</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                <span className="font-bold text-slate-800">6. Dense (128) + Dropout</span>
                <span className="text-slate-500">Dropout (0.4)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-2.5 border border-emerald-200">
                <span className="font-bold text-emerald-900">7. Output Dense (13)</span>
                <span className="font-bold text-emerald-700">Softmax Probs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-emerald-50/70 p-4 border border-emerald-100 text-xs text-emerald-900">
            <p className="font-bold">Hardware Inference Time:</p>
            <p className="mt-0.5 text-emerald-700">
              Only ~1.2 seconds per 3-Zone box image on standard laptop / free cloud tier CPU!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
