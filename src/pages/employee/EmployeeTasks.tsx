import { useState } from 'react';
import { CheckCircle2, Circle, Clock, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, PageHeader, Badge } from '@/components/ui';
import { tasks } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

type Status = 'todo' | 'in-progress' | 'done';

const columns: { key: Status; label: string; tone: 'neutral' | 'blue' | 'green' }[] = [
  { key: 'todo', label: 'To Do', tone: 'neutral' },
  { key: 'in-progress', label: 'In Progress', tone: 'blue' },
  { key: 'done', label: 'Done', tone: 'green' },
];

export function EmployeeTasks() {
  const [taskState, setTaskState] = useState<Task[]>(tasks);

  const toggleStatus = (id: string) => {
    setTaskState((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: Status = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'done' : 'todo';
        return { ...t, status: next };
      }),
    );
  };

  const counts = {
    todo: taskState.filter((t) => t.status === 'todo').length,
    'in-progress': taskState.filter((t) => t.status === 'in-progress').length,
    done: taskState.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        subtitle="Track your action items and keep momentum across meetings."
        actions={<Button variant="primary" size="md">+ New Task</Button>}
      />

      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => (
          <Card key={col.key}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                col.tone === 'neutral' && 'bg-slate-100 text-slatey',
                col.tone === 'blue' && 'bg-brand-soft text-brand',
                col.tone === 'green' && 'bg-emerald-50 text-emerald-600',
              )}>
                {col.key === 'done' ? <CheckCircle2 className="h-5 w-5" /> : col.key === 'in-progress' ? <Clock className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-ink">{counts[col.key]}</p>
                <p className="text-xs text-slatey">{col.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {columns.map((col) => (
          <Card key={col.key}>
            <CardHeader>
              <CardTitle>{col.label}</CardTitle>
              <Badge tone={col.tone}>{counts[col.key]}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {taskState
                  .filter((t) => t.status === col.key)
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => toggleStatus(t.id)}
                      className={cn(
                        'flex flex-col gap-2 rounded-xl border p-4 text-left transition-all hover:shadow-card',
                        t.status === 'done' ? 'border-emerald-100 bg-emerald-50/40' : 'border-slate-200 hover:border-brand/30',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-sm font-medium', t.status === 'done' ? 'text-slatey line-through' : 'text-ink')}>
                          {t.title}
                        </p>
                        <span className={cn(
                          'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                          t.priority === 'high' ? 'bg-rose-500' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-300',
                        )} />
                      </div>
                      {t.relatedMeeting && (
                        <span className="flex items-center gap-1.5 text-[11px] text-slatey">
                          <ClipboardList className="h-3 w-3" /> {t.relatedMeeting}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slatey">Due {t.dueDate}</span>
                        <span className="text-[11px] font-medium text-brand">Click to advance →</span>
                      </div>
                    </button>
                  ))}
                {taskState.filter((t) => t.status === col.key).length === 0 && (
                  <p className="py-6 text-center text-sm text-slatey">No tasks here.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
