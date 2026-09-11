import { NavLink, useNavigate } from 'react-router-dom';
import { Sprout, X, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationItems } from '@/lib/data';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-slate-50 py-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-lg font-bold leading-5 text-slate-900">AgriSmart AI</p>
            <p className="text-[11px] font-medium text-emerald-700">Crop Health Monitor</p>
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col px-4 pt-6" aria-label="Primary navigation">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
          Diagnostic Suite
        </div>
        <ul className="flex flex-col gap-1.5">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800',
                    isActive && 'border-l-4 border-emerald-600 bg-emerald-50/90 pl-3 text-emerald-900 font-bold',
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-[18px] w-[18px] shrink-0 text-emerald-600" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Status Card */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
            <Cpu className="h-4 w-4" /> CNN Model Status
          </div>
          <p className="mt-2 text-xs leading-relaxed text-emerald-100">
            13 Classes trained on Okra, Tomato, Potato, Bell Pepper, Grape, and Corn.
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-emerald-700/60 pt-2 text-[11px] text-emerald-300">
            <span>Accuracy: ~94.8%</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-100">
              Active <ShieldCheck className="h-3 w-3 text-emerald-400" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
