import {
  LayoutDashboard,
  CalendarPlus,
  ListChecks,
  Users,
  DoorOpen,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Settings,
  User,
} from 'lucide-react';
import type { Employee, Meeting, Room, Task } from './types';

export const employees: Employee[] = [
  { id: 'e1', name: 'Sarah Chen', role: 'Product Manager', email: 'sarah.c@meetsmart.io', department: 'Product', status: 'active', avatarColor: 'bg-blue-500', meetingsThisWeek: 12 },
  { id: 'e2', name: 'Marcus Reed', role: 'Senior Engineer', email: 'marcus.r@meetsmart.io', department: 'Engineering', status: 'active', avatarColor: 'bg-emerald-500', meetingsThisWeek: 8 },
  { id: 'e3', name: 'Priya Nair', role: 'UX Designer', email: 'priya.n@meetsmart.io', department: 'Design', status: 'away', avatarColor: 'bg-amber-500', meetingsThisWeek: 6 },
  { id: 'e4', name: 'David Okoye', role: 'Engineering Lead', email: 'david.o@meetsmart.io', department: 'Engineering', status: 'active', avatarColor: 'bg-rose-500', meetingsThisWeek: 15 },
  { id: 'e5', name: 'Elena Rossi', role: 'Marketing Manager', email: 'elena.r@meetsmart.io', department: 'Marketing', status: 'offline', avatarColor: 'bg-violet-500', meetingsThisWeek: 4 },
  { id: 'e6', name: 'Tom Walsh', role: 'Sales Director', email: 'tom.w@meetsmart.io', department: 'Sales', status: 'active', avatarColor: 'bg-cyan-500', meetingsThisWeek: 18 },
  { id: 'e7', name: 'Aisha Khan', role: 'Data Analyst', email: 'aisha.k@meetsmart.io', department: 'Data', status: 'away', avatarColor: 'bg-teal-500', meetingsThisWeek: 7 },
  { id: 'e8', name: 'Carlos Mendez', role: 'Operations', email: 'carlos.m@meetsmart.io', department: 'Operations', status: 'active', avatarColor: 'bg-orange-500', meetingsThisWeek: 10 },
];

export const rooms: Room[] = [
  { id: 'r1', name: 'Boardroom A', floor: 'Floor 1', capacity: 16, amenities: ['4K Display', 'Video Conferencing', 'Whiteboard'], status: 'occupied', utilization: 95 },
  { id: 'r2', name: 'Huddle 1', floor: 'Floor 1', capacity: 6, amenities: ['TV Display', 'Whiteboard'], status: 'available', utilization: 40 },
  { id: 'r3', name: 'Huddle 2', floor: 'Floor 1', capacity: 6, amenities: ['TV Display'], status: 'available', utilization: 20 },
  { id: 'r4', name: 'Innovation Lab', floor: 'Floor 2', capacity: 12, amenities: ['Smart Board', 'Video Conferencing', 'VR Kit'], status: 'maintenance', utilization: 0 },
  { id: 'r5', name: 'Executive Suite', floor: 'Floor 2', capacity: 8, amenities: ['4K Display', 'Video Conferencing'], status: 'available', utilization: 60 },
  { id: 'r6', name: 'Training Room', floor: 'Floor 2', capacity: 30, amenities: ['Projector', 'Microphone System', 'Whiteboard'], status: 'occupied', utilization: 88 },
];

export const meetings: Meeting[] = [
  { id: 'm1', title: 'Q3 Product Roadmap Review', date: 'Aug 21', time: '10:00 AM', duration: '45m', room: 'Boardroom A', organizer: 'Sarah Chen', attendees: ['Sarah Chen', 'Marcus Reed', 'Priya Nair', 'David Okoye'], status: 'upcoming', priority: 'high', agenda: ['Review Q2 outcomes', 'Align on Q3 priorities', 'Resource allocation'] },
  { id: 'm2', title: 'Engineering Sprint Planning', date: 'Aug 21', time: '1:00 PM', duration: '60m', room: 'Innovation Lab', organizer: 'David Okoye', attendees: ['David Okoye', 'Marcus Reed', 'Aisha Khan'], status: 'upcoming', priority: 'high', agenda: ['Sprint goal', 'Story pointing', 'Capacity planning'] },
  { id: 'm3', title: 'Design System Sync', date: 'Aug 22', time: '11:00 AM', duration: '30m', room: 'Huddle 1', organizer: 'Priya Nair', attendees: ['Priya Nair', 'Sarah Chen'], status: 'upcoming', priority: 'medium', agenda: ['Component audit', 'Token migration'] },
  { id: 'm4', title: 'Weekly Marketing Standup', date: 'Aug 22', time: '9:30 AM', duration: '15m', room: 'Huddle 2', organizer: 'Elena Rossi', attendees: ['Elena Rossi', 'Tom Walsh'], status: 'upcoming', priority: 'low', agenda: ['Campaign updates', 'Metrics review'] },
  { id: 'm5', title: 'Customer Success Review', date: 'Aug 19', time: '2:00 PM', duration: '50m', room: 'Executive Suite', organizer: 'Tom Walsh', attendees: ['Tom Walsh', 'Sarah Chen', 'Carlos Mendez'], status: 'completed', priority: 'medium', agenda: ['Renewal pipeline', 'Churn risks'] },
  { id: 'm6', title: 'All-Hands Townhall', date: 'Aug 23', time: '4:00 PM', duration: '60m', room: 'Training Room', organizer: 'Sarah Chen', attendees: ['Sarah Chen', 'David Okoye', 'Elena Rossi', 'Tom Walsh', 'Aisha Khan'], status: 'upcoming', priority: 'high', agenda: ['Company updates', 'OKR progress', 'Q&A'] },
  { id: 'm7', title: 'Data Pipeline Architecture', date: 'Aug 20', time: '3:00 PM', duration: '45m', room: 'Innovation Lab', organizer: 'Aisha Khan', attendees: ['Aisha Khan', 'Marcus Reed'], status: 'completed', priority: 'medium', agenda: ['Schema review', 'ETL design'] },
  { id: 'm8', title: 'Vendor Negotiation', date: 'Aug 24', time: '10:30 AM', duration: '40m', room: 'Executive Suite', organizer: 'Carlos Mendez', attendees: ['Carlos Mendez', 'Tom Walsh'], status: 'upcoming', priority: 'high', agenda: ['Pricing terms', 'Contract length'] },
];

