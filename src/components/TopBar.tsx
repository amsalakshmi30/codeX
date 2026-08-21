import { Bell, History, Search } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-6 border-b border-slate-200 bg-white px-4 sm:px-8">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slatey hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <form className="hidden w-full max-w-md sm:block" role="search">
          <label className="sr-only" htmlFor="search">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slatey" />
            <input
              id="search"
              type="search"
              placeholder="Search meetings, rooms, people..."
              className="h-10 w-full rounded-lg border-0 bg-[#f2f4f7] py-2.5 pl-10 pr-4 text-sm text-slatey placeholder:text-slatey focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </form>
      </div>

      <nav className="flex shrink-0 items-center gap-3" aria-label="Quick actions">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slatey hover:bg-slate-100"
          aria-label="Recent activity"
        >
          <History className="h-[18px] w-[18px]" />
        </button>
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slatey hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-semibold text-white">
            SC
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold leading-4 text-ink">Sarah Chen</p>
            <p className="text-[10px] leading-3 text-slatey">Product Manager</p>
          </div>
        </div>
      </nav>
    </header>
  );
}
