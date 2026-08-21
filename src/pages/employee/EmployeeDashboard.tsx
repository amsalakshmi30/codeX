import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bell,
  CalendarPlus,
  ListChecks,
  CalendarDays,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, PageHeader, Badge } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { meetings, tasks, notifications } from '@/lib/data';
import { cn } from '@/lib/utils';

const quickActions = [
  { label: 'My Meetings', desc: 'View all meetings', icon: ListChecks, path: '/employee/meetings', tone: 'bg-brand-soft text-brand' },
  { label: 'Calendar', desc: 'See your schedule', icon: CalendarDays, path: '/employee/calendar', tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'My Tasks', desc: 'Track action items', icon: ClipboardList, path: '/employee/tasks', tone: 'bg-amber-50 text-amber-600' },
  { label: 'Profile', desc: 'Update your info', icon: User, path: '/employee/profile', tone: 'bg-violet-50 text-violet-600' },
];

export function EmployeeDashboard() {
  const { user } = useAuth();
  const userName = user?.name ?? 'Marcus';
  const myMeetings = meetings.filter((m) => m.attendees.includes('Sarah Chen') || m.attendees.includes('Marcus Reed'));
  const todayMeetings = myMeetings.filter((m) => m.date === 'Aug 21' && m.status === 'upcoming');
  const upcoming = myMeetings.filter((m) => m.status === 'upcoming').slice(0, 4);
  const myTasks = tasks.filter((t) => t.status !== 'done');
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const unreadNotifs = notifications.filter((n) => n.unread);

  const stats = [
    { label: "Today's Meetings", value: todayMeetings.length, icon: Calendar, tone: 'bg-brand-soft text-brand' },
    { label: 'Upcoming Meetings', value: upcoming.length, icon: Clock, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Tasks', value: myTasks.length, icon: ClipboardList, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Tasks Completed', value: completedTasks, icon: CheckCircle2, tone: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Welcome back, ${userName}`} subtitle="Here's what your day looks like." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', s.tone)}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-ink">{s.value}</p>
                <p className="text-xs text-slatey">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            to={a.path}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg"
          >
            <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', a.tone)}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{a.label}</p>
              <p className="text-xs text-slatey">{a.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slatey transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
          </Link>
        ))}
      </div>

      <div className="flex items-start gap-4 rounded-xl border border-[#b4c5ff] bg-[#dbe1ff] p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading text-base font-semibold text-[#00174b]">Your AI Briefing</p>
          <p className="mt-1 text-sm text-[#003ea8]">
            You have {upcoming.length} upcoming meetings. Your heaviest day is Thursday. Consider moving the
            Design System Sync to Friday afternoon to free up focus time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Upcoming Meetings</CardTitle>
            <Link to="/employee/meetings">
              <Button variant="soft" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {upcoming.map((m) => (
                <div key={m.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <span className="text-[10px] font-medium leading-3">{m.date.split(' ')[0]}</span>
                    <span className="font-heading text-base font-bold leading-5">{m.date.split(' ')[1]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{m.title}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slatey">
                      <Clock className="h-3 w-3" /> {m.time} · {m.duration} · {m.room}
                    </p>
                  </div>
                  <Link
                    to={`/employee/meetings/${m.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slatey hover:bg-brand-soft hover:text-brand"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <div className="flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-slatey" />
                <Badge tone="red">{unreadNotifs.length} new</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className={cn('rounded-xl border p-3', n.unread ? 'border-brand/20 bg-brand-soft/30' : 'border-slate-100')}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{n.title}</p>
                      {n.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />}
                    </div>
                    <p className="mt-0.5 text-xs text-slatey">{n.body}</p>
                    <p className="mt-1 text-[11px] text-slatey/70">{n.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <Link to="/employee/tasks">
                <Button variant="soft" size="sm">View all</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2.5">
                {myTasks.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 text-sm">
                    <span className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      t.priority === 'high' ? 'bg-rose-500' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-300',
                    )} />
                    <span className="flex-1 truncate text-ink">{t.title}</span>
                    <Badge tone={t.status === 'in-progress' ? 'blue' : 'neutral'}>{t.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
