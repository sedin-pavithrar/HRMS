import React, { useState, useEffect } from 'react';
import { DollarSign, BarChart2 } from 'lucide-react';
import { Payroll } from '../../types';

export default function PayrollReports() {
  const [payrollList, setPayrollList] = useState<Payroll[]>([]);

  useEffect(() => {
    async function fetchPayroll() {
      try {
        const res = await fetch('/hrms/api/payroll');
        if (res.ok) {
          const data = await res.json();
          setPayrollList(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchPayroll();
  }, []);

  const totalPaid = payrollList
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.net_salary, 0);

  const pendingCount = payrollList.filter(p => p.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payroll Reports</h1>
        <p className="text-sm text-slate-400">Financial summaries and audit indicators.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Total Disbursements (YTD)</span>
            <span className="text-xl font-bold text-white">${totalPaid.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Pending Approvals</span>
            <span className="text-xl font-bold text-white">{pendingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
