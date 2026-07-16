import React from 'react';
import { BarChart3, Clock, AlertTriangle } from 'lucide-react';

export default function AttendanceReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Attendance Analytics</h1>
        <p className="text-sm text-slate-400">Detailed reports on punctuality rates and absences.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Average Punch In</span>
            <span className="text-xl font-bold text-white">08:52 AM</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Punctuality Issues</span>
            <span className="text-xl font-bold text-white">3 Active Cases</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl space-y-4">
        <h3 className="font-bold text-white text-sm">Monthly Attendance Summary</h3>
        <div className="space-y-3">
          {[
            { month: "June 2026", rate: "94.2%" },
            { month: "May 2026", rate: "93.8%" },
            { month: "April 2026", rate: "95.1%" }
          ].map(row => (
            <div key={row.month} className="flex justify-between items-center text-sm border-b border-slate-800/60 pb-2 last:border-b-0 last:pb-0">
              <span className="text-slate-300">{row.month}</span>
              <span className="text-indigo-400 font-mono font-semibold">{row.rate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
