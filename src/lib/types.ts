export type Role = 'manager' | 'employee';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  organizer: string;
  attendees: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  agenda: string[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  status: 'active' | 'away' | 'offline';
  avatarColor: string;
  meetingsThisWeek: number;
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  utilization: number;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done';
  relatedMeeting?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}
