import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, PageHeader, Badge, Button } from '@/components/ui';
import { meetings } from '@/lib/data';
import { cn } from '@/lib/utils';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDateNumber(dateStr: string) {
  return parseInt(dateStr.split(' ')[1], 10);
}

const eventColors: Record<string, string> = {
  high: 'bg-rose-100 text-rose-700 border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-brand-soft text-brand border-brand/20',
};

export function EmployeeCalendar() {
  const [view, setView] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 21));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const myMeetings = meetings.filter((m) => m.attendees.includes('Sarah Chen') || m.attendees.includes('Marcus Reed'));

  // Week view: compute the week containing the current date
  const currentDay = currentDate.getDate();
  const weekStart = new Date(year, month, currentDay - new Date(year, month, currentDay).getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const weekDayNumbers = weekDays.map((d) => d.getDate());

  const prevPeriod = () => {
    if (view === 'month') setCurrentDate(new Date(year, month - 1, 1));
    else setCurrentDate(new Date(year, month, currentDay - 7));
  };
  const nextPeriod = () => {
    if (view === 'month') setCurrentDate(new Date(year, month + 1, 1));
    else setCurrentDate(new Date(year, month, currentDay + 7));
  };
  const today = 21;

  const periodLabel = view === 'month'
    ? `${monthNames[month]} ${year}`
    : `${monthNames[weekDays[0].getMonth()]} ${weekDays[0].getDate()} – ${monthNames[weekDays[6].getMonth()]} ${weekDays[6].getDate()}, ${year}`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calendar"
        subtitle="Your meeting schedule at a glance."
        actions={
          <div className="flex items-center gap-2">
            <Button variant={view === 'month' ? 'primary' : 'outline'} size="sm" onClick={() => setView('month')}>Month</Button>
            <Button variant={view === 'week' ? 'primary' : 'outline'} size="sm" onClick={() => setView('week')}>Week</Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-ink">{periodLabel}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevPeriod} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slatey hover:bg-slate-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={nextPeriod} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slatey hover:bg-slate-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {view === 'month' ? (
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {dayNames.map((d) => (
                <div key={d} className="pb-2 text-center text-[11px] font-semibold tracking-wide text-slatey sm:text-xs">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="border-transparent" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dayMeetings = myMeetings.filter((m) => getDateNumber(m.date) === day);
                const isToday = day === today;
                return (
                  <div
                    key={day}
                    className={cn(
                      'min-h-[60px] rounded-lg border p-1 sm:min-h-[90px] sm:p-2',
                      'border-slate-100 bg-white',
                      isToday && 'border-brand bg-brand-soft/30',
                    )}
                  >
                    <span className={cn('text-[11px] font-medium sm:text-xs', isToday ? 'font-bold text-brand' : 'text-slatey')}>
                      {day}
                    </span>
                    <div className="mt-1 flex flex-col gap-0.5">
                      {dayMeetings.slice(0, 2).map((m) => (
                        <div
                          key={m.id}
                          className={cn('truncate rounded border px-1 py-0.5 text-[9px] font-medium sm:text-[10px]', eventColors[m.priority])}
                        >
                          <span className="hidden sm:inline">{m.time} </span>
                          {m.title}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <span className="text-[9px] text-slatey">+{dayMeetings.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {weekDays.map((d, i) => {
                const dayNum = d.getDate();
                const dayMeetings = myMeetings.filter((m) => getDateNumber(m.date) === dayNum && m.date.split(' ')[0] === monthNames[d.getMonth()].slice(0, 3));
                const isToday = dayNum === today;
                return (
                  <div key={i} className="flex flex-col">
                    <div className={cn('mb-2 rounded-lg py-2 text-center', isToday ? 'bg-brand text-white' : 'bg-slate-50 text-slatey')}>
                      <p className="text-[11px] font-medium sm:text-xs">{dayNames[d.getDay()]}</p>
                      <p className={cn('font-heading text-lg font-bold', isToday ? 'text-white' : 'text-ink')}>{dayNum}</p>
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      {dayMeetings.length > 0 ? dayMeetings.map((m) => (
                        <div
                          key={m.id}
                          className={cn('rounded-lg border p-2 text-[10px] font-medium sm:text-xs', eventColors[m.priority])}
                        >
                          <p className="font-semibold">{m.time}</p>
                          <p className="mt-0.5 truncate">{m.title}</p>
                          <p className="mt-0.5 hidden text-[9px] opacity-70 sm:block">{m.room} · {m.duration}</p>
                        </div>
                      )) : (
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 p-2">
                          <span className="text-[10px] text-slatey/50">Free</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h3 className="font-heading text-base font-semibold text-ink">Today's Schedule</h3>
            <div className="mt-4 flex flex-col gap-3">
              {myMeetings.filter((m) => m.date === 'Aug 21' && m.status === 'upcoming').map((m) => (
                <div key={m.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3">
                  <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-brand-soft py-2 text-brand">
                    <span className="text-xs font-medium">{m.time.split(' ')[0]}</span>
                    <span className="font-heading text-sm font-bold">{m.time.split(' ')[1]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{m.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slatey">
                      <Clock className="h-3 w-3" /> {m.duration} · {m.room}
                    </p>
                  </div>
                  <Badge tone={m.priority === 'high' ? 'red' : 'amber'}>{m.priority}</Badge>
                </div>
              ))}
              {myMeetings.filter((m) => m.date === 'Aug 21' && m.status === 'upcoming').length === 0 && (
                <p className="py-6 text-center text-sm text-slatey">No meetings scheduled for today.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-heading text-base font-semibold text-ink">Color Legend</h3>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="h-4 w-4 rounded border border-rose-200 bg-rose-100" />
                <span className="text-sm text-slatey">High priority</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-4 w-4 rounded border border-amber-200 bg-amber-100" />
                <span className="text-sm text-slatey">Medium priority</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-4 w-4 rounded border border-brand/20 bg-brand-soft" />
                <span className="text-sm text-slatey">Low priority</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
