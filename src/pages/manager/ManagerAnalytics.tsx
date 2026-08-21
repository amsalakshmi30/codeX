import { Users, Clock, DoorOpen, TrendingUp, Download, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, PageHeader } from '@/components/ui';
import { cn } from '@/lib/utils';

const metrics = [
  { label: 'Total Meetings', value: '1,248', change: '+8.2%', icon: Users, tone: 'text-emerald-600' },
  { label: 'Avg Duration', value: '42m', change: '-3.1%', icon: Clock, tone: 'text-rose-600' },
  { label: 'Rooms Utilized', value: '84%', change: '+12%', icon: DoorOpen, tone: 'text-emerald-600' },
  { label: 'Conflicts Resolved', value: '342', change: 'No change', icon: TrendingUp, tone: 'text-slatey' },
  { label: 'Tasks Completed', value: '8,912', change: '+24%', icon: TrendingUp, tone: 'text-emerald-600' },
];

const timeSlots = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'];

function usageColor(pct: number) {
  if (pct >= 81) return { bg: 'bg-rose-600/90', text: 'text-white' };
  if (pct >= 41) return { bg: 'bg-amber-500/70', text: 'text-white' };
  return { bg: 'bg-emerald-500/30', text: 'text-slatey' };
}

const heatData = [
  { room: 'Boardroom A', values: [95, 100, 60, 20, 70, 85, 30, 10] },
  { room: 'Huddle 1', values: [20, 50, 95, 80, 10, 40, 65, 30] },
  { room: 'Huddle 2', values: [40, 35, 20, 15, 55, 70, 90, 60] },
  { room: 'Innovation Lab', values: [10, 25, 45, 30, 85, 50, 20, 15] },
];

const legend = [
  { label: 'Low (0-40%)', color: 'bg-emerald-500/30' },
  { label: 'Medium (41-80%)', color: 'bg-amber-500/70' },
  { label: 'High (81-100%)', color: 'bg-rose-600/90' },
];

const trendData = [
  { week: 'W1', value: 45 },
  { week: 'W2', value: 62 },
  { week: 'W3', value: 55 },
  { week: 'W4', value: 78 },
  { week: 'W5', value: 88 },
  { week: 'W6', value: 72 },
];

export function ManagerAnalytics() {
  const [floor, setFloor] = useState('floor-1');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Comprehensive Analytics"
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

      {/* Metrics row - matches Figma 5-up */}
      <Card className="overflow-hidden">
        <CardContent className="grid grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((m, i) => (
            <article
              key={m.label}
              className={cn(
                'flex min-h-[150px] flex-col gap-2 p-6',
                i > 0 && 'border-t border-slate-200 sm:border-l sm:border-t-0',
              )}
            >
              <div className="flex items-center gap-2">
                <m.icon className="h-4 w-4 text-brand" />
                <p className="text-xs tracking-wide text-slatey">{m.label}</p>
              </div>
              <p className="font-heading text-4xl font-bold tracking-tight text-ink">{m.value}</p>
              <span className={cn('text-[11px] font-medium tracking-wide', m.tone)}>{m.change}</span>
            </article>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Weekly meetings area chart */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Weekly Meetings</CardTitle>
            <Button variant="ghost" size="icon" aria-label="Options">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 w-full">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004ac6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#004ac6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#areaFill)"
                  stroke="none"
                  points={`0,200 ${trendData.map((d, i) => `${(i / (trendData.length - 1)) * 600},${200 - d.value * 1.8}`).join(' ')} 600,200`}
                />
                <polyline
                  fill="none"
                  stroke="#004ac6"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={trendData.map((d, i) => `${(i / (trendData.length - 1)) * 600},${200 - d.value * 1.8}`).join(' ')}
                />
                {trendData.map((d, i) => (
                  <circle
                    key={d.week}
                    cx={(i / (trendData.length - 1)) * 600}
                    cy={200 - d.value * 1.8}
                    r="3.5"
                    fill="#fff"
                    stroke="#004ac6"
                    strokeWidth="2"
                  />
                ))}
              </svg>
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[11px] text-slatey">
                {trendData.map((d) => (
                  <span key={d.week}>{d.week}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dept productivity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Dept Productivity</CardTitle>
            <Button variant="ghost" size="icon" aria-label="Options">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Engineering', value: 92, color: 'bg-brand' },
                { name: 'Product', value: 78, color: 'bg-emerald-500' },
                { name: 'Design', value: 65, color: 'bg-amber-500' },
                { name: 'Marketing', value: 54, color: 'bg-rose-500' },
                { name: 'Sales', value: 88, color: 'bg-violet-500' },
              ].map((d) => (
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

        {/* Room usage heat map */}
        <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle>Room Usage Heat Map</CardTitle>
            <div className="flex items-center gap-2">
              {['floor-1', 'floor-2'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFloor(f)}
                  className={cn(
                    'rounded px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors',
                    floor === f ? 'bg-brand-soft text-brand' : 'border border-slate-200 bg-white text-ink hover:bg-slate-50',
                  )}
                >
                  {f === 'floor-1' ? 'Floor 1' : 'Floor 2'}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-[700px] border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="w-[100px] px-0 py-0 text-left text-[11px] font-medium tracking-wide text-slatey">Room</th>
                    {timeSlots.map((t) => (
                      <th key={t} className="px-1 py-0 text-center text-[11px] font-medium tracking-wide text-slatey">{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatData.map((room) => (
                    <tr key={room.room}>
                      <td className="w-[100px] px-0 py-0 text-xs tracking-wide text-ink">{room.room}</td>
                      {room.values.map((v, i) => {
                        const c = usageColor(v);
                        return (
                          <td key={i} className="px-1 py-0">
                            <div className={cn('flex h-10 items-center justify-center rounded', c.bg)}>
                              <span className={cn('text-[11px] font-medium tracking-wide', c.text)}>{v}%</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4">
              <span className="text-[11px] font-medium tracking-wide text-slatey">Utilization Key:</span>
              {legend.map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className={cn('h-3 w-3 rounded', l.color)} />
                  <span className="text-[11px] font-medium tracking-wide text-slatey">{l.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
