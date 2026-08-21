import { useState } from 'react';
import { CalendarPlus, Clock, DoorOpen, Users, Video, CheckCircle2, Sparkles, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, PageHeader, Badge } from '@/components/ui';
import { employees, rooms, meetings } from '@/lib/data';
import { cn } from '@/lib/utils';

interface AIRecommendation {
  time: string;
  room: string;
  reason: string;
  conflictsResolved: number;
}

export function ManagerSchedule() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [roomId, setRoomId] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [roomCheckResult, setRoomCheckResult] = useState<string | null>(null);
  const [roomChecking, setRoomChecking] = useState(false);

  const availableRooms = rooms.filter((r) => r.status === 'available');

  const toggleAttendee = (id: string) => {
    setSelectedAttendees((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const handleAiSuggest = () => {
    setAiLoading(true);
    setAiRecommendation(null);
    setTimeout(() => {
      const freeRoom = availableRooms[0];
      const attendeeCount = selectedAttendees.length;
      setAiRecommendation({
        time: '11:00 AM',
        room: freeRoom?.name ?? 'Huddle 1',
        reason: `11:00 AM is recommended because all ${attendeeCount > 0 ? attendeeCount : 'selected'} participants are available and ${freeRoom?.name ?? 'Huddle 1'} is free. No calendar conflicts detected at this time slot.`,
        conflictsResolved: 2,
      });
      setAiLoading(false);
    }, 1200);
  };

  const handleCheckRoom = () => {
    setRoomChecking(true);
    setRoomCheckResult(null);
    setTimeout(() => {
      const count = availableRooms.length;
      setRoomCheckResult(`${count} rooms available on the selected date. ${availableRooms[0]?.name ?? 'Huddle 1'} and ${availableRooms[1]?.name ?? 'Huddle 2'} are free during your preferred time.`);
      setRoomChecking(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Schedule Meeting"
        subtitle="Book a room, invite attendees, and let MeetSmart AI find the optimal time slot."
      />

      {submitted && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            Meeting scheduled successfully. Invitations sent to {selectedAttendees.length} attendees.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
              <CalendarPlus className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field label="Meeting Title">
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Product Roadmap Review"
                  className="input"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the meeting purpose..."
                  rows={3}
                  className="input resize-none"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Date">
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input" />
                </Field>
                <Field label="Preferred Time">
                  <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="input" />
                </Field>
                <Field label="Duration">
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input">
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                  </select>
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <Badge tone="blue">{selectedAttendees.length} selected</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {employees.map((e) => {
                  const selected = selectedAttendees.includes(e.id);
                  return (
                    <button
                      type="button"
                      key={e.id}
                      onClick={() => toggleAttendee(e.id)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                        selected ? 'border-brand bg-brand-soft' : 'border-slate-200 hover:bg-slate-50',
                      )}
                    >
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white', e.avatarColor)}>
                        {e.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{e.name}</p>
                        <p className="truncate text-xs text-slatey">{e.role}</p>
                      </div>
                      <span className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border',
                        selected ? 'border-brand bg-brand text-white' : 'border-slate-300',
                      )}>
                        {selected && <CheckCircle2 className="h-4 w-4" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Selection</CardTitle>
              <DoorOpen className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {availableRooms.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRoomId(r.id)}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                    roomId === r.id ? 'border-brand bg-brand-soft' : 'border-slate-200 hover:bg-slate-50',
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slatey">
                    <DoorOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                    <p className="text-xs text-slatey">{r.floor} · seats {r.capacity}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {r.amenities.slice(0, 2).map((a) => (
                        <span key={a} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slatey">{a}</span>
                      ))}
                    </div>
                  </div>
                  {roomId === r.id && <CheckCircle2 className="h-5 w-5 text-brand" />}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {/* AI Recommendation Panel */}
          <Card className="border-brand/20">
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <Sparkles className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button type="button" variant="primary" size="md" onClick={handleAiSuggest} disabled={aiLoading}>
                {aiLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> AI Suggest Best Time</>
                )}
              </Button>

              {aiRecommendation && (
                <div className="rounded-xl border border-brand/20 bg-brand-soft/30 p-4 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-ink">Recommended: {aiRecommendation.time}</p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slatey">{aiRecommendation.reason}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5 text-brand" />
                    <span className="font-medium text-brand">{aiRecommendation.time}</span>
                    <span className="text-slatey">·</span>
                    <DoorOpen className="h-3.5 w-3.5 text-brand" />
                    <span className="font-medium text-brand">{aiRecommendation.room}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {aiRecommendation.conflictsResolved} potential conflicts detected & resolved
                  </div>
                  <Button
                    type="button"
                    variant="soft"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => {
                      setTime(aiRecommendation.time.replace(' AM', '').replace(' PM', ''));
                      const room = rooms.find((r) => r.name === aiRecommendation.room);
                      if (room) setRoomId(room.id);
                    }}
                  >
                    Apply recommendation
                  </Button>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4">
                <Button type="button" variant="outline" size="md" onClick={handleCheckRoom} disabled={roomChecking} className="w-full">
                  {roomChecking ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Checking...</>
                  ) : (
                    <><DoorOpen className="h-4 w-4" /> Check Room Availability</>
                  )}
                </Button>

                {roomCheckResult && (
                  <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 animate-fade-in">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="text-xs text-emerald-700">{roomCheckResult}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Conflict detection */}
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-ink">Conflict Detection</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slatey">
                  <Calendar className="h-3.5 w-3.5" />
                  Checking against {meetings.filter((m) => m.status === 'upcoming').length} upcoming meetings
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {meetings.filter((m) => m.status === 'upcoming').slice(0, 3).map((m) => (
                    <span key={m.id} className="rounded bg-white px-2 py-0.5 text-[10px] text-slatey border border-slate-200">
                      {m.time} {m.room}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="md" className="w-full py-3">
            <CalendarPlus className="h-4 w-4" /> Schedule Meeting
          </Button>
        </div>
      </form>

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
