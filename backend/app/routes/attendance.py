from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import Attendance, Employee
from ..schemas import AttendanceClockIn, AttendanceClockOut, AttendanceOut

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

@router.get("", response_model=List[AttendanceOut])
def get_attendance(db: Session = Depends(get_db)):
    return db.query(Attendance).order_by(Attendance.date.desc(), Attendance.id.desc()).all()

@router.post("/clock-in", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def clock_in(data: AttendanceClockIn, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.employee_id == data.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if already clocked in today
    existing = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id,
        Attendance.date == data.date
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Employee already clocked in today")

    now = datetime.now()
    clock_in_time = now.strftime("%H:%M:%S")

    # Determine status: late after 09:15:00
    is_late = now.time() > datetime.strptime("09:15:00", "%H:%M:%S").time()
    attn_status = "Late" if is_late else "Present"

    new_attn = Attendance(
        employee_id=data.employee_id,
        employee_name=emp.name,
        date=data.date,
        clock_in=clock_in_time,
        clock_out=None,
        status=attn_status
    )
    db.add(new_attn)
    db.commit()
    db.refresh(new_attn)
    return new_attn

@router.post("/clock-out", response_model=AttendanceOut)
def clock_out(data: AttendanceClockOut, db: Session = Depends(get_db)):
    # Find active clock-in for today
    attn = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id,
        Attendance.date == data.date
    ).first()

    if not attn:
        raise HTTPException(status_code=404, detail="No clock-in record found for today")

    if attn.clock_out:
        raise HTTPException(status_code=400, detail="Employee already clocked out today")

    now = datetime.now()
    attn.clock_out = now.strftime("%H:%M:%S")
    db.commit()
    db.refresh(attn)
    return attn
