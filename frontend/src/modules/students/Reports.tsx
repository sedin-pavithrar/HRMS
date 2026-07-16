import React from 'react';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Academic Analytics & Reports</h1>
        <p className="text-sm text-slate-400">Review key performance indices, enrollment distributions, and metrics.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Avg. Attendance</span>
            <span className="text-xl font-bold text-white">93.4%</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Enrollment Growth</span>
            <span className="text-xl font-bold text-white">+12.5%</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Graduation Rate</span>
            <span className="text-xl font-bold text-white">98.2%</span>
          </div>
        </div>
      </div>

      {/* Graphic representation */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Enrollment by Course</h3>
          <BarChart3 className="h-4 w-4 text-slate-500" />
        </div>

        <div className="space-y-3">
          {[
            { label: "Computer Science", count: 54, pct: 90 },
            { label: "Electrical Engineering", count: 41, pct: 75 },
            { label: "Mechanical Engineering", count: 32, pct: 60 },
            { label: "Business Administration", count: 76, pct: 95 }
          ].map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-slate-400 font-semibold">{item.count} Students</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full" 
                  style={{ width: `${item.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
