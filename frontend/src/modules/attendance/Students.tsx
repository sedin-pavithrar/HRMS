import React, { useState } from 'react';
import { Check, X, ShieldAlert, Award } from 'lucide-react';

export default function StudentAttendance() {
  const [studentLogs, setStudentLogs] = useState([
    { id: "STU001", name: "Alice Johnson", course: "Computer Science", date: "2026-07-16", status: "Present" },
    { id: "STU002", name: "Bob Smith", course: "Electrical Engineering", date: "2026-07-16", status: "Absent" },
    { id: "STU003", name: "Charlie Brown", course: "Mechanical Engineering", date: "2026-07-16", status: "Present" }
  ]);

  const toggleStatus = (id: string) => {
    setStudentLogs(studentLogs.map(log => {
      if (log.id === id) {
        return {
          ...log,
          status: log.status === 'Present' ? 'Absent' : 'Present'
        };
      }
      return log;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Student Attendance Registry</h1>
        <p className="text-sm text-slate-400">Track and update daily attendance logs for active student sections.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-350">
          <thead>
            <tr className="bg-slate-900/20 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="p-4">Student</th>
              <th className="p-4">Course</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {studentLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-900/20 transition-colors">
                <td className="p-4">
                  <span className="font-semibold text-white block">{log.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.id}</span>
                </td>
                <td className="p-4 text-slate-400">{log.course}</td>
                <td className="p-4 text-xs">{log.date}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleStatus(log.id)}
                    className="text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:text-white px-3 py-1 rounded transition-colors"
                  >
                    Mark {log.status === 'Present' ? 'Absent' : 'Present'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
