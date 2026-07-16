import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import ModuleLayout from './layouts/ModuleLayout';

// Recruitment Management Pages
import JobOpenings from './modules/recruitment/Jobs';
import Candidates from './modules/recruitment/Candidates';
import Interviews from './modules/recruitment/Interviews';
import Onboarding from './modules/recruitment/Onboarding';
import RecruitmentReports from './modules/recruitment/Reports';

// Employee Management Pages
import EmployeeList from './modules/employees/List';
import EmployeeDepartments from './modules/employees/Departments';
import EmployeeDesignations from './modules/employees/Designations';
import EmployeeReports from './modules/employees/Reports';

// Leave Management Pages
import ApplyLeave from './modules/leaves/Apply';
import LeaveHistory from './modules/leaves/History';
import LeaveApprovals from './modules/leaves/Approvals';

// Attendance Management Pages
import StudentAttendance from './modules/attendance/Students';
import EmployeeAttendance from './modules/attendance/Employees';
import AttendanceReports from './modules/attendance/Reports';

// Payroll Management Pages
import Salary from './modules/payroll/Salary';
import Payslips from './modules/payroll/Payslips';
import PayrollReports from './modules/payroll/Reports';

export default function App() {
  return (
    <Router basename="/hrms">
      <Routes>
        {/* Landing Page with Dashboard Layout (No Sidebar) */}
        <Route path="/" element={<DashboardLayout />} />

        {/* Sub-projects / Modules with Module Layout (With Sidebar) */}
        <Route element={<ModuleLayout />}>
          {/* Recruitment Management */}
          <Route path="/recruitment" element={<Navigate to="/recruitment/jobs" replace />} />
          <Route path="/recruitment/jobs" element={<JobOpenings />} />
          <Route path="/recruitment/candidates" element={<Candidates />} />
          <Route path="/recruitment/interviews" element={<Interviews />} />
          <Route path="/recruitment/onboarding" element={<Onboarding />} />
          <Route path="/recruitment/reports" element={<RecruitmentReports />} />

          {/* Employee Management */}
          <Route path="/employees" element={<Navigate to="/employees/list" replace />} />
          <Route path="/employees/list" element={<EmployeeList />} />
          <Route path="/employees/departments" element={<EmployeeDepartments />} />
          <Route path="/employees/designations" element={<EmployeeDesignations />} />
          <Route path="/employees/reports" element={<EmployeeReports />} />

          {/* Leave Management */}
          <Route path="/leaves" element={<Navigate to="/leaves/apply" replace />} />
          <Route path="/leaves/apply" element={<ApplyLeave />} />
          <Route path="/leaves/history" element={<LeaveHistory />} />
          <Route path="/leaves/approvals" element={<LeaveApprovals />} />

          {/* Attendance Management */}
          <Route path="/attendance" element={<Navigate to="/attendance/students" replace />} />
          <Route path="/attendance/students" element={<StudentAttendance />} />
          <Route path="/attendance/employees" element={<EmployeeAttendance />} />
          <Route path="/attendance/reports" element={<AttendanceReports />} />

          {/* Payroll Management */}
          <Route path="/payroll" element={<Navigate to="/payroll/salary" replace />} />
          <Route path="/payroll/salary" element={<Salary />} />
          <Route path="/payroll/payslips" element={<Payslips />} />
          <Route path="/payroll/reports" element={<PayrollReports />} />
        </Route>

        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
