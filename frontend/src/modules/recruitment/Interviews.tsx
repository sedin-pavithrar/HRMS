import React from 'react';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';

export default function Interviews() {
  const interviewList = [
    { id: "INT-101", candidate: "Sarah Connor", role: "Senior React Developer", date: "2026-07-17", time: "10:00 AM - 11:00 AM", round: "Technical Round", panel: "Clara Oswald" },
    { id: "INT-102", candidate: "John Connor", role: "DevOps Engineer", date: "2026-07-17", time: "02:00 PM - 03:00 PM", round: "Architecture Round", panel: "John Smith" },
    { id: "INT-103", candidate: "Kyle Reese", role: "HR Generalist", date: "2026-07-18", time: "11:30 AM - 12:30 PM", round: "HR Fitment", panel: "Martha Jones" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Interview Schedules</h1>
        <p className="text-sm text-slate-400">View upcoming rounds, timings, and panel details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interviewList.map((interview) => (
          <div key={interview.id} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">
                  {interview.id}
                </span>
                <span className="text-xs text-slate-500">{interview.round}</span>
              </div>
              <h3 className="font-bold text-white text-md mt-2">{interview.candidate}</h3>
              <p className="text-xs text-slate-400">{interview.role}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/60 text-xs text-slate-405">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>{interview.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>{interview.time}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Interviewer: {interview.panel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
