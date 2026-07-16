from sqlalchemy import Column, Integer, String, Float, Date
from .database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    joining_date = Column(String, nullable=False)  # ISO Date String (YYYY-MM-DD)
    status = Column(String, default="Active")       # Active, Inactive

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, nullable=False)
    employee_name = Column(String, nullable=False)
    leave_type = Column(String, nullable=False)    # Annual, Sick, Casual, Unpaid
    start_date = Column(String, nullable=False)    # YYYY-MM-DD
    end_date = Column(String, nullable=False)      # YYYY-MM-DD
    status = Column(String, default="Pending")     # Pending, Approved, Rejected
    reason = Column(String, nullable=True)

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, nullable=False)
    employee_name = Column(String, nullable=False)
    date = Column(String, nullable=False)          # YYYY-MM-DD
    clock_in = Column(String, nullable=True)       # HH:MM:SS
    clock_out = Column(String, nullable=True)      # HH:MM:SS
    status = Column(String, nullable=False)        # Present, Absent, Late, On Leave

class Payroll(Base):
    __tablename__ = "payroll"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, nullable=False)
    employee_name = Column(String, nullable=False)
    month = Column(String, nullable=False)         # e.g., "July 2026"
    basic_salary = Column(Float, nullable=False)
    allowance = Column(Float, default=0.0)
    deductions = Column(Float, default=0.0)
    net_salary = Column(Float, nullable=False)
    status = Column(String, default="Pending")     # Paid, Pending
