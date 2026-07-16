from pydantic import BaseModel, EmailStr
from typing import Optional, List

# Employee
class EmployeeBase(BaseModel):
    name: str
    email: str
    department: str
    designation: str
    joining_date: str
    status: str = "Active"

class EmployeeCreate(EmployeeBase):
    employee_id: str

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[str] = None
    status: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: int
    employee_id: str

    class Config:
        from_attributes = True

# Leave
class LeaveRequestBase(BaseModel):
    employee_id: str
    leave_type: str
    start_date: str
    end_date: str
    reason: Optional[str] = None

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequestUpdateStatus(BaseModel):
    status: str  # Approved, Rejected

class LeaveRequestOut(LeaveRequestBase):
    id: int
    employee_name: str
    status: str

    class Config:
        from_attributes = True

# Attendance
class AttendanceBase(BaseModel):
    employee_id: str
    date: str

class AttendanceClockIn(AttendanceBase):
    pass

class AttendanceClockOut(BaseModel):
    employee_id: str
    date: str

class AttendanceOut(AttendanceBase):
    id: int
    employee_name: str
    clock_in: Optional[str] = None
    clock_out: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

# Payroll
class PayrollBase(BaseModel):
    employee_id: str
    month: str
    basic_salary: float
    allowance: float = 0.0
    deductions: float = 0.0
    net_salary: float
    status: str = "Pending"

class PayrollOut(PayrollBase):
    id: int
    employee_name: str

    class Config:
        from_attributes = True

# Paginated Employee Output
class PaginatedEmployees(BaseModel):
    items: List[EmployeeOut]
    total: int
    page: int
    size: int
