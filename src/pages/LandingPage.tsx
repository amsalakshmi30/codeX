import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  Grid3X3,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Activity,
  CheckCircle2,
  Droplets,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: ScanLine,
    title: 'Single Leaf AI Scanner',
    desc: 'Instant disease identification from webcam or photo uploads with affected leaf area percentage.'
  },
  {
    icon: Grid3X3,
    title: 'Three-Zone Box Hardware Support',
    desc: 'Simultaneously segment and diagnose three crop leaves in an inspection tray with calibrated box presets.'
  },
  {
    icon: ShieldCheck,
    title: 'Agronomic Remedies & Sprays',
    desc: 'Evidence-based pesticide, fungicide, and organic bio-control recommendations for immediate field treatment.'
  },
  {
    icon: Cpu,
    title: 'Custom CNN Architecture',
    desc: 'Built from scratch in TensorFlow/Keras with 111,000 parameters — no bloated pretrained dependencies.'
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold text-slate-900">AgriSmart AI</span>
              <span className="hidden sm:inline-block ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                CNN Powered
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/scanner/single"
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Test Scanner
            </Link>
            <Link
              to="/dashboard"
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-white to-white pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
              <Zap className="h-3.5 w-3.5 text-emerald-600" /> Real-time Crop Disease Diagnosis & Severity Monitoring
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-tight">
              Precision Plant Health <br />
              <span className="text-emerald-600">Powered by CNN Deep Learning</span>
            </h1>

            <p className="mt-6 text-base text-slate-600 leading-relaxed sm:text-lg">
              Automated plant pathogen detection for 6 major Indian crops (Okra, Tomato, Potato, Bell Pepper, Grape, Corn).
              Includes single-leaf live camera analysis, 3-zone box field hardware integration, and color-based severity estimation.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/scanner/single"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
              >
                Launch Leaf Scanner <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                Explore Farm Dashboard
              </Link>
            </div>

            {/* Quick Stats Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 13 Diagnostic Classes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> ~111K CNN Parameters
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 3-Zone Hardware Box Calibrated
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Free Cloud Run & Render Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-slate-100 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Complete Agricultural Diagnostic Suite
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Engineered for seamless deployment both on local farmer hardware and high-availability cloud servers.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 mb-4">
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold sm:text-4xl">Ready to deploy your crop monitoring system?</h2>
          <p className="mt-3 text-sm text-emerald-100 max-w-lg mx-auto">
            Connect directly to the FastAPI cloud backend on Render or Cloud Run with zero configuration hurdles.
          </p>
          <div className="mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-emerald-950 shadow-lg hover:bg-emerald-50 transition"
            >
              Open Live Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
