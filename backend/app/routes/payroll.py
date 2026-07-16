from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Payroll
from ..schemas import PayrollOut

router = APIRouter(prefix="/api/payroll", tags=["Payroll"])

@router.get("", response_model=List[PayrollOut])
def get_payroll(db: Session = Depends(get_db)):
    return db.query(Payroll).order_by(Payroll.month.desc(), Payroll.id.desc()).all()
