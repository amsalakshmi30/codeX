import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, DoorOpen, Users, ArrowRight, Calendar } from 'lucide-react';
import { Card, CardContent, Button, PageHeader, Badge } from '@/components/ui';
import { meetings } from '@/lib/data';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'upcoming' | 'completed';

export function EmployeeMyMeetings() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const myMeetings = meetings.filter((m) => m.attendees.includes('Sarah Chen'));
  const filtered = myMeetings.filter((m) => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Meetings" subtitle="Meetings you're invited to, past and upcoming." />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slatey" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-slatey focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'upcoming', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium capitalize tracking-wide transition-colors',
                filter === f ? 'bg-brand text-white' : 'border border-slate-200 bg-white text-slatey hover:bg-slate-50',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => (
          <Card key={m.id} className="group transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <span className="text-[10px] font-medium leading-3">{m.date.split(' ')[0]}</span>
                    <span className="font-heading text-base font-bold leading-5">{m.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-5 text-ink">{m.title}</h3>
                    <p className="mt-0.5 text-xs text-slatey">by {m.organizer}</p>
                  </div>
                </div>
                <Badge tone={m.status === 'upcoming' ? 'blue' : 'green'}>{m.status}</Badge>
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-slatey">
                <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {m.time} · {m.duration}</span>
                <span className="flex items-center gap-2"><DoorOpen className="h-3.5 w-3.5" /> {m.room}</span>
                <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {m.attendees.length} attendees</span>
              </div>

              <Link
                to={`/employee/meetings/${m.id}`}
                className="flex items-center justify-end gap-1 border-t border-slate-100 pt-3 text-xs font-semibold text-brand transition-transform group-hover:translate-x-0.5"
              >
                View details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm text-slatey">No meetings match your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
