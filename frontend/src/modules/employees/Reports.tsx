import React, { useState, useEffect } from 'react';
import { BarChart2, PieChart, Users, Star } from 'lucide-react';
import { Employee } from '../../types';

export default function Reports() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('/hrms/api/employees?size=100');
        if (res.ok) {
          const data = await res.json();
          setEmployees(data.items || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmployees();
  }, []);

  const totalCount = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Employee Analytics & Reports</h1>
        <p className="text-sm text-slate-400">View workforce demographic indicators and departmental statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Total Headcount</span>
            <span className="text-xl font-bold text-white">{totalCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Active Status</span>
            <span className="text-xl font-bold text-white">{activeCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Inactive Status</span>
            <span className="text-xl font-bold text-white">{inactiveCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Staff Breakdown by Department</h3>
          <BarChart2 className="h-4 w-4 text-slate-500" />
        </div>

        <div className="space-y-3">
          {["Engineering", "HR", "Sales", "Marketing"].map(dept => {
            const count = employees.filter(e => e.department === dept).length;
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 25;
            return (
              <div key={dept} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{dept}</span>
                  <span className="text-slate-400 font-semibold">{count} ({Math.round(pct)}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full" 
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
