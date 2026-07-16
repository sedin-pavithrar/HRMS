import React, { useState, useEffect } from 'react';
import { FileText, Eye, X } from 'lucide-react';
import { Payroll } from '../../types';

export default function Payslips() {
  const [payrollList, setPayrollList] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewPayslip, setViewPayslip] = useState<Payroll | null>(null);

  const fetchPayroll = async () => {
    try {
      const res = await fetch('/hrms/api/payroll');
      if (res.ok) {
        const data = await res.json();
        setPayrollList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payslips</h1>
        <p className="text-sm text-slate-400">Search and print corporate payslips and payout statements.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 bg-slate-900/20 border-b border-slate-800">
          <h2 className="text-md font-semibold text-white">Payroll Audit Registry</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/20">
                <th className="p-4">Employee</th>
                <th className="p-4">Pay Cycle</th>
                <th className="p-4 text-right">Basic Salary</th>
                <th className="p-4 text-right">Allowances</th>
                <th className="p-4 text-right">Deductions</th>
                <th className="p-4 text-right">Net Salary</th>
                <th className="p-4">Payout Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">Loading payroll history...</td>
                </tr>
              ) : payrollList.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-4 font-medium text-slate-200">
                    {pay.employee_name} <span className="block text-[10px] text-slate-500 font-mono">{pay.employee_id}</span>
                  </td>
                  <td className="p-4 font-mono text-xs">{pay.month}</td>
                  <td className="p-4 text-right font-mono">${pay.basic_salary.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono text-emerald-450">+${pay.allowance.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono text-rose-450">-${pay.deductions.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono text-white font-semibold">${pay.net_salary.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                      pay.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewPayslip(pay)}
                      className="p-1 hover:text-indigo-400 text-slate-400 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="h-4 w-4" />
                      View Payslip
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && payrollList.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">No payroll records logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewPayslip && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                Salary Payslip Statement
              </h3>
              <button onClick={() => setViewPayslip(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-850 pb-4">
                <div>
                  <h4 className="font-bold text-white">{viewPayslip.employee_name}</h4>
                  <p className="text-xs text-slate-500">Employee ID: {viewPayslip.employee_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Cycle Period</p>
                  <p className="font-mono text-sm text-indigo-400 font-medium">{viewPayslip.month}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Basic Earnings</span>
                  <span className="font-mono text-slate-200">${viewPayslip.basic_salary.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Allowances (HRA, TA, Bonus)</span>
                  <span className="font-mono text-emerald-450">+${viewPayslip.allowance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-3">
                  <span className="text-slate-400">Deductions (Taxes, PF)</span>
                  <span className="font-mono text-rose-450">-${viewPayslip.deductions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 text-base">
                  <span className="text-white">Net Take-Home Salary</span>
                  <span className="font-mono text-indigo-400">${viewPayslip.net_salary.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center py-2 px-3 bg-slate-950 border border-slate-800 rounded text-xs">
                <span className="text-slate-500">Statement Status:</span>
                <span className={`font-semibold ${viewPayslip.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewPayslip.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewPayslip(null)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-350 hover:text-white transition-colors"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
