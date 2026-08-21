import { useState } from 'react';
import { Mail, Phone, Building, Calendar, Clock, CheckCircle2, Edit3, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, PageHeader, Badge } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { meetings, tasks } from '@/lib/data';
import { cn } from '@/lib/utils';

export function EmployeeProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name ?? 'Marcus Reed',
    email: user?.email ?? 'employee@meetsmart.ai',
    phone: '+1 (555) 246-8913',
    department: 'Engineering',
    title: 'Senior Engineer',
  });

  const myMeetings = meetings.filter((m) => m.attendees.includes('Marcus Reed') || m.attendees.includes('Sarah Chen'));
  const myTasks = tasks;
  const completedTasks = myTasks.filter((t) => t.status === 'done').length;

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Profile" subtitle="View and update your personal information." />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Profile updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-2xl font-bold text-white">
              {profile.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-ink">{profile.name}</p>
              <p className="text-sm text-slatey">{profile.title}</p>
            </div>
            <Badge tone="green">Active</Badge>
            <div className="grid w-full grid-cols-3 gap-2 border-t border-slate-100 pt-4">
              <Stat value={myMeetings.length} label="Meetings" />
              <Stat value={completedTasks} label="Done" />
              <Stat value={12} label="Hours" />
            </div>
          </CardContent>
        </Card>

        {/* Editable info */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleSave}>
                  <Save className="h-3.5 w-3.5" /> Save
                </Button>
              )}
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoField icon={Building} label="Full name" value={profile.name} editing={editing}
                onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
              <InfoField icon={Mail} label="Email" value={profile.email} editing={editing}
                onChange={(v) => setProfile((p) => ({ ...p, email: v }))} />
              <InfoField icon={Phone} label="Phone" value={profile.phone} editing={editing}
                onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} />
              <InfoField icon={Building} label="Department" value={profile.department} editing={editing}
                onChange={(v) => setProfile((p) => ({ ...p, department: v }))} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <Calendar className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {myMeetings.filter((m) => m.status === 'completed').map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{m.title}</p>
                      <p className="flex items-center gap-1.5 text-xs text-slatey">
                        <Clock className="h-3 w-3" /> {m.date} · {m.duration}
                      </p>
                    </div>
                    <Badge tone="green">Completed</Badge>
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

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-heading text-xl font-bold text-ink">{value}</p>
      <p className="text-xs text-slatey">{label}</p>
    </div>
  );
}

function InfoField({
  icon: Icon,
  label,
  value,
  editing,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
      <Icon className="mt-0.5 h-4 w-4 text-brand" />
      <div className="flex-1">
        <p className="text-xs text-slatey">{label}</p>
        {editing ? (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn('mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20')}
          />
        ) : (
          <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
        )}
      </div>
    </div>
  );
}
