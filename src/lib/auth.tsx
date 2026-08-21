import { createContext, useContext, useState, useCallback } from 'react';
import type { Role } from './types';

interface AuthUser {
  email: string;
  role: Role;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (role: Role, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const demoCredentials: Record<Role, { email: string; password: string; name: string }> = {
  manager: { email: 'manager@meetsmart.ai', password: 'Manager@123', name: 'Sarah Chen' },
  employee: { email: 'employee@meetsmart.ai', password: 'Employee@123', name: 'Marcus Reed' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback((role: Role, email: string, password: string): { ok: boolean; error?: string } => {
    const creds = demoCredentials[role];
    if (email.trim().toLowerCase() !== creds.email) {
      return { ok: false, error: 'Invalid email for this role.' };
    }
    if (password !== creds.password) {
      return { ok: false, error: 'Incorrect password.' };
    }
    setUser({ email: creds.email, role, name: creds.name });
    return { ok: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
