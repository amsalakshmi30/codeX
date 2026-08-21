import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import type { NavItem } from '@/lib/types';

interface AppLayoutProps {
  navItems: NavItem[];
  roleLabel: string;
  basePath: string;
}

export function AppLayout({ navItems, roleLabel, basePath }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7f9fc]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 lg:block">
        <Sidebar items={navItems} roleLabel={roleLabel} basePath={basePath} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white shadow-xl">
            <Sidebar items={navItems} roleLabel={roleLabel} basePath={basePath} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
