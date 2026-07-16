import React from 'react';
import { Award, Briefcase } from 'lucide-react';

export default function Designations() {
  const designationsList = [
    { title: "Senior Software Engineer", band: "L3", department: "Engineering" },
    { title: "QA Lead", band: "L3", department: "Engineering" },
    { title: "HR Business Partner", band: "L2", department: "HR" },
    { title: "Marketing Director", band: "L4", department: "Marketing" },
    { title: "Account Executive", band: "L2", department: "Sales" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Designation Registry</h1>
        <p className="text-sm text-slate-400">Review professional bands and job roles configured within the system.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="bg-slate-900/20 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="p-4">Job Role / Designation</th>
              <th className="p-4">Band Rank</th>
              <th className="p-4">Department Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {designationsList.map((desig) => (
              <tr key={desig.title} className="hover:bg-slate-900/20 transition-colors">
                <td className="p-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-400" />
                  <span className="font-semibold text-white">{desig.title}</span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-bold bg-indigo-500/10 text-indigo-400">
                    {desig.band}
                  </span>
                </td>
                <td className="p-4 text-slate-450">{desig.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
