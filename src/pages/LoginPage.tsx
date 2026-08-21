import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LoginPageProps {
  role: Role;
}

export function LoginPage({ role }: LoginPageProps) {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  if (user && user.role === role) {
    return <Navigate to={role === 'manager' ? '/manager' : '/employee'} replace />;
  }

  const roleConfig = {
    manager: {
      title: 'Manager Login',
      subtitle: 'Sign in to your manager workspace',
      icon: ShieldCheck,
      accent: 'from-brand to-brand-dark',
      demoEmail: 'manager@meetsmart.ai',
      demoPassword: 'Manager@123',
      backLink: '/role-select',
    },
    employee: {
      title: 'Employee Login',
      subtitle: 'Sign in to your employee workspace',
      icon: User,
      accent: 'from-emerald-600 to-emerald-700',
      demoEmail: 'employee@meetsmart.ai',
      demoPassword: 'Employee@123',
      backLink: '/role-select',
    },
  };

  const config = roleConfig[role];

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    setTimeout(() => {
      const result = login(role, email, password);
      setLoading(false);
      if (result.ok) {
        navigate(role === 'manager' ? '/manager' : '/employee', { replace: true });
      } else {
        setErrors({ form: result.error });
      }
    }, 600);
  };

  const fillDemo = () => {
    setEmail(config.demoEmail);
    setPassword(config.demoPassword);
    setErrors({});
  };

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className={cn('relative hidden w-1/2 flex-col justify-between bg-gradient-to-br p-12 text-white lg:flex', config.accent)}>
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold">MeetSmart AI</span>
        </Link>
        <div>
          <h2 className="font-heading text-4xl font-bold leading-tight">
            {role === 'manager' ? 'Manage your entire meeting ecosystem.' : 'Stay on top of every meeting and task.'}
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            {role === 'manager'
              ? 'Schedule smarter, track room utilization, and get AI-driven insights into your organization.'
              : 'See your daily schedule, join meetings, and track your tasks — all powered by AI.'}
          </p>
        </div>
        <p className="text-sm text-white/60">© 2026 MeetSmart AI</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <Link to={config.backLink} className="mb-8 flex items-center gap-1.5 text-sm font-medium text-slatey hover:text-brand">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <div className="mb-8">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white', config.accent)}>
              <config.icon className="h-6 w-6" />
            </div>
            <h1 className="mt-5 font-heading text-3xl font-bold text-ink">{config.title}</h1>
            <p className="mt-1 text-sm text-slatey">{config.subtitle}</p>
          </div>

          {errors.form && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <p className="text-sm text-rose-700">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide text-slatey">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slatey" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="you@meetsmart.ai"
                  className={cn(
                    'w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-slatey/60 focus:outline-none focus:ring-2',
                    errors.email ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:border-brand focus:ring-brand/20',
                  )}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide text-slatey">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slatey" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  className={cn(
                    'w-full rounded-xl border bg-white py-3 pl-11 pr-11 text-sm text-ink placeholder:text-slatey/60 focus:outline-none focus:ring-2',
                    errors.password ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:border-brand focus:ring-brand/20',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slatey hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/20"
                />
                <span className="text-sm text-slatey">Remember me</span>
              </label>
              <button type="button" className="text-sm font-medium text-brand hover:text-brand-dark">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70',
                role === 'manager' ? 'bg-brand hover:bg-brand-dark' : 'bg-emerald-600 hover:bg-emerald-700',
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials helper */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-ink">Demo credentials</p>
            <p className="mt-1.5 text-xs text-slatey">Email: {config.demoEmail}</p>
            <p className="text-xs text-slatey">Password: {config.demoPassword}</p>
            <button
              onClick={fillDemo}
              className="mt-2.5 text-xs font-semibold text-brand hover:text-brand-dark"
            >
              Fill demo credentials →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
