import React, { useState, useEffect } from 'react';
import { Check, X, Calendar } from 'lucide-react';
import { LeaveRequest } from '../../types';

export default function LeaveApprovals() {
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

  const handleUpdateStatus = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch(`/hrms/api/leave/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchLeaves();
      }
    } catch (err) {
      console.error("Error updating leave request", err);
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leave Approvals</h1>
        <p className="text-sm text-slate-400">Manage and action pending staff leave requests.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl space-y-4">
        {loading ? (
          <div className="text-center py-6 text-slate-500">Loading pending requests...</div>
        ) : pendingLeaves.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">No leave requests require immediate approval.</div>
        ) : (
          <div className="space-y-4">
            {pendingLeaves.map(req => (
              <div key={req.id} className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700/80 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{req.employee_name}</span>
                    <span className="text-xs font-mono text-indigo-400">({req.employee_id})</span>
                    <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded font-semibold">{req.leave_type}</span>
                  </div>
                  <p className="text-xs text-slate-400">Duration: {req.start_date} to {req.end_date}</p>
                  <p className="text-xs text-slate-350 italic">" {req.reason || 'No reason provided' } "</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'Approved')}
                    className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                    className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
