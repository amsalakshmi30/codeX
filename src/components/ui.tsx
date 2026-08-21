import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-card', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('flex items-center justify-between p-6', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('font-heading text-lg font-semibold leading-6 text-ink', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('px-6 pb-6 pt-0', className)}>{children}</div>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: {
  variant?: 'primary' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'icon';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50';
  const variants: Record<string, string> = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    outline: 'border border-slate-200 bg-white text-ink hover:bg-slate-50',
    ghost: 'text-slatey hover:bg-slate-100',
    soft: 'bg-brand-soft text-brand hover:bg-brand-soft/70',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs tracking-wide',
    md: 'px-4 py-2 text-xs tracking-wide',
    icon: 'h-10 w-10',
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: 'neutral' | 'green' | 'amber' | 'red' | 'blue';
  className?: string;
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-slate-100 text-slatey',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
    blue: 'bg-brand-soft text-brand',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slatey">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
