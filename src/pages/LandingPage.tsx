import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Calendar, BarChart3, Users, DoorOpen, CheckCircle2 } from 'lucide-react';

const features = [
  { icon: Calendar, title: 'Smart Scheduling', desc: 'AI-powered meeting time optimization across your entire team.' },
  { icon: DoorOpen, title: 'Room Management', desc: 'Real-time room availability with conflict detection.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track meeting productivity and workspace utilization.' },
  { icon: Users, title: 'Team Coordination', desc: 'Keep everyone aligned with shared calendars and tasks.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-heading text-xl font-bold text-ink">MeetSmart AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/role-select" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
              Login
            </Link>
            <button className="hidden rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-slate-50 sm:block">
              Request Demo
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-soft/40 via-white to-white" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft/50 px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Meeting Intelligence
            </div>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Meet smarter.<br />Not longer.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slatey sm:text-lg">
              MeetSmart AI eliminates scheduling conflicts, optimizes room usage, and helps your team reclaim
              wasted meeting hours — all in one enterprise-ready workspace.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/role-select"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-slate-50">
                Request Demo
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slatey">
              {['No credit card required', 'Setup in 5 minutes', 'Enterprise-ready'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-brand/10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="font-heading text-sm font-bold text-ink">Today's Overview</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Live</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Meetings', value: '1,248', icon: Calendar, tone: 'bg-brand-soft text-brand' },
                  { label: 'Rooms Available', value: '4/6', icon: DoorOpen, tone: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Active Employees', value: '32', icon: Users, tone: 'bg-amber-50 text-amber-600' },
                  { label: 'Conflicts Resolved', value: '45', icon: BarChart3, tone: 'bg-violet-50 text-violet-600' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-100 p-4">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.tone}`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 font-heading text-2xl font-bold text-ink">{s.value}</p>
                    <p className="text-xs text-slatey">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-brand-soft/50 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <span className="text-xs font-semibold text-brand">AI Insight</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#003ea8]">
                  Scheduling efficiency up 15% this month. 45 conflicts auto-resolved, saving ~120 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Everything your team needs to meet better
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slatey">
            From scheduling to analytics, MeetSmart AI handles the full meeting lifecycle.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slatey">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-12 text-center text-white">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Ready to meet smarter?</h2>
          <p className="max-w-xl text-base text-white/80">
            Join teams using MeetSmart AI to save hours every week with intelligent meeting scheduling.
          </p>
          <Link
            to="/role-select"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand transition-all hover:-translate-y-0.5"
          >
            Get Started Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" />
            <span className="font-heading text-sm font-bold text-ink">MeetSmart AI</span>
          </div>
          <p className="text-xs text-slatey">© 2026 MeetSmart AI. Enterprise meeting intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
