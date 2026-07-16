import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ApplyLeave() {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

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
      } else {
        const err = await res.json();
        setSubmitMessage({ text: err.detail || 'Failed to submit leave request.', type: 'error' });
      }
    } catch (err) {
      setSubmitMessage({ text: 'Connection issue. Try again later.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Apply for Leave</h1>
        <p className="text-sm text-slate-400">Submit requests for annual, sick, or casual leaves.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl space-y-6">
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
              className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-350 focus:outline-none focus:border-indigo-500"
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
                className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
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
              className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
