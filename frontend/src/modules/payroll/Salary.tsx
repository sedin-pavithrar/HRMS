import React from 'react';
import { DollarSign } from 'lucide-react';

export default function Salary() {
  const bands = [
    { grade: "Executive (L4)", baseRange: "$90,000 - $140,000", allowances: "Standard HRA + Executive Bonus" },
    { grade: "Senior (L3)", baseRange: "$70,000 - $95,000", allowances: "Standard HRA + Health Incentive" },
    { grade: "Professional (L2)", baseRange: "$50,000 - $75,000", allowances: "Standard HRA + Travel Allowance" },
    { grade: "Associate (L1)", baseRange: "$35,000 - $52,000", allowances: "Standard HRA" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Salary Grades & Bands</h1>
        <p className="text-sm text-slate-400">Review organization-wide salary scales and benefit allowances.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-350">
          <thead>
            <tr className="bg-slate-900/20 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="p-4">Pay Grade</th>
              <th className="p-4">Annual Base Range</th>
              <th className="p-4">Configured Allowances</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {bands.map(band => (
              <tr key={band.grade} className="hover:bg-slate-900/20 transition-colors">
                <td className="p-4 font-semibold text-white">{band.grade}</td>
                <td className="p-4 font-mono text-indigo-400">{band.baseRange}</td>
                <td className="p-4 text-slate-400">{band.allowances}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
