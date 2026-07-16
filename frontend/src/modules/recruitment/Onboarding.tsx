import React from 'react';
import { Award, CheckCircle, Clock } from 'lucide-react';

export default function Onboarding() {
  const steps = [
    { candidate: "Kyle Reese", role: "HR Generalist", startDate: "2026-08-01", status: "BG Verification Done", progress: 65 },
    { candidate: "Sarah Jane", role: "UX Architect", startDate: "2026-08-01", status: "Offer Accepted", progress: 30 },
    { candidate: "Jack Harkness", role: "Product Manager", startDate: "2026-08-15", status: "Asset Provisioning", progress: 90 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Employee Onboarding</h1>
        <p className="text-sm text-slate-400">Track task lists, background checks, and documentation check-ins.</p>
      </div>

      <div className="space-y-4">
        {steps.map(step => (
          <div key={step.candidate} className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-white text-md">{step.candidate}</h3>
                <span className="text-xs text-slate-500">{step.role} &bull; Starts {step.startDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full">
                <Clock className="h-3.5 w-3.5" />
                <span>{step.status}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span>{step.progress}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full" 
                  style={{ width: `${step.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
