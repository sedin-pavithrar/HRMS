import { useState, useEffect } from 'react';
import { Calendar, Check, X, FileText, Send } from 'lucide-react';
import { LeaveRequest } from '../types';

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Leave Form
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/hrms/api/leave');
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error("Error fetching leaves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage({ text: '', type: '' });

    try {
      const res = await fetch('/hrms/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason
        })
      });

      if (res.ok) {
        setSubmitMessage({ text: 'Leave application submitted successfully!', type: 'success' });
        setEmployeeId('');
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaves();
      } else {
        const err = await res.json();
        setSubmitMessage({ text: err.detail || 'Failed to submit leave request.', type: 'error' });
      }
    } catch (err) {
      setSubmitMessage({ text: 'Connection issue. Try again later.', type: 'error' });
    }
  };

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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Leave Management</h1>
        <p className="text-sm text-slate-400">Request vacation, sick or casual leaves, and process employee leave applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leave Form */}
        <div className="glass-panel p-6 rounded-xl border border-darkBorder space-y-6 h-fit">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Send className="h-5 w-5 text-accentBlue" />
            Apply for Leave
          </h2>

          <form onSubmit={handleApplyLeave} className="space-y-4">
            {submitMessage.text && (
              <div className={`p-3 rounded text-sm ${
                submitMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {submitMessage.text}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Employee ID</label>
              <input
                type="text"
                required
                placeholder="e.g. EMP005"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-darkBg border border-darkBorder rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accentBlue"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-darkBg border border-darkBorder rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-accentBlue"
              >
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-darkBg border border-darkBorder rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-accentBlue"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-darkBg border border-darkBorder rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-accentBlue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Reason</label>
              <textarea
                rows={3}
                placeholder="Provide a brief explanation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-darkBg border border-darkBorder rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accentBlue"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-accentBlue hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-accentBlue/20"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* History / Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Applications Review Panel */}
          <div className="glass-panel p-6 rounded-xl border border-darkBorder space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accentPurple" />
              Pending Approvals
            </h2>

            {loading ? (
              <div className="text-center py-6 text-slate-500">Loading pending requests...</div>
            ) : leaves.filter(l => l.status === 'Pending').length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">No leave requests require immediate approval.</div>
            ) : (
              <div className="space-y-4">
                {leaves.filter(l => l.status === 'Pending').map(req => (
                  <div key={req.id} className="p-4 bg-darkBg/60 border border-darkBorder rounded-lg flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{req.employee_name}</span>
                        <span className="text-xs font-mono text-accentBlue">({req.employee_id})</span>
                        <span className="text-xs px-2 py-0.5 bg-accentPurple/20 text-accentPurple rounded font-semibold">{req.leave_type}</span>
                      </div>
                      <p className="text-xs text-slate-400">Duration: {req.start_date} to {req.end_date}</p>
                      <p className="text-xs text-slate-300 italic">" {req.reason || 'No reason provided' } "</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'Approved')}
                        className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/35 rounded transition-colors"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                        className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/35 rounded transition-colors"
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

          {/* History log */}
          <div className="glass-panel p-6 rounded-xl border border-darkBorder space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-accentTeal" />
              Leave History
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-darkBorder text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Dates</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkBorder/30">
                  {leaves.map(req => (
                    <tr key={req.id} className="hover:bg-darkCard/25">
                      <td className="py-3 font-medium text-slate-200">
                        {req.employee_name} <span className="block text-[10px] text-slate-500 font-mono">{req.employee_id}</span>
                      </td>
                      <td className="py-3">{req.leave_type}</td>
                      <td className="py-3 text-xs text-slate-400">{req.start_date} to {req.end_date}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                          req.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leaves.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-slate-500">No leave history records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
