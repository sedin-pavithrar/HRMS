export interface Employee {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joining_date: string;
  status: string;
}

export interface PaginatedEmployees {
  items: Employee[];
  total: number;
  page: number;
  size: number;
}

export interface LeaveRequest {
  id: number;
  employee_id: string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
}

export interface Attendance {
  id: number;
  employee_id: string;
  employee_name: string;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  status: string;
}

export interface Payroll {
  id: number;
  employee_id: string;
  employee_name: string;
  month: string;
  basic_salary: number;
  allowance: number;
  deductions: number;
  net_salary: number;
  status: string;
}
