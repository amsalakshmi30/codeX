import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, User, ArrowLeft } from 'lucide-react';
import { managerNav, employeeNav } from '@/lib/data';

export function RoleSelect() {
  const roles = [
    {
      title: 'Manager',
      subtitle: 'Full workspace control',
      description: 'Schedule meetings, manage employees and rooms, and review organization-wide analytics.',
      icon: ShieldCheck,
      nav: managerNav,
      loginPath: '/login/manager',
      accent: 'from-brand to-brand-dark',
    },
    {
      title: 'Employee',
      subtitle: 'Personal productivity',
      description: 'View your meetings, calendar, and tasks, and keep up with what your team needs from you.',
      icon: User,
      nav: employeeNav,
      loginPath: '/login/employee',
      accent: 'from-emerald-600 to-emerald-700',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f7f9fc] via-white to-brand-soft/40">
      <header className="flex items-center justify-between px-8 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="font-heading text-xl font-bold text-ink">MeetSmart AI</p>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-slatey hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">Choose your role</h1>
            <p className="mt-2 text-sm text-slatey">Select how you want to sign in to MeetSmart AI.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role) => (
              <Link
                key={role.title}
                to={role.loginPath}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${role.accent} text-white`}>
                  <role.icon className="h-7 w-7" />
                </div>
                <h2 className="mt-6 font-heading text-2xl font-bold text-ink">{role.title} Login</h2>
                <p className="mt-1 text-sm font-medium text-brand">{role.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-slatey">{role.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {role.nav.slice(0, 4).map((item) => (
                    <span
                      key={item.path}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slatey"
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand transition-transform group-hover:translate-x-1">
                  Continue to login
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
