import {
  Calendar,
  Clock,
  DoorOpen,
  CheckCircle2,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download,
  MoreHorizontal,
  CalendarPlus,
  ListChecks,
  BarChart3,
  History,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button, PageHeader, Badge } from '@/components/ui';
import { meetings, rooms, employees, tasks, recentActivity } from '@/lib/data';
import { cn } from '@/lib/utils';

const metrics = [
  { label: 'Total Meetings', value: '1,248', change: '+8.2%', trend: 'up', icon: Calendar, tone: 'text-emerald-600' },
  { label: "Today's Meetings", value: '6', change: '+2', trend: 'up', icon: Clock, tone: 'text-emerald-600' },
  { label: 'Active Employees', value: '32', change: '+4', trend: 'up', icon: Users, tone: 'text-emerald-600' },
  { label: 'Rooms Available', value: '4/6', change: '-1', trend: 'down', icon: DoorOpen, tone: 'text-rose-600' },
];

const weeklyData = [
  { day: 'Mon', value: 62 },
  { day: 'Tue', value: 85 },
  { day: 'Wed', value: 72 },
  { day: 'Thu', value: 94 },
  { day: 'Fri', value: 68 },
  { day: 'Sat', value: 24 },
  { day: 'Sun', value: 12 },
];

const deptData = [
  { name: 'Engineering', value: 92, color: 'bg-brand' },
  { name: 'Product', value: 78, color: 'bg-emerald-500' },
  { name: 'Design', value: 65, color: 'bg-amber-500' },
  { name: 'Marketing', value: 54, color: 'bg-rose-500' },
  { name: 'Sales', value: 88, color: 'bg-violet-500' },
];

const quickActions = [
  { label: 'Schedule Meeting', desc: 'Book a new meeting', icon: CalendarPlus, path: '/manager/schedule', tone: 'bg-brand-soft text-brand' },
  { label: 'View Meetings', desc: 'All upcoming & past', icon: ListChecks, path: '/manager/meetings', tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Analytics', desc: 'Productivity insights', icon: BarChart3, path: '/manager/analytics', tone: 'bg-violet-50 text-violet-600' },
  { label: 'Manage Rooms', desc: 'Room availability', icon: DoorOpen, path: '/manager/rooms', tone: 'bg-amber-50 text-amber-600' },
];

export function ManagerDashboard() {
  const todayMeetings = meetings.filter((m) => m.date === 'Aug 21' && m.status === 'upcoming');
  const availableRooms = rooms.filter((r) => r.status === 'available');
  const activeEmployees = employees.filter((e) => e.status === 'active');
  const recentTasks = tasks.filter((t) => t.status !== 'done').slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your organization's meeting productivity and workspace utilization."
        actions={
          <>
            <Button variant="outline" size="md">Last 30 Days</Button>
            <Button variant="outline" size="md">
              <Download className="h-4 w-4" /> Export
            </Button>
          </>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <m.icon className="h-5 w-5" />
                </div>
                <span className={cn('flex items-center gap-0.5 text-xs font-medium', m.tone)}>
                  {m.trend === 'up' && <ArrowUpRight className="h-3.5 w-3.5" />}
                  {m.trend === 'down' && <ArrowDownRight className="h-3.5 w-3.5" />}
                  {m.change}
                </span>
              </div>
              <p className="font-heading text-3xl font-bold text-ink">{m.value}</p>
              <p className="text-xs text-slatey">{m.label}</p>
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

      {/* AI Insight */}
      <div className="flex items-start gap-4 rounded-xl border border-[#b4c5ff] bg-[#dbe1ff] p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading text-base font-semibold text-[#00174b]">AI Insight: Optimization Detected</p>
          <p className="mt-1 text-sm text-[#003ea8]">
            Scheduling efficiency increased by 15% this month. MeetSmart AI automatically resolved 45 calendar
            conflicts and suggested shorter meeting durations, saving an estimated 120 organizational hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly meetings chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Meetings</CardTitle>
            <Button variant="ghost" size="icon" aria-label="Options">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end justify-between gap-3">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand/70 to-brand transition-all hover:from-brand hover:to-brand-dark"
                      style={{ height: `${d.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-slatey">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Dept Productivity</CardTitle>
            <Button variant="ghost" size="icon" aria-label="Options">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {deptData.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">{d.name}</span>
                    <span className="text-slatey">{d.value}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={cn('h-full rounded-full', d.color)} style={{ width: `${d.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Meetings</CardTitle>
            <Badge tone="blue">{todayMeetings.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {todayMeetings.map((m) => (
                <div key={m.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50">
                  <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-brand-soft py-2 text-brand">
                    <span className="text-[10px] font-medium leading-3">{m.time.split(' ')[0]}</span>
                    <span className="font-heading text-sm font-bold">{m.time.split(' ')[1]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{m.title}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slatey">
                      <Clock className="h-3 w-3" /> {m.duration} · {m.room}
                    </p>
                  </div>
                  <Badge tone={m.priority === 'high' ? 'red' : m.priority === 'medium' ? 'amber' : 'neutral'}>
                    {m.priority}
                  </Badge>
                </div>
              ))}
              {todayMeetings.length === 0 && (
                <p className="py-6 text-center text-sm text-slatey">No meetings scheduled for today.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <History className="h-5 w-5 text-slatey" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                    {a.user.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">
                      <span className="font-medium">{a.user}</span>{' '}
                      <span className="text-slatey">{a.action}</span>{' '}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-xs text-slatey">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Team availability */}
        <Card>
          <CardHeader>
            <CardTitle>Team Availability</CardTitle>
            <Badge tone="green">{activeEmployees.length} active</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {employees.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white', e.avatarColor)}>
                    {e.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{e.name}</p>
                    <p className="truncate text-xs text-slatey">{e.role}</p>
                  </div>
                  <span className={cn(
                    'h-2 w-2 rounded-full',
                    e.status === 'active' && 'bg-emerald-500',
                    e.status === 'away' && 'bg-amber-500',
                    e.status === 'offline' && 'bg-slate-300',
                  )} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <Badge tone="blue">{recentTasks.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2.5">
              {recentTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 text-sm">
                  <span className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    t.priority === 'high' ? 'bg-rose-500' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-300',
                  )} />
                  <span className="flex-1 truncate text-ink">{t.title}</span>
                  <span className="text-xs text-slatey">{t.dueDate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
