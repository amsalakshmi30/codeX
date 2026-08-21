import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Palette, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, PageHeader, Badge } from '@/components/ui';

export function ManagerSettings() {
  const [tab, setTab] = useState<'general' | 'notifications' | 'security'>('general');
  const [orgName, setOrgName] = useState('MeetSmart AI');
  const [timezone, setTimezone] = useState('PST (UTC-8)');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { key: 'general' as const, label: 'General', icon: SettingsIcon },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
    { key: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" subtitle="Manage your workspace preferences and configuration." />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-brand text-white' : 'border border-slate-200 bg-white text-slatey hover:bg-slate-50'
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-700">
          <Save className="h-4 w-4" /> Settings saved successfully.
        </div>
      )}

      {tab === 'general' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <Globe className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field label="Organization name">
                <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="input" />
              </Field>
              <Field label="Timezone">
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input">
                  <option>PST (UTC-8)</option>
                  <option>EST (UTC-5)</option>
                  <option>GMT (UTC+0)</option>
                  <option>CET (UTC+1)</option>
                  <option>IST (UTC+5:30)</option>
                </select>
              </Field>
              <Field label="Default meeting duration">
                <select className="input">
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                </select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <Palette className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">Theme</p>
                  <p className="text-xs text-slatey">Light mode (default)</p>
                </div>
                <Badge tone="blue">Light</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">Accent color</p>
                  <p className="text-xs text-slatey">Brand blue</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-brand" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">Compact mode</p>
                  <p className="text-xs text-slatey">Reduce spacing in tables and cards</p>
                </div>
                <Toggle />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <Bell className="h-5 w-5 text-brand" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { label: 'New meeting invitations', desc: 'Get notified when invited to a meeting', on: true },
              { label: 'Meeting reminders', desc: 'Receive reminders 15 minutes before meetings', on: true },
              { label: 'Room conflict alerts', desc: 'Get alerted when a room is double-booked', on: true },
              { label: 'AI scheduling suggestions', desc: 'Receive AI-recommended time slots', on: false },
              { label: 'Weekly summary report', desc: 'A digest of your team\'s meeting activity', on: true },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">{n.label}</p>
                  <p className="text-xs text-slatey">{n.desc}</p>
                </div>
                <Toggle defaultOn={n.on} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === 'security' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <Shield className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field label="Current password">
                <input type="password" placeholder="••••••••" className="input" />
              </Field>
              <Field label="New password">
                <input type="password" placeholder="••••••••" className="input" />
              </Field>
              <Field label="Confirm new password">
                <input type="password" placeholder="••••••••" className="input" />
              </Field>
              <Button variant="primary" size="md" className="w-fit">Update password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
                { label: 'Two-factor authentication', desc: 'Add an extra layer of security', on: false },
                { label: 'Single sign-on (SSO)', desc: 'Use your enterprise identity provider', on: true },
                { label: 'Session timeout', desc: 'Auto-logout after 30 minutes of inactivity', on: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                  <div>
                    <p className="text-sm font-medium text-ink">{s.label}</p>
                    <p className="text-xs text-slatey">{s.desc}</p>
                  </div>
                  <Toggle defaultOn={s.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={handleSave}>
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          background: #fff;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #191c1e;
        }
        .input:focus {
          outline: none;
          border-color: #004ac6;
          box-shadow: 0 0 0 3px rgba(0,74,198,0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium tracking-wide text-slatey">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-brand' : 'bg-slate-300'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}
