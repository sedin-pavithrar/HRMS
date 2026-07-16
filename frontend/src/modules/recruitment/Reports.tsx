import React from 'react';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export default function RecruitmentReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruitment Reports</h1>
        <p className="text-sm text-slate-400">Review metrics on conversion rate, application channels, and hiring pipelines.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Total Candidates</span>
            <span className="text-xl font-bold text-white">124</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Offer Acceptance</span>
            <span className="text-xl font-bold text-white">88%</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Avg. Time to Hire</span>
            <span className="text-xl font-bold text-white">22 Days</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Hiring Source Efficiency</h3>
          <BarChart3 className="h-4 w-4 text-slate-500" />
        </div>

        <div className="space-y-3">
          {[
            { label: "LinkedIn Directory", count: 64, pct: 90 },
            { label: "Internal Referrals", count: 32, pct: 75 },
            { label: "Agency Sourcing", count: 18, pct: 50 },
            { label: "Direct Careers Portal", count: 10, pct: 30 }
          ].map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-slate-400 font-semibold">{item.count} Candidates</span>
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
