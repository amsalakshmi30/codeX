import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import type { NavItem } from '@/lib/types';

interface SidebarProps {
  items: NavItem[];
  roleLabel: string;
  basePath: string;
  onNavigate?: () => void;
}

export function Sidebar({ items, roleLabel, basePath, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 py-6">
      <div className="flex items-center justify-between px-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-lg font-bold leading-6 text-ink">MeetSmart AI</p>
            <p className="text-[11px] font-medium tracking-wide text-slatey">{roleLabel}</p>
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="rounded-lg p-1.5 text-slatey hover:bg-slate-200 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col px-4" aria-label="Primary navigation">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === basePath}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-normal text-slatey transition-colors hover:bg-brand-soft hover:text-brand',
                    isActive && 'border-l-4 border-brand bg-brand-soft pl-3 font-medium text-brand',
                  )
                }
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pt-4">
        <div className="rounded-xl bg-gradient-to-br from-brand to-brand-dark p-4 text-white">
          <p className="font-heading text-sm font-semibold">AI Tip</p>
          <p className="mt-1 text-xs leading-relaxed text-white/80">
            MeetSmart AI resolved 45 calendar conflicts this month, saving ~120 organizational hours.
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-200 px-4 pt-4">
        <div className="flex items-center gap-3 px-2 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-semibold text-white">
            {user?.name?.split(' ').map((n) => n[0]).join('') ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
            <p className="truncate text-xs text-slatey">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium text-slatey transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </div>
  );
}
