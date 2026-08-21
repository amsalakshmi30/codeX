import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { AppLayout } from '@/components/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RoleSelect } from '@/components/RoleSelect';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { managerNav, employeeNav } from '@/lib/data';
import { ManagerDashboard } from '@/pages/manager/ManagerDashboard';
import { ManagerSchedule } from '@/pages/manager/ManagerSchedule';
import { ManagerMeetingList } from '@/pages/manager/ManagerMeetingList';
import { MeetingDetails } from '@/pages/manager/MeetingDetails';
import { ManagerEmployees } from '@/pages/manager/ManagerEmployees';
import { ManagerRooms } from '@/pages/manager/ManagerRooms';
import { ManagerAnalytics } from '@/pages/manager/ManagerAnalytics';
import { ManagerSettings } from '@/pages/manager/ManagerSettings';
import { EmployeeDashboard } from '@/pages/employee/EmployeeDashboard';
import { EmployeeMyMeetings } from '@/pages/employee/EmployeeMyMeetings';
import { EmployeeCalendar } from '@/pages/employee/EmployeeCalendar';
import { EmployeeTasks } from '@/pages/employee/EmployeeTasks';
import { EmployeeProfile } from '@/pages/employee/EmployeeProfile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/role-select" element={<RoleSelect />} />
          <Route path="/login/manager" element={<LoginPage role="manager" />} />
          <Route path="/login/employee" element={<LoginPage role="employee" />} />

          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <AppLayout navItems={managerNav} roleLabel="Manager Workspace" basePath="/manager" />
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerDashboard />} />
            <Route path="schedule" element={<ManagerSchedule />} />
            <Route path="meetings" element={<ManagerMeetingList />} />
            <Route path="meetings/:id" element={<MeetingDetails />} />
            <Route path="employees" element={<ManagerEmployees />} />
            <Route path="rooms" element={<ManagerRooms />} />
            <Route path="analytics" element={<ManagerAnalytics />} />
            <Route path="settings" element={<ManagerSettings />} />
          </Route>

          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <AppLayout navItems={employeeNav} roleLabel="Employee Workspace" basePath="/employee" />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="meetings" element={<EmployeeMyMeetings />} />
            <Route path="meetings/:id" element={<MeetingDetails />} />
            <Route path="calendar" element={<EmployeeCalendar />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
