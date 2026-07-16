import { useState, useEffect } from 'react';
import { DollarSign, FileText, CheckCircle, Clock, X, Eye } from 'lucide-react';
import { Payroll } from '../types';

export default function PayrollPage() {
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
      console.error("Error fetching payroll logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  // Compute stats
  const totalPaid = payrollList
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.net_salary, 0);

  const pendingCount = payrollList.filter(p => p.status === 'Pending').length;
  const processedMonths = Array.from(new Set(payrollList.map(p => p.month)));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Payroll Management</h1>
        <p className="text-sm text-slate-400">View corporate salary logs, payout history status, and print digital pay stubs.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-darkBorder flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">Total Disbursements (YTD)</p>
            <p className="text-2xl font-bold text-white">${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-darkBorder flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">Pending Approvals</p>
            <p className="text-2xl font-bold text-white">{pendingCount}</p>
          </div>
          <div className="bg-amber-500/20 p-3 rounded-lg text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-darkBorder flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">Processed Cycles</p>
            <p className="text-2xl font-bold text-white">{processedMonths.length}</p>
          </div>
          <div className="bg-accentPurple/20 p-3 rounded-lg text-accentPurple">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Payroll Listing Table */}
      <div className="glass-panel rounded-xl border border-darkBorder overflow-hidden">
        <div className="p-4 bg-darkCard/50 border-b border-darkBorder">
          <h2 className="text-md font-semibold text-white">Payroll Audit Registry</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-darkBorder text-slate-400 text-xs font-semibold uppercase tracking-wider bg-darkCard/20">
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
            <tbody className="divide-y divide-darkBorder/30">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">Loading payroll history...</td>
                </tr>
              ) : payrollList.map(pay => (
                <tr key={pay.id} className="hover:bg-darkCard/25 transition-colors">
                  <td className="p-4 font-medium text-slate-200">
                    {pay.employee_name} <span className="block text-[10px] text-slate-500 font-mono">{pay.employee_id}</span>
                  </td>
                  <td className="p-4 font-mono text-xs">{pay.month}</td>
                  <td className="p-4 text-right font-mono">${pay.basic_salary.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono text-emerald-400">+${pay.allowance.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono text-rose-400">-${pay.deductions.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono text-white font-semibold">${pay.net_salary.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                      pay.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewPayslip(pay)}
                      className="p-1 hover:text-accentBlue text-slate-400 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
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

      {/* Payslip Details Modal */}
      {viewPayslip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-xl border border-darkBorder overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-darkBorder pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-accentBlue" />
                Salary Payslip Statement
              </h3>
              <button onClick={() => setViewPayslip(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Print Slip Layout */}
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-darkBorder/40 pb-4">
                <div>
                  <h4 className="font-bold text-white">{viewPayslip.employee_name}</h4>
                  <p className="text-xs text-slate-400">Employee ID: {viewPayslip.employee_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Cycle Period</p>
                  <p className="font-mono text-sm text-accentTeal font-medium">{viewPayslip.month}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Basic Earnings</span>
                  <span className="font-mono text-slate-200">${viewPayslip.basic_salary.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Allowances (HRA, TA, Bonus)</span>
                  <span className="font-mono text-emerald-400">+${viewSlim(viewPayslip.allowance)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-darkBorder/20 pb-3">
                  <span className="text-slate-400">Deductions (Taxes, PF)</span>
                  <span className="font-mono text-rose-400">-${viewSlim(viewPayslip.deductions)}</span>
                </div>
                <div className="flex justify-between text-md font-bold pt-2">
                  <span className="text-white">Net Take-Home Salary</span>
                  <span className="font-mono text-accentBlue">${viewPayslip.net_salary.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center py-2 px-3 bg-darkBg border border-darkBorder rounded text-xs">
                <span className="text-slate-500">Statement Status:</span>
                <span className={`font-semibold ${viewPayslip.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewPayslip.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-darkBorder flex justify-end">
              <button
                onClick={() => setViewPayslip(null)}
                className="px-4 py-2 bg-darkCard border border-darkBorder rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
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

// Utility formatting helper
function viewSlim(val: number) {
  return val.toFixed(2);
}
