from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import Employee, LeaveRequest, Attendance, Payroll
import random
from datetime import datetime, timedelta

def seed_db(db: Session):
    # Check if database is already seeded
    if db.query(Employee).count() > 0:
        print("Database already seeded. Skipping...")
        return

    print("Seeding database...")

    # Departments and designations
    departments = {
        "Engineering": ["Software Engineer", "Senior Software Engineer", "DevOps Engineer", "Tech Lead", "QA Analyst"],
        "HR": ["HR Coordinator", "HR Manager", "Talent Acquisition Specialist"],
        "Sales": ["Sales Representative", "Account Executive", "Sales Manager"],
        "Marketing": ["Marketing Specialist", "Content Writer", "SEO Specialist", "Marketing Manager"]
    }

    names = [
        "James Smith", "Michael Smith", "Robert Smith", "Maria Garcia", "David Smith",
        "Maria Rodriguez", "Mary Smith", "Maria Hernandez", "Maria Martinez", "James Johnson",
        "John Smith", "Robert Johnson", "Michael Johnson", "Mary Johnson", "William Smith",
        "David Johnson", "Richard Smith", "Mary Williams", "Joseph Smith", "Thomas Smith",
        "Patricia Smith", "Jennifer Smith", "Linda Smith", "Elizabeth Smith", "Barbara Smith",
        "Susan Smith", "Jessica Smith", "Sarah Smith", "Karen Smith", "Nancy Smith"
    ]

    employees = []
    for i, name in enumerate(names):
        emp_id = f"EMP{i+1:03d}"
        first, last = name.split(" ")
        email = f"{first.lower()}.{last.lower()}{i+1}@example.com"
        dept = random.choice(list(departments.keys()))
        desg = random.choice(departments[dept])
        
        # joining date between 1 and 3 years ago
        days_ago = random.randint(100, 1000)
        join_date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        
        status = "Active" if i < 28 else "Inactive"  # 2 inactive for realism
        
        employee = Employee(
            employee_id=emp_id,
            name=name,
            email=email,
            department=dept,
            designation=desg,
            joining_date=join_date,
            status=status
        )
        db.add(employee)
        employees.append(employee)
    
    db.commit()
    print(f"Seeded {len(employees)} employees.")

    # Leaves
    leave_types = ["Annual", "Sick", "Casual", "Unpaid"]
    leave_statuses = ["Approved", "Rejected", "Pending"]
    reasons = [
        "Family vacation", "Medical checkup", "Personal errands",
        "Not feeling well", "Moving to new apartment", "Wedding attendance"
    ]

    for i in range(15):
        emp = random.choice(employees)
        start = datetime.now() + timedelta(days=random.randint(-30, 30))
        end = start + timedelta(days=random.randint(1, 5))
        status = random.choice(leave_statuses)
        
        leave = LeaveRequest(
            employee_id=emp.employee_id,
            employee_name=emp.name,
            leave_type=random.choice(leave_types),
            start_date=start.strftime("%Y-%m-%d"),
            end_date=end.strftime("%Y-%m-%d"),
            status=status,
            reason=random.choice(reasons)
        )
        db.add(leave)

    # Attendance for the last 10 days
    today = datetime.now()
    for day_offset in range(10):
        current_date = today - timedelta(days=day_offset)
        # Skip weekends
        if current_date.weekday() >= 5:
            continue
        
        date_str = current_date.strftime("%Y-%m-%d")
        for emp in employees:
            if emp.status == "Inactive":
                continue
                
            # Randomize attendance behavior
            roll = random.random()
            if roll < 0.05:
                # Absent
                attendance = Attendance(
                    employee_id=emp.employee_id,
                    employee_name=emp.name,
                    date=date_str,
                    clock_in=None,
                    clock_out=None,
                    status="Absent"
                )
            elif roll < 0.10:
                # On Leave
                attendance = Attendance(
                    employee_id=emp.employee_id,
                    employee_name=emp.name,
                    date=date_str,
                    clock_in=None,
                    clock_out=None,
                    status="On Leave"
                )
            elif roll < 0.25:
                # Late Present
                clock_in = f"09:{random.randint(16, 59):02d}:{random.randint(0, 59):02d}"
                clock_out = f"18:{random.randint(0, 30):02d}:{random.randint(0, 59):02d}"
                attendance = Attendance(
                    employee_id=emp.employee_id,
                    employee_name=emp.name,
                    date=date_str,
                    clock_in=clock_in,
                    clock_out=clock_out,
                    status="Late"
                )
            else:
                # On Time Present
                clock_in = f"08:{random.randint(45, 59):02d}:{random.randint(0, 59):02d}"
                clock_out = f"17:{random.randint(30, 59):02d}:{random.randint(0, 59):02d}"
                attendance = Attendance(
                    employee_id=emp.employee_id,
                    employee_name=emp.name,
                    date=date_str,
                    clock_in=clock_in,
                    clock_out=clock_out,
                    status="Present"
                )
            db.add(attendance)

    # Payroll for last 2 months (June 2026, May 2026)
    months = ["June 2026", "May 2026"]
    for month in months:
        for emp in employees:
            basic = random.choice([4000.0, 4500.0, 5500.0, 6000.0, 7500.0, 8500.0])
            allowance = round(basic * random.choice([0.05, 0.10, 0.12]), 2)
            deductions = round(basic * random.choice([0.02, 0.04, 0.05]), 2)
            net_salary = basic + allowance - deductions
            
            payroll = Payroll(
                employee_id=emp.employee_id,
                employee_name=emp.name,
                month=month,
                basic_salary=basic,
                allowance=allowance,
                deductions=deductions,
                net_salary=net_salary,
                status="Paid"
            )
            db.add(payroll)

    db.commit()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        seed_db(db)
    finally:
        db.close()