export const tasks: Task[] = [
  { id: 't1', title: 'Prepare Q3 roadmap slides', dueDate: 'Aug 21', priority: 'high', status: 'in-progress', relatedMeeting: 'Q3 Product Roadmap Review' },
  { id: 't2', title: 'Send sprint retrospective notes', dueDate: 'Aug 22', priority: 'medium', status: 'todo', relatedMeeting: 'Engineering Sprint Planning' },
  { id: 't3', title: 'Update component library docs', dueDate: 'Aug 23', priority: 'low', status: 'todo', relatedMeeting: 'Design System Sync' },
  { id: 't4', title: 'Collect campaign performance metrics', dueDate: 'Aug 20', priority: 'medium', status: 'done', relatedMeeting: 'Weekly Marketing Standup' },
  { id: 't5', title: 'Draft customer health report', dueDate: 'Aug 21', priority: 'high', status: 'in-progress', relatedMeeting: 'Customer Success Review' },
  { id: 't6', title: 'Prepare townhall presentation', dueDate: 'Aug 23', priority: 'high', status: 'todo', relatedMeeting: 'All-Hands Townhall' },
];

export const managerNav = [
  { label: 'Dashboard', path: '/manager', icon: LayoutDashboard },
  { label: 'Schedule Meeting', path: '/manager/schedule', icon: CalendarPlus },
  { label: 'Meetings', path: '/manager/meetings', icon: ListChecks },
  { label: 'Employees', path: '/manager/employees', icon: Users },
  { label: 'Room Management', path: '/manager/rooms', icon: DoorOpen },
  { label: 'Analytics', path: '/manager/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/manager/settings', icon: Settings },
];

export const employeeNav = [
  { label: 'Dashboard', path: '/employee', icon: LayoutDashboard },
  { label: 'My Meetings', path: '/employee/meetings', icon: ListChecks },
  { label: 'Calendar', path: '/employee/calendar', icon: CalendarDays },
  { label: 'Tasks', path: '/employee/tasks', icon: ClipboardList },
  { label: 'Profile', path: '/employee/profile', icon: User },
];

export const notifications = [
  { id: 'n1', title: 'New meeting invitation', body: 'You\'ve been invited to "All-Hands Townhall"', time: '5 min ago', unread: true },
  { id: 'n2', title: 'Task due soon', body: '"Prepare Q3 roadmap slides" is due today', time: '1 hour ago', unread: true },
  { id: 'n3', title: 'Room changed', body: '"Design System Sync" moved to Huddle 1', time: '3 hours ago', unread: false },
  { id: 'n4', title: 'Meeting completed', body: '"Customer Success Review" summary is available', time: 'Yesterday', unread: false },
];

export const recentActivity = [
  { id: 'a1', action: 'scheduled', target: 'Q3 Product Roadmap Review', user: 'Sarah Chen', time: '10 min ago' },
  { id: 'a2', action: 'completed', target: 'Data Pipeline Architecture', user: 'Aisha Khan', time: '2 hours ago' },
  { id: 'a3', action: 'updated room', target: 'Boardroom A', user: 'Carlos Mendez', time: '3 hours ago' },
  { id: 'a4', action: 'resolved conflict for', target: 'Engineering Sprint Planning', user: 'MeetSmart AI', time: '4 hours ago' },
  { id: 'a5', action: 'finished task', target: 'Collect campaign performance metrics', user: 'Elena Rossi', time: 'Yesterday' },
];

export const meetingTranscript = [
  { speaker: 'Sarah Chen', time: '10:00', text: 'Thanks everyone for joining. Let\'s start with the Q2 outcomes review.' },
  { speaker: 'David Okoye', time: '10:04', text: 'Q2 delivery was on track — we shipped 92% of planned stories.' },
  { speaker: 'Priya Nair', time: '10:08', text: 'The design system migration is 60% complete. We need two more sprints.' },
  { speaker: 'Marcus Reed', time: '10:12', text: 'From an engineering perspective, the main risk is the API refactor blocking the new dashboard.' },
  { speaker: 'Sarah Chen', time: '10:18', text: 'Let\'s prioritize the API refactor for sprint 1 of Q3 and revisit resource allocation.' },
];

export const aiSummary = 'The Q3 Product Roadmap Review covered Q2 outcomes, design system progress, and engineering risks. Key decisions: prioritize API refactor for sprint 1, allocate two sprints for design system migration, and revisit resource allocation next week. Action items assigned to David, Priya, and Marcus.';

export const actionItems = [
  { id: 'ai1', text: 'Draft API refactor sprint plan', assignee: 'David Okoye', dueDate: 'Aug 24' },
  { id: 'ai2', text: 'Provide design system migration timeline', assignee: 'Priya Nair', dueDate: 'Aug 23' },
  { id: 'ai3', text: 'Share Q2 metrics deck with stakeholders', assignee: 'Sarah Chen', dueDate: 'Aug 22' },
  { id: 'ai4', text: 'Identify resource gaps for Q3', assignee: 'Marcus Reed', dueDate: 'Aug 25' },
];
