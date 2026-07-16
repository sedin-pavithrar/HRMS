import { useState, useEffect } from 'react';
import { Play, Square, Calendar, UserCheck, AlertTriangle } from 'lucide-react';
import { Attendance } from '../types';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // Clock action states
  const [employeeId, setEmployeeId] = useState('');
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/hrms/api/attendance');
      if (res.ok) {
        const data = await res.json();
        setAttendance(data);
      }
    } catch (err) {
      console.error("Error fetching attendance data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleClockIn = async () => {
    if (!employeeId) {
      setActionMessage({ text: 'Please enter your Employee ID first.', type: 'error' });
      return;
    }
    setActionMessage({ text: '', type: '' });
    const today = new Date().toISOString().split('T')[0];

    try {
      const res = await fetch('/hrms/api/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          date: today
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage({ 
          text: `Clocked In successfully at ${data.clock_in}! Status: ${data.status}`, 
          type: 'success' 
        });
        setEmployeeId('');
        fetchAttendance();
      } else {
        const err = await res.json();
        setActionMessage({ text: err.detail || 'Failed to Clock In.', type: 'error' });
      }
    } catch (err) {
      setActionMessage({ text: 'Connection issue. Try again later.', type: 'error' });
    }
  };

  const handleClockOut = async () => {
    if (!employeeId) {
      setActionMessage({ text: 'Please enter your Employee ID first.', type: 'error' });
      return;
    }
    setActionMessage({ text: '', type: '' });
    const today = new Date().toISOString().split('T')[0];

    try {
      const res = await fetch('/hrms/api/attendance/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          date: today
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage({ 
          text: `Clocked Out successfully at ${data.clock_out}!`, 
          type: 'success' 
        });
        setEmployeeId('');
        fetchAttendance();
      } else {
        const err = await res.json();
        setActionMessage({ text: err.detail || 'Failed to Clock Out.', type: 'error' });
      }
    } catch (err) {
      setActionMessage({ text: 'Connection issue. Try again later.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Attendance Records</h1>
        <p className="text-sm text-slate-400">Clock in/out for daily work shifts and view team attendance logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Punch Card / Actions */}
        <div className="glass-panel p-6 rounded-xl border border-darkBorder space-y-6 h-fit">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-accentBlue" />
            Punch Clock
          </h2>

          <div className="space-y-4">
            {actionMessage.text && (
              <div className={`p-3 rounded text-sm ${
                actionMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {actionMessage.text}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Employee ID</label>
              <input
                type="text"
                required
                placeholder="e.g. EMP001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-darkBg border border-darkBorder rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accentBlue font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleClockIn}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-emerald-600/10"
              >
                <Play className="h-4 w-4" />
                Clock In
              </button>
              <button
                onClick={handleClockOut}
                className="flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-rose-600/10"
              >
                <Square className="h-4 w-4" />
                Clock Out
              </button>
            </div>
            
            <div className="flex gap-2 text-slate-500 items-start text-xs leading-relaxed pt-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Clocking in after 09:15 AM marks the shift status as "Late". Clock In/Out values update the master calendar instantly.</span>
            </div>
          </div>
        </div>

        {/* History Log */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-darkBorder space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accentTeal" />
            Attendance Logs
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-darkBorder text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Clock In</th>
                  <th className="pb-3">Clock Out</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkBorder/30">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-500">Loading attendance data...</td>
                  </tr>
                ) : attendance.map(item => (
                  <tr key={item.id} className="hover:bg-darkCard/25">
                    <td className="py-3 font-medium text-slate-200">
                      {item.employee_name} <span className="block text-[10px] text-slate-500 font-mono">{item.employee_id}</span>
                    </td>
                    <td className="py-3 text-xs">{item.date}</td>
                    <td className="py-3 font-mono text-xs text-slate-400">{item.clock_in || '--:--:--'}</td>
                    <td className="py-3 font-mono text-xs text-slate-400">{item.clock_out || '--:--:--'}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' :
                        item.status === 'Late' ? 'bg-amber-500/20 text-amber-400' :
                        item.status === 'On Leave' ? 'bg-accentPurple/20 text-accentPurple rounded' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && attendance.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-500">No attendance logs registered yet today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
