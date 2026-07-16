from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Employee
from ..schemas import EmployeeCreate, EmployeeUpdate, EmployeeOut, PaginatedEmployees

router = APIRouter(prefix="/api/employees", tags=["Employees"])

@router.get("", response_model=PaginatedEmployees)
def list_employees(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    sort_by: str = Query("employee_id"),
    sort_order: str = Query("asc"), # asc, desc
    db: Session = Depends(get_db)
):
    query = db.query(Employee)

    # Search filter
    if search:
        query = query.filter(
            (Employee.name.ilike(f"%{search}%")) |
            (Employee.email.ilike(f"%{search}%")) |
            (Employee.employee_id.ilike(f"%{search}%"))
        )

    # Category filters
    if department:
        query = query.filter(Employee.department == department)
    if status:
        query = query.filter(Employee.status == status)

    # Sorting
    if hasattr(Employee, sort_by):
        col = getattr(Employee, sort_by)
        if sort_order == "desc":
            query = query.order_by(col.desc())
        else:
            query = query.order_by(col.asc())
    else:
        query = query.order_by(Employee.employee_id.asc())

    total = query.count()
    offset = (page - 1) * size
    items = query.offset(offset).limit(size).all()

    return PaginatedEmployees(
        items=items,
        total=total,
        page=page,
        size=size
    )

@router.post("", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Check if duplicate ID or email
    if db.query(Employee).filter(Employee.employee_id == employee.employee_id).first():
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    if db.query(Employee).filter(Employee.email == employee.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    new_emp = Employee(**employee.model_dump())
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@router.put("/{emp_id}", response_model=EmployeeOut)
def update_employee(emp_id: str, employee_update: EmployeeUpdate, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    update_data = employee_update.model_dump(exclude_unset=True)
    
    if "email" in update_data and update_data["email"] != emp.email:
        # Check if email taken by someone else
        if db.query(Employee).filter(Employee.email == update_data["email"]).first():
            raise HTTPException(status_code=400, detail="Email already exists")

    for key, value in update_data.items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)
    return emp

@router.delete("/{emp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(emp_id: str, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(emp)
    db.commit()
    return None
