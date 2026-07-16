import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { LeaveRequest } from '../../types';

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/hrms/api/leave');
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leave History</h1>
        <p className="text-sm text-slate-400">View chronological history of all employee leave applications.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl space-y-4">
        {loading ? (
          <div className="text-center py-6 text-slate-500">Loading leave history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/20">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {leaves.map(req => (
                  <tr key={req.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-medium text-slate-200">
                      {req.employee_name} <span className="block text-[10px] text-slate-500 font-mono">{req.employee_id}</span>
                    </td>
                    <td className="p-4">{req.leave_type}</td>
                    <td className="p-4 text-xs text-slate-405">{req.start_date} to {req.end_date}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        req.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-500 p-4">No leave history records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
