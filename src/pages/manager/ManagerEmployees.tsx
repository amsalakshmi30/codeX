import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail } from 'lucide-react';
import { Card, CardContent, Button, PageHeader, Badge } from '@/components/ui';
import { employees } from '@/lib/data';
import { cn } from '@/lib/utils';

export function ManagerEmployees() {
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('all');

  const departments = ['all', ...Array.from(new Set(employees.map((e) => e.department)))];
  const filtered = employees.filter((e) => {
    const matchesDept = dept === 'all' || e.department === dept;
    const matchesQuery = e.name.toLowerCase().includes(query.toLowerCase()) || e.role.toLowerCase().includes(query.toLowerCase());
    return matchesDept && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Employee Management"
        subtitle="Manage your team, view availability, and track meeting load."
        actions={<Button variant="primary" size="md"><Plus className="h-4 w-4" /> Add Employee</Button>}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slatey" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or role..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-slatey focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium capitalize tracking-wide transition-colors',
                dept === d ? 'bg-brand text-white' : 'border border-slate-200 bg-white text-slatey hover:bg-slate-50',
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((e) => (
          <Card key={e.id} className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
              <div className="relative">
                <div className={cn('flex h-14 w-14 items-center justify-center rounded-full text-base font-semibold text-white', e.avatarColor)}>
                  {e.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className={cn(
                  'absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white',
                  e.status === 'active' && 'bg-emerald-500',
                  e.status === 'away' && 'bg-amber-500',
                  e.status === 'offline' && 'bg-slate-300',
                )} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{e.name}</p>
                <p className="text-xs text-slatey">{e.role}</p>
              </div>
              <Badge tone="neutral">{e.department}</Badge>
              <div className="flex w-full items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="text-slatey">{e.meetingsThisWeek} meetings/wk</span>
                <a href={`mailto:${e.email}`} className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slatey hover:bg-brand-soft hover:text-brand">
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
