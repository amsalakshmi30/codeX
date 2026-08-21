import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/types';

export function ProtectedRoute({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={`/login/${role}`} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />;
  }

  return <>{children}</>;
}
