from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import LeaveRequest, Employee
from ..schemas import LeaveRequestCreate, LeaveRequestOut, LeaveRequestUpdateStatus

router = APIRouter(prefix="/api/leave", tags=["Leave Management"])

@router.get("", response_model=List[LeaveRequestOut])
def get_leaves(db: Session = Depends(get_db)):
    return db.query(LeaveRequest).order_by(LeaveRequest.id.desc()).all()

@router.post("", response_model=LeaveRequestOut, status_code=status.HTTP_201_CREATED)
def apply_leave(leave: LeaveRequestCreate, db: Session = Depends(get_db)):
    # Find employee name from Employee ID
    emp = db.query(Employee).filter(Employee.employee_id == leave.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    new_leave = LeaveRequest(
        employee_id=leave.employee_id,
        employee_name=emp.name,
        leave_type=leave.leave_type,
        start_date=leave.start_date,
        end_date=leave.end_date,
        reason=leave.reason,
        status="Pending"
    )
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave

@router.put("/{leave_id}/status", response_model=LeaveRequestOut)
def update_leave_status(leave_id: int, status_update: LeaveRequestUpdateStatus, db: Session = Depends(get_db)):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")

    if status_update.status not in ["Approved", "Rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be Approved or Rejected")

    leave.status = status_update.status
    db.commit()
    db.refresh(leave)
    return leave
