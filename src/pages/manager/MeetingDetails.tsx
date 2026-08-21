import { useParams, Link, useLocation } from 'react-router-dom';
import { Clock, DoorOpen, Users, ArrowLeft, CheckCircle2, Calendar, Download, FileText, Sparkles, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { meetings, meetingTranscript, aiSummary, actionItems } from '@/lib/data';
import { cn } from '@/lib/utils';

export function MeetingDetails() {
  const { id } = useParams();
  const location = useLocation();
  const isEmployeeRoute = location.pathname.startsWith('/employee');
  const backLink = isEmployeeRoute ? '/employee/meetings' : '/manager/meetings';

  const meeting = meetings.find((m) => m.id === id);

  if (!meeting) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-slatey">Meeting not found.</p>
        <Link to={backLink}>
          <Button variant="outline" size="md"><ArrowLeft className="h-4 w-4" /> Back to meetings</Button>
        </Link>
      </div>
    );
  }

  const statusTone = meeting.status === 'upcoming' ? 'blue' : meeting.status === 'completed' ? 'green' : 'red';
  const isCompleted = meeting.status === 'completed';

  return (
    <div className="flex flex-col gap-6">
      <Link to={backLink} className="flex items-center gap-1.5 text-sm font-medium text-slatey hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Back to meetings
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <span className="text-xs font-medium">{meeting.date.split(' ')[0]}</span>
            <span className="font-heading text-2xl font-bold">{meeting.date.split(' ')[1]}</span>
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{meeting.title}</h1>
            <p className="mt-1 text-sm text-slatey">Organized by {meeting.organizer}</p>
            <div className="mt-2 flex gap-2">
              <Badge tone={statusTone}>{meeting.status}</Badge>
              <Badge tone={meeting.priority === 'high' ? 'red' : meeting.priority === 'medium' ? 'amber' : 'neutral'}>
                {meeting.priority} priority
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md">Edit</Button>
          <Button variant="primary" size="md">Join Meeting</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
              <Calendar className="h-5 w-5 text-brand" />
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {meeting.agenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                      {i + 1}
                    </span>
                    <span className="text-sm text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meeting Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Clock} label="Time" value={`${meeting.time} · ${meeting.duration}`} />
                <InfoRow icon={DoorOpen} label="Room" value={meeting.room} />
                <InfoRow icon={Calendar} label="Date" value={meeting.date} />
                <InfoRow icon={Users} label="Attendees" value={`${meeting.attendees.length} people`} />
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          {isCompleted && (
            <Card className="border-brand/20">
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
                <Sparkles className="h-5 w-5 text-brand" />
              </CardHeader>
              <CardContent>
                <div className="rounded-xl bg-brand-soft/30 p-4">
                  <p className="text-sm leading-relaxed text-ink">{aiSummary}</p>
                </div>
                <Button variant="soft" size="sm" className="mt-4">
                  <Download className="h-3.5 w-3.5" /> Download Minutes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Transcript */}
          {isCompleted && (
            <Card>
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5" /> Download Transcript
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {meetingTranscript.map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                        {line.speaker.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-ink">{line.speaker}</span>
                          <span className="text-xs text-slatey">{line.time}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-slatey">{line.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Items */}
          {isCompleted && (
            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <ClipboardList className="h-5 w-5 text-brand" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {actionItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
                        {item.id.slice(-1)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{item.text}</p>
                        <p className="text-xs text-slatey">{item.assignee} · Due {item.dueDate}</p>
                      </div>
                      <Badge tone="amber">Pending</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendees</CardTitle>
            <Badge tone="blue">{meeting.attendees.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {meeting.attendees.map((name, i) => (
                <div key={name} className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white',
                    ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'][i % 5],
                  )}>
                    {name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="flex-1 text-sm font-medium text-ink">{name}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-brand" />
      <div>
        <p className="text-xs text-slatey">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
