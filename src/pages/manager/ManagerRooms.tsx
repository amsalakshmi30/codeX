import { DoorOpen, Plus, Users, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, PageHeader, Badge } from '@/components/ui';
import { rooms } from '@/lib/data';
import { cn } from '@/lib/utils';

export function ManagerRooms() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Room Management"
        subtitle="Monitor room availability, capacity, and amenities across floors."
        actions={<Button variant="primary" size="md"><Plus className="h-4 w-4" /> Add Room</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rooms.map((r) => (
          <Card key={r.id} className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <DoorOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{r.name}</h3>
                    <p className="text-xs text-slatey">{r.floor}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label="Options" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {r.amenities.map((a) => (
                  <span key={a} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slatey">{a}</span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="flex items-center gap-1.5 text-slatey">
                  <Users className="h-3.5 w-3.5" /> {r.capacity} seats
                </span>
                <Badge tone={r.status === 'available' ? 'green' : r.status === 'occupied' ? 'amber' : 'red'}>
                  {r.status}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slatey">Utilization</span>
                  <span className="font-medium text-ink">{r.utilization}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      r.utilization >= 81 ? 'bg-rose-500' : r.utilization >= 41 ? 'bg-amber-500' : 'bg-emerald-500',
                    )}
                    style={{ width: `${r.utilization}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
